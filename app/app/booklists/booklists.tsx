import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB"
import { UserchapInfo } from "@/Data/DataType"
import Button from "./client"
import Link from "next/link"
import { unstable_cache } from "next/cache"
import { PaginationElement } from "../../components/Pagination"

export default async function Page({ type, page }: { type: "hot" | "new" | "top", page: number }) {
    const a = await UseAPI()
    const r = await a.booklists(type, page)

    const [db, db_n] = UseDB()
    const Userchap = async ({ bookid }: { bookid: number | string }) => {
        let userchap: UserchapInfo[]
        let error: JSX.Element | undefined
        try {
            userchap = await unstable_cache(async () => db.UserchapInfo(bookid),
                [`UserchapInfo_${bookid}`], { revalidate: 86400, tags: [`UserchapInfo_${bookid}`] })()
        } catch { userchap = [{ chapters: 0, modes: null }]; error = <span className="console-error">数据库错误</span> }

        const Userchap = userchap
        const icons = [];
        if (error) { icons.push(error) }
        if (Userchap[0].chapters) {
            icons.push(`${Userchap[0].chapters} | `)
            if (Userchap[0].modes?.includes('vip')) {
                icons.push(<><span key="vip" style={{ color: '#6C00FF' }}><i className="fa fa-battery-full" aria-hidden="true"></i></span>  </>);
            }
            if (Userchap[0].modes?.includes('marauder')) {
                icons.push(<><span key="marauder" style={{ color: '#6C00FF' }}><i className="fa fa-battery-half" aria-hidden="true"></i></span>  </>);
            }
            if (Userchap[0].modes?.includes('post')) {
                icons.push(<span key="post" style={{ color: '#6C00FF' }}><i className="fa fa-battery-quarter" aria-hidden="true"></i></span>);
            }
        }
        return icons;
    }

    return <>
        <Button />
        {r.data.booklists.map((booklist) => {
            return <>
                <div className="shadowed" key={booklist.list_id}>
                    <div className="card fluid center div_color_yellow1">
                        <h3>
                            <i className="fa fa-external-link-square" aria-hidden="true" />
                            <Link prefetch={false} href={`/booklists/${booklist.list_id}`}>{booklist.list_name}</Link> ({' '}
                            <i className="fa fa-calculator" aria-hidden="true" /> {booklist.book_num}{' '} /
                            <i className="fa fa-anchor" aria-hidden="true" /> {booklist.favor_num}{' '} )
                        </h3>
                    </div>
                    <div className="row center">
                        {booklist.book_info_list.map((e) => <div className="col-sm-6 col-md-3" key={e.book_id}>
                            <div className="card fluid">
                                <div className="section" style={{ height: 'auto' }}>
                                    <Link prefetch={false} href={`/book/${e.book_id}`} title={e.book_name}>
                                        <img
                                            style={{ border: "1px ridge black", height: "60%" }}
                                            loading="lazy"
                                            src="https://cos.koroneko.co/off.gif"
                                            className="lazyload blur-up"
                                            data-src={e.cover}
                                        />
                                    </Link>
                                    <h5>
                                        <Link prefetch={false}
                                            className="book_title_search"
                                            href={`/book/${e.book_id}`}
                                            title={e.book_name}
                                        >
                                            {e.book_name}
                                        </Link>
                                    </h5>
                                    <p><Userchap bookid={e.book_id} /></p>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </>
        })}
        <PaginationElement currentUri={`/booklists/${type}`} pageShow={page} />
    </>
}