# Productize

Productize simplifies Stripe product management by syncing products and prices from a JSON config and generating TypeScript constants for your projects.

## Features

- Automate Stripe product and price creation/updates
- Generate TypeScript constants for easy product/price referencing
- CLI and programmatic usage options

## Installation

```bash
npm install -g productize
# or
bun add -g productize
```

## Input

Your products input JSON file should have the following structure:

```json
[
  {
    "name": "Basic Plan",
    "description": "Basic features for individuals",
    "prices": [
      {
        "name": "Monthly",
        "unit_amount": 999,
        "currency": "usd",
        "recurring": {
          "interval": "month"
        }
      },
      {
        "name": "Yearly",
        "unit_amount": 9990,
        "currency": "usd",
        "recurring": {
          "interval": "year"
        }
      }
    ]
  },
  // Add more products as needed
]
```

## Usage

### CLI

You can use this tool directly from the command line:

```bash
# Set stripe key
export STRIPE_SECRET_KEY=sk_your_stripe_secret_key

# Run the CLI
productize [input-file] [output-file]
```

Or run one-shot with `bunx`:

```bash
bunx productize [input-file] [output-file]
```

Arguments:

- `input-file`: Path to your JSON file with product data (default: `products.json`)
- `output-file`: Path where the TypeScript file will be generated (default: `products.ts`)

## Output

The tool will generate a TypeScript file with `SNAKE_CASE` constants for your Stripe products and prices:

`products.ts`
```typescript
// This file is auto-generated. Do not edit manually.
export const STRIPE_PRODUCTS = {
  BASIC_PLAN: {
    ID: 'prod_Qc1gQZpb89FTYN',
    PRICES: {
      MONTHLY: {
        ID: 'price_1PkndDBUsi1mfR0LbGg1Nwtk',
        AMOUNT: '$9.99 USD',
      },
      YEARLY: {
        ID: 'price_1PkndEBUsi1mfR0L3qMxfCMh',
        AMOUNT: '$99.90 USD',
      },
    },
  },
};
```

This can be used to reference Stripe products and prices in your codebase in a typesafe way, for example:

```typescript
import Stripe from 'stripe';
import { STRIPE_PRODUCTS } from './products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

stripe.checkout.sessions.create({
  mode: 'subscription',
  product: STRIPE_PRODUCTS.BASIC_PLAN.ID,
  price: STRIPE_PRODUCTS.BASIC_PLAN.PRICES.ID,
});
```

## Best Practices

- Keep the source `products.json` and auto-generated TypeScript file in version control.
- Run this tool in your CI/CD pipeline or during deployment to ensure Stripe product IDs and attributes are up-to-date.
- Use separate `STRIPE_SECRET_KEY`s for live and test modes to manage different environments.

## Contributing

Issues, pull requests, and forks are welcome, but this free side project may become unmaintained at any time.

## License

MIT

## Addendum: Programmatic Usage

You can also use this tool programmatically in your Node.js/Bun/Deno projects:

```javascript
import { syncStripeProductConfig } from 'productize';

await syncStripeProductConfig({
  stripeSecretKey: 'your_stripe_secret_key',
  inputFilePath: 'path/to/your/products.json',
  outputFilePath: 'path/to/output/products.ts'
});
console.log('Stripe products synced successfully.');
```