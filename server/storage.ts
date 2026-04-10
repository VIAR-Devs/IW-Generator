// Database storage implementation - referenced from blueprint:javascript_database
import { users, wills, type User, type InsertUser, type Will, type InsertWill } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Will methods
  getWill(id: number): Promise<Will | undefined>;
  getWillsByUserId(userId: number): Promise<Will[]>;
  createWill(insertWill: InsertWill): Promise<Will>;
  updateWill(id: number, updates: Partial<InsertWill>): Promise<Will | undefined>;
  deleteWill(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Will methods
  async getWill(id: number): Promise<Will | undefined> {
    const [will] = await db.select().from(wills).where(eq(wills.id, id));
    return will || undefined;
  }

  async getWillsByUserId(userId: number): Promise<Will[]> {
    return await db
      .select()
      .from(wills)
      .where(eq(wills.userId, userId))
      .orderBy(desc(wills.updatedAt));
  }

  async createWill(insertWill: InsertWill): Promise<Will> {
    const [will] = await db
      .insert(wills)
      .values(insertWill as any)
      .returning();
    return will;
  }

  async updateWill(id: number, updates: Partial<InsertWill>): Promise<Will | undefined> {
    const [will] = await db
      .update(wills)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(wills.id, id))
      .returning();
    return will || undefined;
  }

  async deleteWill(id: number): Promise<boolean> {
    const result = await db.delete(wills).where(eq(wills.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
