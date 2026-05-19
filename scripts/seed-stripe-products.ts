// Seed script for creating Islamic Will product in Stripe
// Run this manually to create the product: npx tsx scripts/seed-stripe-products.ts

import { getUncachableStripeClient } from '../server/stripeClient';

async function createIslamicWillProduct() {
  const stripe = await getUncachableStripeClient();

  // Check if product already exists
  const existingProducts = await stripe.products.search({ 
    query: "name:'Islamic Will Generator'" 
  });
  
  if (existingProducts.data.length > 0) {
    console.log('Islamic Will product already exists:');
    console.log('Product ID:', existingProducts.data[0].id);
    
    // Get existing prices
    const prices = await stripe.prices.list({ 
      product: existingProducts.data[0].id,
      active: true 
    });
    
    if (prices.data.length > 0) {
      console.log('Price ID:', prices.data[0].id);
      console.log('\nSet this in your environment: STRIPE_WILL_PRICE_ID=' + prices.data[0].id);
    }
    return;
  }

  console.log('Creating Islamic Will product...');

  // Create the Islamic Will product
  const product = await stripe.products.create({
    name: 'Islamic Will Generator',
    description: 'Shariah-compliant will document for UK Muslims. Includes professional PDF generation, Faraid-compliant inheritance distribution, and secure storage.',
    metadata: {
      category: 'legal_document',
      region: 'uk',
      type: 'islamic_will',
    },
  });

  console.log('Product created:', product.id);

  // Create the price (one-time payment of £50)
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 5000, // £50 in pence
    currency: 'gbp',
  });

  console.log('Price created:', price.id);
  console.log('\nSet this environment variable:');
  console.log('STRIPE_WILL_PRICE_ID=' + price.id);
}

createIslamicWillProduct()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
