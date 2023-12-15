"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';


interface item {
    key: string
    name: string,
    intro?: string,
    links?: string,
    score: number
}

export function AutoSearch({ baseurl, onClick, onChange, allowEnter }:
    {
        baseurl?: string,
        onClick?: () => any,
        onChange?: (v: string) => any
        allowEnter?: boolean
    }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<item[]>([]);
    const [inputValue, setvalue] = useState('');
    const [data, setdata] = useState<item[]>([])
    const router = useRouter()
    const loading = open && inputValue != "" && options.length === 0

    const Getdata = (da: item[] = data) => {
        const d = da.map(i => {
            const t = i.key.split(":")
            if (t.length === 1) return i.key
            return `${t[0].slice(0, 1)}:${t[1].includes(" ") ? `"${t[1]}$"` : t[1] + "$"}`
        })
        let f_search = ""
        d.forEach(i => f_search += i + " ")
        return f_search.slice(0, -1)
    }

    const Search = () => {
        if (onClick) {
            onClick()
        } else {
            const f_search = Getdata()
            const u = new URL(baseurl ? location.origin + baseurl : location.href)
            u.searchParams.delete("next")
            u.searchParams.delete("prev")
            if (f_search != "") u.searchParams.set("f_search", f_search)
            router.push(u.href)
        }
    }

    return (
        <Autocomplete
            multiple
            fullWidth
            autoComplete
            autoSelect
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
                setOptions([])
            }}

            onChange={(e, v) => { setdata(v); if (onChange) onChange(Getdata(v)) }}
            onInputChange={async (e, v) => {
                setvalue(v)
                if (v == "") return
                setOptions(await (await fetch(`/api/db/${v}`)).json() as item[])
            }}
            onKeyDown={(allowEnter ?? true) ? (e) => { if (e.code === "Enter") Search() } : undefined}
            filterOptions={(option, state) => option}
            isOptionEqualToValue={(option, value) => option.key === value.key}
            getOptionLabel={(option) => option.key}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    key={params.id}
                    {...params}
                    label="Search"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: <>
                            <IconButton onClick={Search}>
                                <SearchIcon sx={{ color: 'action.active' }} />
                            </IconButton>
                            {params.InputProps.startAdornment}
                        </>,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress color="inherit" />}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => {
                return <li {...props}>
                    <Typography variant="body2" color="text.secondary" component={"div"} dangerouslySetInnerHTML={{ __html: option.name }}>

                    </Typography>
                </li>
            }}
        />
    );
}