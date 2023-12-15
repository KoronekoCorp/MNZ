import { UseAPI } from "@/Data/Use";
import { UseDB } from "@/Data/UseDB"
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { UserchapInfo } from "@/Data/DataType"
import { Back } from '@/app/push'

export default async function Tags({ Tag, page }: { Tag: string, page: number }) {
    const tag = decodeURI(Tag)
    const a = await UseAPI()
    const r = await a.tag(tag, page)

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
        <title>{tag}</title>
        <div className="card fluid center div_color_yellow1">
            <h3>
                <i className="fa fa-search" aria-hidden="true" /> {" "}
                <u>{tag}</u>{" "}
            </h3>
        </div>
        <div className="row center" id="search_result">
            {r.data.book_list.map((e) => (<div className="col-sm-6 col-md-3" key={e.book_id}>
                <div className="card fluid">
                    <div className="section" style={{ height: 'auto' }}>
                        <Link prefetch={false} href={`/book/${e.book_id}`} title={e.book_name}>
                            <img
                                style={{ border: "1px ridge black", height: "60%" }}
                                loading="lazy"
                                src="/assets/images/off.gif"
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
                        <p style={{ fontSize: 14 }}>
                            <i className="fa fa-user" aria-hidden="true" />{" "}
                            <Link prefetch={false}
                                className="book_author_search"
                                href={`/search/${e.author_name}`}
                                title={e.author_name}
                            >
                                {e.author_name}
                            </Link>
                        </p>
                        <p>{e.is_paid === "0" ? <span className='console-line'>FREE</span> : <Userchap bookid={e.book_id} />}</p>
                    </div>
                </div>
            </div>
            ))}

        </div>
        {r.data.book_list.length == 0 && <div className="card fluid center" style={{ backgroundColor: "rgb(255 180 180)" }}>
            <h3>
                <i className="fa fa-warning" aria-hidden="true" />{" "}
                什么都没有了呢,5秒后返航
                <Back time={5000}></Back>
            </h3>
        </div>}

        <div className="center">
            <div className="pagination" id="paginationSection">
                {page - 1 > 0 && <Link prefetch={false} href={`/tag/${tag}/${page - 1}`} >«</Link>}
                {page - 2 > 0 && <Link prefetch={false} href={`/tag/${tag}/${page - 2}`} >{page - 2}</Link>}
                {page - 1 > 0 && <Link prefetch={false} href={`/tag/${tag}/${page - 1}`} >{page - 1}</Link>}
                <a aria-disabled className="active">{page}</a>
                {r.data.book_list.length >= 10 && (<>
                    <Link prefetch={false} href={`/tag/${tag}/${page + 1}`} >{page + 1}</Link>
                    <Link prefetch={false} href={`/tag/${tag}/${page + 2}`} >{page + 2}</Link>
                    <Link prefetch={false} href={`/tag/${tag}/${page + 1}`} >»</Link>
                </>)}
            </div>
        </div>

    </>
}