"use client"

import type { Catalog } from "@/Data/CiweiType"
import { Container, Slider } from "@mui/material"
import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState } from "react";
import { getchap } from "./server";

export function Chart({ Catalog }: { Catalog: Catalog }) {
    const [selected, setselected] = useState<{ chapter_id: number, chapter_index: number }[]>([])
    const [min, setmin] = useState(50)
    const [data, setdata] = useState<{ [key: number]: number }>({})

    useEffect(() => {
        let chaps: { chapter_id: number, chapter_index: number }[] = []
        for (const i of Catalog.data.chapter_list) {
            for (const j of i.chapter_list) {
                chaps.push({ chapter_id: parseInt(j.chapter_id), chapter_index: parseInt(j.chapter_index) })
            }
        }
        chaps = chaps.sort((i, j) => i.chapter_index - j.chapter_index)

        const count = chaps.length / min | 0
        const selected: { chapter_id: number, chapter_index: number }[] = []

        for (let i = 0; i < min; i++) {
            const index = Math.min(i * count, chaps.length - 1); // 确保索引不超出范围
            selected.push(chaps[index]);
        }
        selected.push(chaps[chaps.length - 1]);
        setselected(selected)
    }, [Catalog, min])

    useEffect(() => {
        const task = selected.slice()
        const id = setInterval(() => {
            const t = task.shift()
            if (t) {
                if (data[t.chapter_id] === undefined) {
                    getchap(t.chapter_id)
                        .then((r) => setdata((data) => {
                            return {
                                ...data,
                                [t.chapter_id]: parseInt(r.data.chapter_info.buy_amount)
                            }
                        }))
                }
            } else {
                clearInterval(id)
            }

        }, 250);
        return () => clearInterval(id)
    }, [selected])

    return <Container>
        <Slider defaultValue={50} step={10} marks min={50} max={100} valueLabelDisplay="auto" value={min} onChangeCommitted={(e, v) => setmin(v as number)} />
        <LineChart
            xAxis={[{ data: selected.map(i => i.chapter_index), }]}
            series={[
                {
                    data: selected.map(i => data[i.chapter_id]),
                    valueFormatter: (value) => `订阅人数 ${value}`
                },
            ]}
            height={500}
        />
    </Container>
}