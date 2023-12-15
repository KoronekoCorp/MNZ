import { Suspense } from "react";
import Tags from "../tags";
import { Metadata } from 'next'
import Loading from "../loading";

export const metadata: Metadata = {
    title: '标签',
    description: '黑猫科技,毛线球Corp',
}

export default async function Page({ params }: { params: { tag: string, page: string } }) {
    return <Suspense fallback={<Loading tag={params.tag} page={parseInt(params.page)} />}>
        <Tags Tag={params.tag} page={parseInt(params.page)}></Tags>
    </Suspense>
}