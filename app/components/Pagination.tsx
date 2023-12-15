"use client"
import { Box, Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
function PaginationElement({ currentUri, pageShow }: { currentUri: string, pageShow: number }) {
    const pageID = pageShow;
    const pageIDm1 = pageID - 1;
    const pageIDm2 = pageID - 2;
    const pageIDp1 = pageID + 1;
    const pageIDp2 = pageID + 2;

    const renderPaginationLinks = () => {
        const links = [];
        if (pageID > 1) {
            links.push(<Link prefetch={false} href={`${currentUri}/${pageIDm1}`}>«</Link>);
        }
        if (pageID > 2) {
            links.push(<Link prefetch={false} href={`${currentUri}/${pageIDm2}`}>{pageIDm2}</Link>);
        }
        if (pageID > 1) {
            links.push(<Link prefetch={false} href={`${currentUri}/${pageIDm1}`}>{pageIDm1}</Link>);
        }
        links.push(<a className="active">{pageID}</a>);
        links.push(<Link prefetch={false} href={`${currentUri}/${pageIDp1}`}>{pageIDp1}</Link>);
        links.push(<Link prefetch={false} href={`${currentUri}/${pageIDp2}`}>{pageIDp2}</Link>);
        links.push(<Link prefetch={false} href={`${currentUri}/${pageIDp1}`}>»</Link>);
        return links;
    };

    // return <Pagination count={10}/>

    return (
        <div className="center">
            <div className="pagination" id="paginationSection">
                {renderPaginationLinks()}
            </div>
        </div>
    );
}

export default PaginationTotalElement;
export { PaginationElement }
