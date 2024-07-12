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
    return { success: true } as any
}