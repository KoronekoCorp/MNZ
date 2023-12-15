import Search from './search'
import { Metadata } from 'next'
export const metadata: Metadata = {
    title: '搜索',
}

export default async function Page({ params }: { params: { word: string } }) {
    return <Search search_word={params.word} page={1}></Search>
}