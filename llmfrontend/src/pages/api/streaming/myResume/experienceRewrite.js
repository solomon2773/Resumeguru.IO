
// pages/api/updates.js
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // In production, replace '*' with your frontend's origin for security
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent({ message: 'SSE Connection Established.' });

    const intervalId = setInterval(() => {
        sendEvent({ timestamp: new Date().toISOString(), message: 'Hello from server' });
    }, 1000);

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
}
