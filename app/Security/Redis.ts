import { type RedisClientType, createClient } from 'redis';

class R {
    client: RedisClientType
    id?: NodeJS.Timeout
    constructor() {
        this.client = createClient({
            password: process.env.SECURITY_REDIS_password,
            socket: {
                host: process.env.SECURITY_REDIS_host,
                port: parseInt(process.env.SECURITY_REDIS_port)
            }
        });
    }

    async get() {
        if (this.client.isOpen == false) {
            await this.client.connect()
        }
        if (this.id) clearTimeout(this.id)
        this.id = setTimeout(() => this.release(), 30000);
        return this.client
    }

    async release() {
        if (this.client.isOpen == true) {
            await this.client.quit()
        }
    }
}

const r = new R()

async function UseRedis() {
    return r.get()
}

export { UseRedis }