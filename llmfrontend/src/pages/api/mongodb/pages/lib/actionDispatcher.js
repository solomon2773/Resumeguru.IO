import { mongodbConnector } from "./mongodbConnector";

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

export const actionDispatcher = async (req, res, actionHandlers) => {
    try {
      // Verify authentication
      verifyAuthToken(req);
  
      // Check for POST method
      if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
      }

      const { action, ...params } = req.body;
      // Validate action
      if (!action || !actionHandlers[action]) {
        throw new Error('Invalid action specified');
      }
  
      // Connect to MongoDB
      const client = await mongodbConnector();
  
      // Execute the action handler
      const result = await actionHandlers[action](client, params);
  
      // Send success response
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(400).json({ success: false, status: error.message });
    }
  };
