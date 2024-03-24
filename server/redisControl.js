import redis from 'redis'

// Create and connect the client. Newer versions of the 'redis' library use async connections.
const client = redis.createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379,
    }
});
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect(); // This is asynchronous but can be called without await here; errors will be caught by the 'error' event listener.

async function startScrape() {
    await client.set('shouldContinueScraping', 'true');
}

async function stopScrape() {
    await client.set('shouldContinueScraping', 'false');
}

async function canScrape() {
    const value = await client.get('shouldContinueScraping');
    return value === 'true'; // This will convert the string response to a boolean
}

export {startScrape, stopScrape, canScrape}