import Tags from "../tags";
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '标签',
    description: '黑猫科技,毛线球Corp',
}

export default async function Page({ params }: { params: { tag: string, page: string } }) {
    return <Tags Tag={params.tag} page={parseInt(params.page)}></Tags>
}