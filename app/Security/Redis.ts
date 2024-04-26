import { createClient } from 'redis';

async function UseRedis() {
    const client = createClient({
        password: process.env.SECURITY_REDIS_password,
        socket: {
            host: process.env.SECURITY_REDIS_host,
            port: parseInt(process.env.SECURITY_REDIS_port)
        }
    });

    if (client.isOpen == false) {
        await client.connect()
        console.log("[REDIS CONNECTED]")
    }
    return client
}


export { UseRedis }