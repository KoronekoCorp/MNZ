"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { enqueueSnackbar } from "notistack"


export default function Button() {
    const router = useRouter()
    const [word, setWord] = useState("")


    return <>
        <div className="center">
            <form >
                <input
                    type="text"
                    name="q"
                    style={{ width: "45%" }}
                    placeholder="搜索感兴趣的书单"
                    className="s search-input"
                    onChange={(e) => { setWord(e.target.value) }}
                />
                <button onClick={(e) => {
                    e.preventDefault()
                    router.push(`/booklists/search/${word}`)
                }}>
                    <i className="fa fa-folder" aria-hidden="true" /> 搜索书单
                </button>
            </form>
        </div>
        <div className="center">
            <Link prefetch={false} className="shadowed button secondary" href="/booklists/hot">
                <i className="fa fa-fire" aria-hidden="true" /> 本月最热
            </Link>
            <Link prefetch={false} className="shadowed button secondary" href="/booklists/new">
                <i className="fa fa-history" aria-hidden="true" /> 最近更新
            </Link>
            <Link prefetch={false} className="shadowed button secondary" href="/booklists/top">
                <i className="fa fa-line-chart" aria-hidden="true" /> 最多收藏
            </Link>
        </div>

    </>

}

interface book_mark {
    "name": string
    "id": string
    "cover": string
}

export function Fav({ id, cover, name }: { id: string, cover: string, name: string }) {
    const bookmark = () => {
        let book_mark: book_mark[] = [];
        book_mark = JSON.parse(localStorage.getItem("booklist_mark") ?? "[]");
        if (!book_mark.find(item => item.id === id)) {
            book_mark.push({ name: name, id: id, cover: cover });
            localStorage.setItem("booklist_mark", JSON.stringify(book_mark))
        }
        enqueueSnackbar("添加完成~", { variant: "success" })
    }

    return <button className="shadowed small primary" onClick={bookmark} style={{ maxWidth: "max-content", alignSelf: "center" }}>
        <i className="fa fa-bookmark" aria-hidden="true" /> 放入书架
    </button>
}