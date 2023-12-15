'use client'
import Link from "next/link"
import { Chaper } from "@/Data/CiweiType"
import { convertTimestamp } from '../bookmark/convertTimestamp'
import { useEffect, useState } from "react"
import { books, Bookinfos } from "./book"
import { closeSnackbar, enqueueSnackbar } from "notistack"

export default function History() {
    const [H, setH] = useState<Chaper[]>([])
    const [force, setforce] = useState(0)
    const [Bookinfo, setBookinfo] = useState<Bookinfos>({})

    useEffect(() => {
        let i = 0
        const _h = []
        const Ids = []
        while (i < localStorage.length) {
            const key = localStorage.key(i)
            if (key?.startsWith("1")) {
                //@ts-ignore
                const r = JSON.parse(localStorage.getItem(key)) as Chaper
                _h.push(r)
                Ids.push(key)
            }
            ++i
        }
        setH(_h)
        books(Ids, Bookinfo).then((e) => setBookinfo(e))
    }, [force])

    const RemoveHis = (index: number) => {
        const chap = H[index]
        const id = chap.data.chapter_info.book_id
        const msg = Bookinfo[id]?.data.book_info.book_name ?? id
        localStorage.removeItem(id)
        setforce(force + 1)
        enqueueSnackbar(`已删除${msg}的历史记录`, {
            action: (id) => <button onClick={() => { Recover(chap); closeSnackbar(id) }} className='shadowed small'>撤销</button>,
            autoHideDuration: 5000, variant: "error"
        })
    }

    const Recover = (chap: Chaper) => {
        localStorage.setItem(chap.data.chapter_info.book_id, JSON.stringify(chap))
        const _h = H.slice()
        if (!_h.find(i => i.data.chapter_info.book_id == chap.data.chapter_info.book_id)) {
            _h.push(chap)
        }
        setH(_h)
        enqueueSnackbar('已恢复', { variant: "success" })
    }

    const Book = ({ r, index }: { r: Chaper, index: number }) => {
        const b = Bookinfo[r.data.chapter_info.book_id] ?? { data: { book_info: { cover: "/favicon.ico", book_name: "加载中" } } }

        return <div className="col-sm-6 col-md-3" key={r.data.chapter_info.book_id}>
            <div className="card fluid">
                <div className="section" id={r.data.chapter_info.book_id} style={{ height: "auto" }}>
                    <Link prefetch={false} href={`/book/${r.data.chapter_info.book_id}`} title={b.data.book_info.book_name}>
                        <img style={{ border: "1px ridge black", height: "60%" }} src={b.data.book_info.cover} />
                    </Link>
                    <h5>
                        <Link prefetch={false} className="book_title_search" href={`/book/${r.data.chapter_info.book_id}`} title={b.data.book_info.book_name}>
                            {b.data.book_info.book_name}
                        </Link>
                    </h5>
                    <p style={{ fontSize: 14 }}>
                        <i className="fa fa-hourglass-start" aria-hidden="true" />
                        <Link prefetch={false} href={`/chap/${r.data.chapter_info.chapter_id}`}>
                            {r.data.chapter_info.chapter_title.split("#")[0]}
                        </Link>
                        <br />
                        <small>
                            {convertTimestamp(parseInt(r.data.chapter_info.txt_content))}
                        </small>
                    </p>
                    <p>
                        <button className="secondary" onClick={() => { RemoveHis(index) }}>
                            <i className="fa fa-trash-o" aria-hidden="true" />
                        </button>
                    </p>
                </div>
            </div>
        </div>
    }

    return <>
        <title>历史</title>

        <div className="card fluid center" style={{ backgroundColor: "#ffefc8" }}>
            <h3>
                <i className="fa fa-history" aria-hidden="true" /> 24本最近读过的小说
            </h3>
        </div>
        <div className="container center" style={{ paddingTop: 10 }}>
            <div className="row" id="rhistory" >
                {H.map((r, i) => <Book r={r} index={i} key={r.data.chapter_info.book_id} />)}
            </div>
        </div>
    </>
}