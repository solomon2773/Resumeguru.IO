// src/pages/api/mongodb/pages/mockInterview/sttTTS.js
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const collectionName = 'sttTTS';

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
const getConversations = async (client, params) => {
    const { userId, sessionId } = params;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return await collection.aggregate([
        {
            $match: {
                userId,
                sessionId,
                createdAt: { $exists: true },
            },
        },
        {
            $sort: {
                createdAt: 1,
            },
        },
        {
            $project: {
                _id: 1,
                chatId: 1,
                message: 1,
                sessionId: 1,
                sessionName: { $ifNull: ["$sessionName", ""] },
                messageLength: 1,
                msgResult: 1,
                type: 1,
                recommendedAnswer: 1,
                sttResult: 1,
                ttsResult: 1,
                messageWordCount: 1,
                avatarSpeakoutTime: 1,
                createdAt: 1,
            },
        },
    ]).toArray();
};

const addConversation = async (client, params) => {
    const { conversationData } = params;

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return await collection.insertOne(conversationData);
};

const deleteConversation = async (client, params) => {
    const { conversationId } = params;

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return await collection.deleteOne({ _id: new ObjectId(conversationId) });
};


// Action router
const actionHandlers = {
    getConversations,
    addConversation,
    deleteConversation,
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
