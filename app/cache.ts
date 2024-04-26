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
        return unstable_cache(func, tag, { revalidate: revalidate, tags: tag })
    } else {
        return async () => {
            const r = await unstable_cache(func, tag, { revalidate: revalidate, tags: tag })()
            if (check(r)) {
                tag.forEach((e) => revalidateTag(e))
                console.log("revalidated!")
            }
            return r
        }
    }
}
