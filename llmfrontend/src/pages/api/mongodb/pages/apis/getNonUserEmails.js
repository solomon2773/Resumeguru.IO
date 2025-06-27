// src/pages/api/mongodb/pages/mockInterview/sttTTS.js
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const dbName2 = process.env.MONGODB_DB_NAME2;

// Middleware to verify Bearer token
const verifyAuthToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const validToken = process.env.API_AUTH_BEARER_TOKEN;
    if (token !== validToken) {
        throw new Error('Unauthorized');
    }
};

// Database utility to get MongoDB client
const getMongoClient = async () => {
    const client = new MongoClient(uri,
        {
        tlsCertificateKeyFile: process.env.MONGODB_CERTIFICATE_KEY_FILE ,
        serverApi: ServerApiVersion.v1
        });

    await client.connect();
    return client;

};



// Database actions
const getNonUserEmails = async (client, params) => {
    const { templateId } = params;

    const db2 = client.db(dbName2);
    const emailListCollection = db2.collection('user');

    const db = client.db(dbName);
    const userCollection = db.collection('user');
    const marketingEmailCollection = db.collection('marketingEmail');

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 30);

    const userEmailsCursor = await userCollection.find({}, { email: 1 });

    const userEmails = [];
    for await (const user of userEmailsCursor) {
        if (!userEmails.includes(user.email)) {
            userEmails.push(user.email);
        }
    }

    const marketingEmailsCursor = await marketingEmailCollection.find({
        templateId: templateId,
        createdAt: { $gte: daysAgo }
    }, { email: 1 });
    const marketingEmails = [];
    for await (const email of marketingEmailsCursor) {
        if (!marketingEmails.includes(email.email)) {
            marketingEmails.push(email.email);
        }
    }
    const allExcludedEmails = userEmails.concat(marketingEmails);

        // Fetch emails from emailListCollection that are not in existingEmails
    const nonExistingEmailsCursor = await emailListCollection.find({ Email: { $nin: allExcludedEmails } }, { Email: 1 });

    const nonExistingEmails = [];
    for await (const user of nonExistingEmailsCursor) {
        nonExistingEmails.push(user.Email);
    }

    return nonExistingEmails;
    
};



// Action router
const actionHandlers = {
    getNonUserEmails,
};

export default async function handler(req, res) {
    try {
        // Verify Bearer token
        verifyAuthToken(req);

        // Ensure method is POST
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            return;
        }

        // Parse request body
        const { action, ...params } = req.body;
        // Check if action exists
        if (!action || !actionHandlers[action]) {
            throw new Error('Invalid action specified');
        }
        // Initialize MongoDB client
        const client = await getMongoClient();
        // Call the appropriate action function
        const result = await actionHandlers[action](client, params);
        // Close the client connection
        await client.close();

        // Respond with the result
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).json({ success: false, status: error.message });
    }
}
