import Search from "../search";
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '搜索',
}

export default async function Page({ params }: { params: { word: string, page: string } }) {
    return <Search search_word={params.word} page={parseInt(params.page)}></Search>
}