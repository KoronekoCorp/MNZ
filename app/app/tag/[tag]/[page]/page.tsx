import { Suspense } from "react";
import Tags from "../tags";
import { Metadata } from 'next'
import Loading from "../loading";

export const metadata: Metadata = {
    title: '标签',
    description: '黑猫科技,毛线球Corp',
}

export default async function Page(props: { params: Promise<{ tag: string, page: string }> }) {
    const params = await props.params;
    return <Suspense fallback={<Loading tag={params.tag} page={parseInt(params.page)} />}>
        <Tags Tag={params.tag} page={parseInt(params.page)}></Tags>
    </Suspense>
}