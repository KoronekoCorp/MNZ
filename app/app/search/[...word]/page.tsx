import { join } from 'path'
import { R } from '@/components/push'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '搜索',
}

export default async function Page(props: { params: Promise<{ word: string[] }> }) {
    const params = await props.params;
    var word = ""
    for (let i in params.word) {
        word = join(word, params.word[i])
    }

    //BUG.md.1
    word = decodeURIComponent(word)

    if (word.includes("book/")) {
        return <R url={`/book/${word.split("/").pop()}`} />
    }
    return <R url={`/search/${word.replaceAll("/", "")}`} />
}