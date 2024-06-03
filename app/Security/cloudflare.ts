import { isIPv6 } from "net"

class cloudflare {
    private Authorization = process.env.cloudflare
    private zone = process.env.zone

    async POST(url: string | URL, body: string) {
        return (await fetch(url, {
            method: "POST",
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.Authorization}`
            }
        })).json()
    }

    async postWAF(ip: string, mode: "block" | "challenge" | "whitelist" | "js_challenge" | "managed_challenge") {
        const url = `https://api.cloudflare.com/client/v4/zones/${this.zone}/firewall/access_rules/rules`
        const v6 = isIPv6(ip)
        switch (mode) {
            case "block":
                const r = await this.POST(url, JSON.stringify({
                    "configuration": {
                        "target": v6 ? "ipv6" : "ip",
                        "value": ip
                    }, "mode": mode, "notes": ""
                }))
                console.log(r)
            case "challenge":
                const r2 = await this.POST(url, JSON.stringify({
                    "configuration": {
                        "target": "ip_range",
                        "value": v6 ? ip + "/48" : ip + "/24"
                    }, "mode": mode, "notes": ""
                }))
                console.log(r2)
        }
    }
}

const cf = new cloudflare()
export default cf