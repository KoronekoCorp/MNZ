"use client"

import { RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"


export function DatabaseSetting() {
    const [value, setValue] = useState('newest');
    useEffect(() => {
        setValue(Cookies.get("db") ?? "newest")
    }, [])

    return <FormControl component="fieldset" sx={{ color: 'text.primary' }}>
        <FormLabel component="legend">数据库设置</FormLabel>
        <RadioGroup aria-label="db" name="db" onChange={(e) => {
            setValue(e.target.value);
            document.cookie = `db=${e.target.value}; max-age=604800; path=/`;
            enqueueSnackbar("数据库设置已保存", { variant: 'info' })
        }} value={value}>
            <FormControlLabel value="filess" control={<Radio />} label="独立数据库(filess)" />
            <FormControlLabel value="newest" control={<Radio />} label="中心数据库(alwaysdata)" />
            <FormControlLabel value="a" control={<Radio />} label="IP数据库(IP)" />
            <FormControlLabel value="stable" control={<Radio />} label="独立数据库(维护中)" />
        </RadioGroup>
    </FormControl>
}