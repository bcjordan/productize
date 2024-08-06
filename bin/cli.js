#!/usr/bin/env node

const fs = require('fs');
const { bootstrapStripeProducts, exampleProducts } = require('../dist');

// // load in stripe env var from user's .env file
// require('dotenv').config({ path: __dirname + '/.env' });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const inputFilePath = process.argv[2] || 'products.json';
const outputFilePath = process.argv[3] || 'products.ts';

if (!stripeSecretKey) {
  console.info('\n');
  console.error('STRIPE_SECRET_KEY environment variable is not set. Run it like this:');
  console.info(`

export STRIPE_SECRET_KEY=sk_test_1234567890 
productize

`);
  process.exit(1);
}


// check files exist, if not give the user example contents in output 
if (!fs.existsSync(inputFilePath)) {
  fs.writeFileSync(inputFilePath, JSON.stringify(exampleProducts, null, 2));
}


if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY environment variable is not set');
  process.exit(1);
}

bootstrapStripeProducts({
  stripeSecretKey,
  inputFilePath,
  outputFilePath,
})
  .then(() => console.log('Stripe products bootstrapped successfully'))
  .catch((error) => {
    console.error('Error bootstrapping Stripe products:', error);
    process.exit(1);
  });
