import { revalidateTag, unstable_cache } from "next/cache";

/**
 * CacheEveryThing
 * @param func 功能匿名函数
 * @param tag 缓存标签组
 * @param revalidate 缓存时间
 * @param check 检查函数，用于判断是否revalidate缓存
 * @returns 
 */
export function CacheEveryThing<T>(func: () => Promise<T>, tag: string[], revalidate?: number | false, check?: (v: T) => boolean): () => Promise<T> {
    if (!check) {
        return unstable_cache(async () => func(), tag, { revalidate: revalidate, tags: tag })
    } else {
        const re = (v: T) => {
            if (check(v)) {
                tag.forEach((e) => revalidateTag(e))
                console.log("revalidated!")
            }
        }
        return unstable_cache(async () => new Promise((r) => {
            func()
                .then((e) => {
                    setTimeout(() => {
                        re(e)
                    }, 500);
                    r(e)
                })
        }), tag, { revalidate: revalidate, tags: tag })
    }
}
