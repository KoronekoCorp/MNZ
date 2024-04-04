
export interface AnnouncementData {
    /**
     * 唯一
     */
    key: string

    /**
     * 校对值
     * @default 时间戳
     */
    value: string
    title: string
    body: string
    option: {
        mustAgree: boolean
        disable: boolean
        every: boolean
        Fullwidth: boolean
        maxWidth: "xs" | "sm" | "md" | "lg" | "xl" | false | undefined
    }
}