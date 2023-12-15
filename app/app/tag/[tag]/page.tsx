import type { Metadata } from 'next'
import Tags from './tags'

export const metadata: Metadata = {
    title: '标签搜索',
    description: '黑猫科技,毛线球Corp',
}
export default async function Page({ params }: { params: { tag: string } }) {
    return <Tags Tag={params.tag} page={1} />
}