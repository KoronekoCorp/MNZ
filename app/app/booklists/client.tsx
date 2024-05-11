"use client"
import BookmarkIcon from '@mui/icons-material/Bookmark'
import SearchIcon from '@mui/icons-material/Search'
import { Button, IconButton, TextField } from "@mui/material"
import Stack from "@mui/material/Stack"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import WhatshotIcon from '@mui/icons-material/Whatshot';
import UpdateIcon from '@mui/icons-material/Update';
import BarChartIcon from '@mui/icons-material/BarChart';

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        Doujinshi: true;
        Manga: true;
        ArtistCG: true;
        GameCG: true;
        NonH: true;
        ImageSet: true;
        Western: true;
        Cosplay: true;
        AsianPorn: true;
        Miscellaneous: true;
    }
}

export default function Head() {
    const router = useRouter()
    const [word, setWord] = useState("")

    return <>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ p: 1 }}>
            <IconButton onClick={() => { router.push(`/booklists/search/${word}`) }}>
                <SearchIcon sx={{ color: 'action.active' }} />
            </IconButton>
            <TextField
                label="搜索书单(还没做好，请不要使用)"
                fullWidth
                value={word}
                onChange={(e) => setWord(e.target.value)}>
            </TextField>
        </Stack>
        <Stack spacing={{ xs: 1, sm: 8 }} direction="row" useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center">
            <Button LinkComponent={Link} size="large" color='warning' variant="contained" href="/booklists/hot" startIcon={<WhatshotIcon />}>
                本月最热
            </Button>
            <Button LinkComponent={Link} size="large" color='success' variant="contained" href="/booklists/new" startIcon={<UpdateIcon />}>
                最近更新
            </Button>
            <Button LinkComponent={Link} size="large" color='info' variant="contained" href="/booklists/top" startIcon={<BarChartIcon />}>
                最多收藏
            </Button>
        </Stack>
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

    return <Button variant='contained' size='large' onClick={bookmark} startIcon={<BookmarkIcon />}>
        放入书架
    </Button>
}