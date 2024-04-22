"use client"

import { RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"


export function DatabaseSetting() {
    const [value, setValue] = useState('stable');
    useEffect(() => {
        setValue(Cookies.get("db") ?? "stable")
    }, [])

    return <FormControl component="fieldset" sx={{ color: 'text.primary' }}>
        <FormLabel component="legend">数据库设置</FormLabel>
        <RadioGroup aria-label="db" name="db" onChange={(e) => {
            setValue(e.target.value);
            document.cookie = `db=${e.target.value}; max-age=604800; path=/`;
            enqueueSnackbar("数据库设置已保存", { variant: 'info' })
        }} value={value}>
            <FormControlLabel value="a" control={<Radio />} label="IP数据库(IP)" />
            <FormControlLabel value="stable" control={<Radio />} label="独立数据库1" />
            <FormControlLabel value="stable2" control={<Radio />} label="独立数据库2(默认)" />
        </RadioGroup>
    </FormControl>
}