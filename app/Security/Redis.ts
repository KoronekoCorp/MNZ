import { RedisClientType, createClient } from 'redis';

let client: RedisClientType | undefined
let id: NodeJS.Timeout | undefined

async function UseRedis() {
    if (client == undefined) {
        client = createClient({
            password: process.env.SECURITY_REDIS_password,
            socket: {
                host: process.env.SECURITY_REDIS_host,
                port: parseInt(process.env.SECURITY_REDIS_port)
            }
        });
    }
    if (client.isOpen == false) {
        await client.connect()
        console.log("[REDIS CONNECTED]")
        if (id) {
            clearTimeout(id)
        }
        id = setTimeout(() => {
            client?.disconnect()
            console.log("[REDIS RELAESED]")
        }, 30000);
    }
    return client
}


export { UseRedis }