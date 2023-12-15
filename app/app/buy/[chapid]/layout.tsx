import { Suspense } from "react"
import Loading from "@/app/loading"

export default function RootLayout({
    children,
    tsukkomi
}: {
    children: React.ReactNode
    tsukkomi: React.ReactNode
}) {
    return <>
        <Suspense fallback={<Loading />}>
            {children}
            <Suspense fallback={<></>}>{tsukkomi}</Suspense>
        </Suspense>
    </>
}