import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log('Fetching available models...\n');

        // Try to list models
        const models = await genAI.listModels();

        console.log('Available models that support generateContent:');
        console.log('='.repeat(50));

        for await (const model of models) {
            if (model.supportedGenerationMethods.includes('generateContent')) {
                console.log('\n✓ Model Name:', model.name);
                console.log('  Display Name:', model.displayName);
                console.log('  Description:', model.description);
            }
        }
    } catch (error) {
        console.error('Error listing models:', error.message);
        console.error('\nTrying a simple test with gemini-pro...');

        // Try a simple request
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent('Say hello');
            console.log('Success! gemini-pro works:');
            console.log(result.response.text());
        } catch (testError) {
            console.error('gemini-pro also failed:', testError.message);
        }
    }
}

listModels();
