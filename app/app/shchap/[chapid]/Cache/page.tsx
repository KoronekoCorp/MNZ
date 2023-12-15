import { UseDB } from "@/Data/UseDB"
import { R } from "@/components/push"
import { revalidateTag } from "next/cache"


export default async function Page({ params }: { params: { chapid: string } }) {
    const [db, db_n] = UseDB()
    revalidateTag(`${db_n}_shChap_${params.chapid}`)
    return <R url={`/shchap/${params.chapid}`} />
}