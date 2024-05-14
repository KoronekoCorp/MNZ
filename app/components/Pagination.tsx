"use client"
import { Box, Button, Pagination, Stack } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

/**
 * 
 * @param currentUri  当前URL
 * @param pageShow 当前页数
 * @param totalSearch 总页数
 * @returns 
 */
function PaginationTotalElement({ currentUri, pageShow, totalSearch }: { currentUri: string, pageShow: number, totalSearch: number }) {
    const [page, setpage] = useState(pageShow)
    const totalPage = Math.ceil(totalSearch / 20);
    const router = useRouter()

    return <Box sx={{ p: 2, justifyContent: 'center', display: 'flex' }}>
        <Pagination count={totalPage} showFirstButton showLastButton page={page} onChange={(e, p) => {
            router.push(`${currentUri}/${p}`)
            setpage(p)
        }} />
    </Box>
}

/**
 * 
 * @param currentUri  当前URL
 * @param pageShow 当前页数
 * @returns 
 */
function PaginationElement({ currentUri, pageShow, end }: { currentUri: string, pageShow: number, end?: boolean }) {
    const pageID = pageShow;
    const pageIDm1 = pageID - 1;
    const pageIDm2 = pageID - 2;
    const pageIDp1 = pageID + 1;
    const pageIDp2 = pageID + 2;

    const links = [];
    if (pageID > 2) {
        links.push(<Button variant='outlined' LinkComponent={Link} href={`${currentUri}/${pageIDm2}`}
            startIcon={<KeyboardDoubleArrowLeftIcon />}>
            {pageIDm2}
        </Button>)
    }
    if (pageID > 1) {
        links.push(<Button variant='outlined' LinkComponent={Link} href={`${currentUri}/${pageIDm1}`}
            startIcon={<KeyboardArrowLeftIcon />}>
            {pageIDm1}
        </Button>);
    }
    links.push(<Button variant='outlined' disabled>
        {pageID}
    </Button>);
    if (!end) {
        links.push(<Button variant='outlined' LinkComponent={Link} href={`${currentUri}/${pageIDp1}`}
            endIcon={<KeyboardArrowRightIcon />}>
            {pageIDp1}
        </Button>)
        links.push(<Button variant='outlined' LinkComponent={Link} href={`${currentUri}/${pageIDp2}`}
            endIcon={<KeyboardDoubleArrowRightIcon />}>
            {pageIDp2}
        </Button>)
    }

    return <Stack direction="row" sx={{ p: 2, justifyContent: 'center', display: 'flex' }} spacing={2} useFlexGap flexWrap="wrap">
        {links}
    </Stack>
}

function PaginationElementCallBack({ pageShow, end, callback }: { pageShow: number, end?: boolean, callback: (page: number) => any }) {
    const pageID = pageShow;
    const pageIDm1 = pageID - 1;
    const pageIDm2 = pageID - 2;
    const pageIDp1 = pageID + 1;
    const pageIDp2 = pageID + 2;

    const links = [];
    if (pageID > 2) {
        links.push(<Button variant='outlined' onClick={() => callback(pageIDm2)}
            startIcon={<KeyboardDoubleArrowLeftIcon />}>
            {pageIDm2}
        </Button>)
    }
    if (pageID > 1) {
        links.push(<Button variant='outlined' onClick={() => callback(pageIDm1)}
            startIcon={<KeyboardArrowLeftIcon />}>
            {pageIDm1}
        </Button>);
    }
    links.push(<Button variant='outlined' disabled>
        {pageID}
    </Button>);
    if (!end) {
        links.push(<Button variant='outlined' onClick={() => callback(pageIDp1)}
            endIcon={<KeyboardArrowRightIcon />}>
            {pageIDp1}
        </Button>)
        links.push(<Button variant='outlined' onClick={() => callback(pageIDp2)}
            endIcon={<KeyboardDoubleArrowRightIcon />}>
            {pageIDp2}
        </Button>)
    }

    return <Stack direction="row" sx={{ p: 2, justifyContent: 'center', display: 'flex' }} spacing={2} useFlexGap flexWrap="wrap">
        {links}
    </Stack>
}

export default PaginationTotalElement;
export { PaginationElement, PaginationElementCallBack }
