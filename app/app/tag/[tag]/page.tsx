import type { Metadata } from 'next'
import Tags from './tags'
import { Suspense } from 'react'
import Loading from './loading'

export const metadata: Metadata = {
    title: '标签搜索',
    description: '黑猫科技,毛线球Corp',
}
export default async function Page(props: { params: Promise<{ tag: string }> }) {
    const params = await props.params;
    return <Suspense fallback={<Loading tag={params.tag} page={1} />}>
        <Tags Tag={params.tag} page={1} />
    </Suspense>
}