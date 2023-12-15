declare namespace NodeJS {
    export interface ProcessEnv {
        DB_HOST_U: string
        DB_USER_U: string
        DB_SECRET_U: string
        DB_CHARSET_U: string
        DB_DB_U: string
        DB_POOT_U: string

        DB_HOST_New: string
        DB_USER_New: string
        DB_SECRET_New: string
        DB_CHARSET_New: string
        DB_DB_New: string
        DB_POOT_New: string

        SENTRY_DSN: string
        SENTRY_ORG: string
        CWM_MIRROR?: string

        DB_PROXY: string

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