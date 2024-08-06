"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStripeProductConfig = exports.exampleProducts = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const stripe_1 = __importDefault(require("stripe"));
exports.exampleProducts = [
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
    }
];
// Read the package.json file
const packageJsonPath = path_1.default.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf-8'));
const TOOL_VERSION = packageJson.version;
async function syncStripeProductConfig(options) {
    const stripe = new stripe_1.default(options.stripeSecretKey, {
        apiVersion: '2022-11-15',
    });
    try {
        const data = fs_1.default.readFileSync(options.inputFilePath, 'utf-8');
        const productsData = JSON.parse(data);
        let outputContent = `
// This file is auto-generated. Do not edit manually.
// Generated by Productize v${TOOL_VERSION}


export const STRIPE_PRODUCTS = {`;
        for (const productData of productsData) {
            const product = await stripe.products.create({
                name: productData.name,
                description: productData.description,
            });
            outputContent += `
  ${product.name.replace(/\s+/g, '_').toUpperCase()}: {
    ID: '${product.id}',
    PRICES: {`;
            for (const priceData of productData.prices) {
                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: priceData.unit_amount,
                    currency: priceData.currency,
                    recurring: priceData.recurring,
                });
                const formattedAmount = (priceData.unit_amount / 100).toFixed(2);
                outputContent += `
        ${priceData.name.replace(/\s+/g, '_').toUpperCase()}: {
          ID: '${price.id}',
          AMOUNT: '$${formattedAmount} USD',
        },`;
            }
            outputContent += `
    },
  },
`;
            console.log(`Created product: ${product.name} (${product.id})`);
        }
        outputContent += `};
`;
        fs_1.default.writeFileSync(options.outputFilePath, outputContent);
        console.log('Products and prices created successfully. IDs written to', options.outputFilePath);
    }
    catch (error) {
        console.error('Error applying Stripe product configuration:', error);
        throw error;
    }
}
exports.syncStripeProductConfig = syncStripeProductConfig;
