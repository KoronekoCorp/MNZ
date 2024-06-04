import { Suspense } from "react"
import Loading from "@/app/loading"

export default function RootLayout({
    children,
    tsukkomi,
    Security
}: {
    children: React.ReactNode
    tsukkomi: React.ReactNode
    Security: React.ReactNode
}) {
    return <>
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
        <Suspense fallback={<></>}>{tsukkomi}</Suspense>
        {Security}
    </>
}
