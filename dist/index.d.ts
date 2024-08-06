export declare const exampleProducts: {
    name: string;
    description: string;
    prices: {
        name: string;
        unit_amount: number;
        currency: string;
        recurring: {
            interval: string;
        };
    }[];
}[];
export declare function syncStripeProductConfig(options: {
    stripeSecretKey: string;
    inputFilePath: string;
    outputFilePath: string;
}): Promise<void>;
