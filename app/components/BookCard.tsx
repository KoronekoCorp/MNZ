"use client"

import { Card, CardActionArea, CardActions, CardContent } from "@mui/material"
import Link from "next/link"

type jsxs = JSX.Element | JSX.Element[]

export function BookCard({ url, img, children, cardActions }:
    { url: string, img: { url: string, alt?: string }, children: jsxs, cardActions?: jsxs }) {

    return <Card>
        <CardActionArea LinkComponent={Link} href={url}>
            <img
                style={{ width: "100%", height: "auto" }}
                loading="lazy"
                src={img.url}
                className="lazyload blur-up"
                data-src={img.url}
                alt={img.alt}
            />
            <CardContent>
                {children}
            </CardContent>
        </CardActionArea>
        {cardActions && <CardActions sx={{ justifyContent: 'center', "& > a": { ml: 1, mr: 1 } }} >
            {cardActions}
        </CardActions>}
    </Card>
}