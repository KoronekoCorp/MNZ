

export interface Userchap {
    book_id: number,
    chapters: number,
    modes: 'post vip' | 'marauder' | 'marauder vip' | 'vip'
}

export interface BooKid {
    bookID: number,
    bookName: string,
    authorName: string,
    cover: string
}

export interface UserchapUser {
    author_name: string,
    count: number
}

export interface UserchapCount {
    'COUNT(DISTINCT book_id)': number
}

export interface UserchapInfo {
    chapters: number
    modes: 'post vip' | 'marauder' | 'marauder vip' | 'vip' | null
}

export interface Chaper {
    chapter_id: number,
    mode: 'vip'
}

export interface Shchap {
    book_id: number,
    chapter_id: number,
    /** 分享者 */
    author_name: string,
    title: string
    stime: number,
    spath: string
    /** 托管类型 */
    host: 't' | 'i',
    mode: 'post' | 'marauder' | 'vip'
    storj_synced: 0 | 1
    id: number
}
export interface Sh extends Shchap {
    txt: string
}

export interface UploadChap {
    ok: boolean,
    result?: {
        path: string,
        url: string,
        title: string
        description: string
        author_name: string
        views: 0,
        can_edit: true
    }
}