import { MetadataRoute } from 'next'
// import { db } from '@/Data/Database'
import { UseAPI } from "@/Data/Use";
import { headers } from 'next/headers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const host = (await headers()).get("host")
    const fin: MetadataRoute.Sitemap = []
    const a = await UseAPI()
    const r = await a.bookcity("newtime", "50")
    r.data.book_list.forEach((e) => {
        fin.push({
            url: `https://${host}/book/${e.book_id}`,
            lastModified: e.last_chapter_info.mtime.replaceAll(" ", "T") + "+08:00",
            changeFrequency: 'weekly',
            priority: 0.5,
        })
    })

    return fin
}