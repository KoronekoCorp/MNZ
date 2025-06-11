import { Suspense } from "react";
import Search from "../search";
import { Metadata } from 'next'
import Loading from "../loading";

export const metadata: Metadata = {
    title: '搜索',
}

export default async function Page(props: { params: Promise<{ word: string, page: string }> }) {
    const params = await props.params;
    return <Suspense fallback={<Loading word={params.word} page={parseInt(params.page)} />}>
        <Search search_word={params.word} page={parseInt(params.page)}></Search>
    </Suspense>
}