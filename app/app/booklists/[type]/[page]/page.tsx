import { notFound } from 'next/navigation'
import BookLists from '../../booklists'
import Booklist from '../../Booklist'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '书单',
    description: '黑猫科技,毛线球Corp',
}


export default async function Page(props: { params: Promise<{ type: string, page: string }> }) {
    const params = await props.params;
    if (["hot", "new", "top"].includes(params.type)) {
        //@ts-ignore
        return <BookLists type={params.type} page={parseInt(params.page)} />
    }
    try {
        const ID = parseInt(params.type)
        return <Booklist id={ID} page={parseInt(params.page)} />
    } catch {
        notFound()
    }
}