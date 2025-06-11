import { tsukkomi_info_single, tsukkomi_reply_info } from '@/Data/CiweiType'
import { UseAPI } from '@/Data/Use'
import { Avatar, Divider, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import type { JSX } from 'react'
import ModalS, { Roll } from './client'
import { Nested } from './Nested'

/**
 * 单个间贴的UI
 * @returns JSX.Element
 */
const Single = ({ t, noli }: { t: tsukkomi_info_single | tsukkomi_reply_info, noli?: boolean }): JSX.Element => {
    //@ts-ignore
    const msg = t.tsukkomi_content ?? t.tsukkomi_reply_content
    return <>
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={t.reader_info.reader_name} src={t.reader_info.avatar_thumb_url == "" ? undefined : t.reader_info.avatar_thumb_url} />
            </ListItemAvatar>
            <ListItemText
                primary={t.reader_info.reader_name}
                secondary={
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        {msg}
                    </Typography>
                }
            />
        </ListItem>
        {noli ? <></> : <Divider variant="inset" component="li" />}
    </>
}

export async function Tsukkomis({ chapid, tsukkomis, searchParams }: { chapid: string, tsukkomis: string, searchParams: { [key: string]: string | undefined } }) {
    const page = parseInt(searchParams.page ?? "1")
    const a = await UseAPI()
    /**
     * 常规间贴列表数据获取
     * 
     * 根据返回值判断是否已经到达末页
     */
    const data = async () => {
        var i = 2
        while (i <= page) {
            const d = await a.tsukkomiinfo(chapid, tsukkomis, i)
            d.data.tsukkomi_list.forEach((e) => {
                r.data.tsukkomi_list.push(e)
            })
            if (d.data.tsukkomi_list.length < 12) {
                return true
            }
            ++i
        }
    }

    const r = await a.tsukkomiinfo(chapid, tsukkomis, 1)
    let end: boolean | undefined
    if (r.data.tsukkomi_list.length < 12) {
        end = true
    } else {
        end = await data()
    }


    /** 间贴回复列表生成 */
    const Reply = async ({ t }: { t: tsukkomi_info_single }) => {
        /**
         * 常规间贴列表数据获取
         * 
         * 根据返回值判断是否已经到达末页
         */
        const data = async () => {
            var i = 2
            while (i <= page) {
                const d = await a.tsukkomireply(t.tsukkomi_id, i)
                d.data.tsukkomi_reply_list.forEach((e) => {
                    r.data.tsukkomi_reply_list.push(e)
                })
                if (d.data.tsukkomi_reply_list.length < 12) {
                    return true
                }
                ++i
            }
        }

        const r = await a.tsukkomireply(t.tsukkomi_id)
        const page = parseInt(searchParams[t.tsukkomi_id] ?? "1")
        let end: boolean | undefined
        if (r.data.tsukkomi_reply_list.length < 12) {
            end = true
        } else {
            end = await data()
        }
        return <Roll page={page} end={end} name={t.tsukkomi_id} notop>
            {r.data.tsukkomi_reply_list.map((t) => <Single t={t} key={t.tsukkomi_id} />)}
        </Roll>
    }


    return <ModalS index={tsukkomis} title={r.data.paragraph_info.paragraph_content.length >= 15
        ? r.data.paragraph_info.paragraph_content.slice(0, 15) + "..."
        : r.data.paragraph_info.paragraph_content}>
        <Roll page={page} end={end} name='page' notop>
            {r.data.tsukkomi_list.map((t) => (
                t.reply_num == "0" ?
                    <Single t={t} key={t.tsukkomi_id} /> :
                    <Nested title={<Single t={t} noli />} key={t.tsukkomi_id}>
                        <Reply t={t} key={t.tsukkomi_id} />
                    </Nested>
            ))}
        </Roll>
    </ModalS>
}
