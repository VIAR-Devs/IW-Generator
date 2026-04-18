import { getUncachableResendClient } from './resend-client';
import { getWelcomeEmailHtml, getWelcomeEmailText } from '../templates/welcome-email';
import { getFollowUpEmailHtml, getFollowUpEmailText } from '../templates/follow-up-email';
import { getBroadcastEmailHtml, getBroadcastEmailText } from '../templates/broadcast-email';
import { db } from '../db';
import { users, scheduledJobs } from '@shared/schema';
import { eq, and, lte, sql, gte } from 'drizzle-orm';

interface OnboardingStats {
  totalUsersOnboarded: number;
  welcomeEmailsSent: number;
  welcomeEmailsFailed: number;
  followUpEmailsPending: number;
  followUpEmailsSent: number;
  followUpEmailsFailed: number;
}

// In-memory tracking for email stats (for MVP - would be database tables in production)
const emailStats = {
  welcomeEmailsSent: 0,
  welcomeEmailsFailed: 0,
  followUpEmailsSent: 0,
  followUpEmailsFailed: 0,
};

// In-memory queue for scheduled follow-ups (for MVP - would use a job queue in production)
const scheduledFollowUps = new Map<number, NodeJS.Timeout>();

export async function sendWelcomeEmail(
  email: string,
  fullName: string,
  retryCount = 0
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const result = await client.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Welcome to Islamic Wills - Complete Your Will in 10 Minutes',
      html: getWelcomeEmailHtml(fullName),
      text: getWelcomeEmailText(fullName),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    emailStats.welcomeEmailsSent++;
    console.log(`Welcome email sent successfully to ${email}`);
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to send welcome email to ${email}:`, error.message);
    
    // Retry logic (max 3 attempts)
    if (retryCount < 2) {
      console.log(`Retrying welcome email to ${email} (attempt ${retryCount + 2}/3)...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1))); // Exponential backoff
      return sendWelcomeEmail(email, fullName, retryCount + 1);
    }
    
    emailStats.welcomeEmailsFailed++;
    return { success: false, error: error.message };
  }
}

export async function sendFollowUpEmail(
  email: string,
  fullName: string,
  retryCount = 0
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const result = await client.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Ready to Complete Your Islamic Will?',
      html: getFollowUpEmailHtml(fullName),
      text: getFollowUpEmailText(fullName),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    emailStats.followUpEmailsSent++;
    console.log(`Follow-up email sent successfully to ${email}`);
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to send follow-up email to ${email}:`, error.message);
    
    // Retry logic (max 3 attempts)
    if (retryCount < 2) {
      console.log(`Retrying follow-up email to ${email} (attempt ${retryCount + 2}/3)...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
      return sendFollowUpEmail(email, fullName, retryCount + 1);
    }
    
    emailStats.followUpEmailsFailed++;
    return { success: false, error: error.message };
  }
}

export async function scheduleFollowUpEmail(
  userId: number,
  email: string,
  fullName: string,
  delayMs: number = 3 * 24 * 60 * 60 * 1000 // 3 days default
): Promise<void> {
  try {
    // Create persistent job in database
    const scheduledFor = new Date(Date.now() + delayMs);
    
    await db.insert(scheduledJobs).values({
      userId,
      jobType: 'follow_up_email',
      scheduledFor,
      status: 'pending',
      attempts: 0,
    });

    console.log(`Follow-up email scheduled for user ${userId} at ${scheduledFor.toISOString()}`);
    
    // Also keep in-memory scheduler for immediate processing
    const existing = scheduledFollowUps.get(userId);
    if (existing) {
      clearTimeout(existing);
    }

    const timeout = setTimeout(async () => {
      console.log(`Sending scheduled follow-up email to ${email}...`);
      await sendFollowUpEmail(email, fullName);
      
      // Mark job as completed in database
      await db.update(scheduledJobs)
        .set({ status: 'completed', lastAttemptAt: new Date() })
        .where(and(
          eq(scheduledJobs.userId, userId),
          eq(scheduledJobs.jobType, 'follow_up_email'),
          eq(scheduledJobs.status, 'pending')
        ));
      
      scheduledFollowUps.delete(userId);
    }, delayMs);

    scheduledFollowUps.set(userId, timeout);
  } catch (error: any) {
    console.error(`Failed to schedule follow-up for user ${userId}:`, error.message);
    throw error;
  }
}

export async function updateUserOnboardingStatus(
  userId: number,
  status: 'pending' | 'welcome_sent' | 'follow_up_sent' | 'completed',
  signupSource?: string
): Promise<void> {
  try {
    const updateData: any = {
      onboardingStatus: status,
    };

    if (status === 'welcome_sent' && !signupSource) {
      updateData.onboardingStartedAt = new Date();
    }

    if (signupSource) {
      updateData.signupSource = signupSource;
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    console.log(`User ${userId} onboarding status updated to: ${status}`);
  } catch (error: any) {
    console.error(`Failed to update user ${userId} onboarding status:`, error.message);
    throw error;
  }
}

export async function triggerOnboardingFlow(
  userId: number,
  email: string,
  fullName: string,
  signupSource: string = 'web'
): Promise<void> {
  try {
    console.log(`Starting onboarding flow for user ${userId} (${email})...`);

    // Step 1: Send welcome email
    const welcomeResult = await sendWelcomeEmail(email, fullName);
    
    if (welcomeResult.success) {
      // Step 2: Update user status
      await updateUserOnboardingStatus(userId, 'welcome_sent', signupSource);
      
      // Step 3: Schedule follow-up email for 3 days later
      await scheduleFollowUpEmail(userId, email, fullName);
      
      console.log(`Onboarding flow completed successfully for user ${userId}`);
    } else {
      console.error(`Onboarding flow failed for user ${userId}: ${welcomeResult.error}`);
      throw new Error(welcomeResult.error);
    }
  } catch (error: any) {
    console.error(`Error in onboarding flow for user ${userId}:`, error.message);
    throw error;
  }
}

export async function getOnboardingStats(): Promise<OnboardingStats> {
  try {
    // Get total users with onboarding status
    const allUsers = await db.select().from(users);
    
    const totalUsersOnboarded = allUsers.filter(
      u => u.onboardingStatus && u.onboardingStatus !== 'pending'
    ).length;

    return {
      totalUsersOnboarded,
      welcomeEmailsSent: emailStats.welcomeEmailsSent,
      welcomeEmailsFailed: emailStats.welcomeEmailsFailed,
      followUpEmailsPending: scheduledFollowUps.size,
      followUpEmailsSent: emailStats.followUpEmailsSent,
      followUpEmailsFailed: emailStats.followUpEmailsFailed,
    };
  } catch (error: any) {
    console.error('Error fetching onboarding stats:', error.message);
    throw error;
  }
}

export async function cancelScheduledFollowUp(userId: number): Promise<void> {
  const timeout = scheduledFollowUps.get(userId);
  if (timeout) {
    clearTimeout(timeout);
    scheduledFollowUps.delete(userId);
    console.log(`Cancelled scheduled follow-up for user ${userId}`);
  }
}

// Broadcast email to multiple users with batch processing
export async function sendBroadcastEmails(
  subject: string,
  message: string,
  userFilter: 'all' | 'last_7_days' | 'last_30_days'
): Promise<{ totalSent: number; totalFailed: number; errors: string[] }> {
  try {
    console.log(`Starting broadcast email: "${subject}" with filter: ${userFilter}`);
    
    // Build query based on filter
    let query = db.select().from(users);
    const now = new Date();
    
    if (userFilter === 'last_7_days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query = query.where(gte(users.createdAt, sevenDaysAgo)) as any;
    } else if (userFilter === 'last_30_days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      query = query.where(gte(users.createdAt, thirtyDaysAgo)) as any;
    }
    // 'all' filter doesn't add any WHERE clause - selects all users
    
    const recipients = await query;
    console.log(`Found ${recipients.length} recipients for broadcast`);
    
    if (recipients.length === 0) {
      return { totalSent: 0, totalFailed: 0, errors: [] };
    }
    
    const { client, fromEmail } = await getUncachableResendClient();
    
    let totalSent = 0;
    let totalFailed = 0;
    const errors: string[] = [];
    const BATCH_SIZE = 50;
    
    // Process in batches to avoid rate limits
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(recipients.length / BATCH_SIZE)}`);
      
      // Send emails in parallel within batch
      const batchPromises = batch.map(async (user) => {
        try {
          const result = await client.emails.send({
            from: fromEmail,
            to: user.email,
            subject,
            html: getBroadcastEmailHtml(subject, message, user.fullName),
            text: getBroadcastEmailText(subject, message, user.fullName),
          });
          
          if (result.error) {
            throw new Error(result.error.message);
          }
          
          totalSent++;
          return { success: true, email: user.email };
        } catch (error: any) {
          totalFailed++;
          const errorMsg = `Failed to send to ${user.email}: ${error.message}`;
          errors.push(errorMsg);
          console.error(errorMsg);
          return { success: false, email: user.email, error: error.message };
        }
      });
      
      await Promise.all(batchPromises);
      
      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`Broadcast complete: ${totalSent} sent, ${totalFailed} failed`);
    
    return {
      totalSent,
      totalFailed,
      errors,
    };
  } catch (error: any) {
    console.error('Error in sendBroadcastEmails:', error.message);
    throw error;
  }
}

// Send notification to team (Tabs) when user requests personal guidance
export async function sendAssistanceNotification(data: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  currentStep: number;
}): Promise<{ success: boolean; error?: string }> {
  const stepNames = [
    '', 'Basic Details', 'Executors', 'Guardians', 'Funeral Preferences',
    'Wasiyyah', 'Heirs Snapshot', 'Optional Add-Ons', 'Review', 'Payment'
  ];

  const stepName = stepNames[data.currentStep] || `Step ${data.currentStep}`;
  const teamEmail = process.env.ASSISTANCE_NOTIFICATION_EMAIL || 'tab_rashid@hotmail.co.uk';
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  try {
    const { client, fromEmail } = await getUncachableResendClient();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a5c2e;">New Assistance Request - Islamic Will Generator</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Name:</strong> ${esc(data.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${esc(data.email)}">${esc(data.email)}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${esc(data.phone)}">${esc(data.phone)}</a></p>
          <p><strong>Stopped at:</strong> ${stepName} (step ${data.currentStep} of 9)</p>
          ${data.message ? `<p><strong>Message:</strong> ${esc(data.message)}</p>` : ''}
        </div>
        <p>This person started creating their Islamic Will online and has requested personal guidance. Please contact them within 24 hours.</p>
        <p style="color: #666; font-size: 12px; margin-top: 24px;">
          Sent from Islamic Will Generator - <a href="https://iw-generator.replit.app/admin">View Dashboard</a>
        </p>
      </div>
    `;

    const text = `New Assistance Request - Islamic Will Generator\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nStopped at: ${stepName} (step ${data.currentStep} of 9)\n${data.message ? `Message: ${data.message}\n` : ''}\nPlease contact them within 24 hours.`;

    const result = await client.emails.send({
      from: fromEmail,
      to: teamEmail,
      subject: `[IW] Assistance Request from ${data.name} - stopped at ${stepName}`,
      html,
      text,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    console.log(`Assistance notification sent to ${teamEmail} for ${data.name}`);
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to send assistance notification for ${data.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Process pending scheduled jobs (called on server startup)
export async function rehydrateScheduledJobs(): Promise<void> {
  try {
    console.log('Rehydrating scheduled jobs from database...');
    
    // Get all pending jobs
    const pendingJobs = await db
      .select()
      .from(scheduledJobs)
      .innerJoin(users, eq(scheduledJobs.userId, users.id))
      .where(eq(scheduledJobs.status, 'pending'));

    console.log(`Found ${pendingJobs.length} pending jobs to process`);

    for (const job of pendingJobs) {
      const scheduledFor = new Date(job.scheduled_jobs.scheduledFor);
      const now = new Date();
      const delayMs = scheduledFor.getTime() - now.getTime();

      if (delayMs <= 0) {
        // Job is overdue - send immediately
        console.log(`Processing overdue job ${job.scheduled_jobs.id} for user ${job.users.email}`);
        
        if (job.scheduled_jobs.jobType === 'follow_up_email') {
          const result = await sendFollowUpEmail(job.users.email, job.users.fullName);
          
          await db.update(scheduledJobs)
            .set({ 
              status: result.success ? 'completed' : 'failed',
              attempts: (job.scheduled_jobs.attempts || 0) + 1,
              lastAttemptAt: new Date()
            })
            .where(eq(scheduledJobs.id, job.scheduled_jobs.id));
        }
      } else {
        // Schedule for future
        console.log(`Rescheduling job ${job.scheduled_jobs.id} for ${scheduledFor.toISOString()}`);
        
        const timeout = setTimeout(async () => {
          if (job.scheduled_jobs.jobType === 'follow_up_email') {
            await sendFollowUpEmail(job.users.email, job.users.fullName);
            
            await db.update(scheduledJobs)
              .set({ status: 'completed', lastAttemptAt: new Date() })
              .where(eq(scheduledJobs.id, job.scheduled_jobs.id));
          }
          
          scheduledFollowUps.delete(job.users.id);
        }, delayMs);

        scheduledFollowUps.set(job.users.id, timeout);
      }
    }

    console.log('Job rehydration complete');
  } catch (error: any) {
    console.error('Error rehydrating scheduled jobs:', error.message);
  }
}
