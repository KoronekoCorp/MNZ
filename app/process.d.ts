declare namespace NodeJS {
    export interface ProcessEnv {
        DB_HOST_1: string
        DB_USER_1: string
        DB_SECRET_1: string
        DB_CHARSET_1: string
        DB_DB_1: string

        SENTRY_DSN: string
        SENTRY_ORG: string
        CWM_MIRROR?: string

        DB_PROXY: string
        DB_PROXY2: string

        s3_access_key: string
        s3_secret_key: string
        s3_endpoint: string
        s3_bucket: string

        SECURITY_REDIS_password: string
        SECURITY_REDIS_host: string
        SECURITY_REDIS_port: string

        OA_URL: string
        OACOOKIE: string
    }
}

declare interface Window {
    TOP?: { [key: string]: undefined | true }
}