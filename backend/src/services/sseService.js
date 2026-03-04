/**
 * SSE (Server-Sent Events) Event Emitter
 * Manages connected clients and broadcasts image change events
 */

let clients = [];

/**
 * SSE endpoint handler — keeps connection open
 */
const subscribe = (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    // Add client
    const clientId = Date.now();
    clients.push({ id: clientId, res });
    console.log(`📡 SSE client connected: ${clientId} (total: ${clients.length})`);

    // Remove client on disconnect
    req.on('close', () => {
        clients = clients.filter((c) => c.id !== clientId);
        console.log(`📡 SSE client disconnected: ${clientId} (total: ${clients.length})`);
    });
};

/**
 * Broadcast an event to all connected SSE clients
 */
const broadcast = (eventType) => {
    const data = JSON.stringify({ type: eventType, timestamp: Date.now() });
    clients.forEach((client) => {
        client.res.write(`data: ${data}\n\n`);
    });
    console.log(`📡 SSE broadcast "${eventType}" to ${clients.length} clients`);
};

module.exports = { subscribe, broadcast };
