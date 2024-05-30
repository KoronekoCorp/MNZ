interface success {
    "success": true,
    "error-codes": [],
    "challenge_ts": string,
    "hostname": string
}

interface error {
    "success": false,
    "error-codes": string[],
    "messages": string[]
}

export async function Check(token: string): Promise<success | error> {
    return (await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: `secret=${process.env.TurnstileS}&response=${token}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })).json()
}