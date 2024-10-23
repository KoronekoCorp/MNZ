'use client' // Error components must be Client Components

import { useEffect, useState } from 'react'
import { RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from "@mui/material"
import { enqueueSnackbar } from 'notistack'
import Cookies from 'js-cookie'

export default function Error({
    error,
    // reset,
}: {
    error: Error
    // reset: () => void
}) {
    const [value, setValue] = useState('latest');
    useEffect(() => {
        // console.error(error)
        setValue(Cookies.get("db") ?? "latest")
    }, [error])

    return (
        <div style={{ textAlign: "center" }}>
            <div className="card fluid center" style={{ backgroundColor: "rgb(255 180 180)" }}>
                <h3>
                    <i className="fa fa-warning" aria-hidden="true" />{" "}
                    {(() => {
                        switch (error.message) {
                            case "DB":
                                return "数据库异常"
                            case "CWM":
                                return "访问刺猬猫异常"
                            default:
                                return "未知的错误，建议上报"
                        }
                    })()}
                </h3>
            </div>

            {error.message === "CWM" && <>
                <div className="card fluid center" style={{ backgroundColor: "#ffefc8" }}>
                    <h3>
                        <i className="fa fa-cogs" aria-hidden="true" /> 刺猬猫错误处理工具正在开发中
                    </h3>
                </div>
            </>}

            {error.message === "DB" && <>
                <div className="card fluid center" style={{ backgroundColor: "#ffefc8" }}>
                    <h3>
                        <i className="fa fa-cogs" aria-hidden="true" /> 温馨提示：你也可以在设置中更改
                    </h3>
                </div>
                <div className="container center" style={{ paddingTop: 10 }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">数据库设置</FormLabel>
                        <RadioGroup aria-label="db" name="db" onChange={(e) => {
                            setValue(e.target.value);
                            document.cookie = `db=${e.target.value}; max-age=604800; path=/`;
                            enqueueSnackbar("数据库设置已保存", { variant: 'info' })
                        }} value={value}>
                            <FormControlLabel value="latest" control={<Radio />} label="最新数据库(最新)" />
                            <FormControlLabel value="newest" control={<Radio />} label="20231211之前的数据库" />
                            <FormControlLabel value="stable" control={<Radio />} label="独立数据库(维护中)" />
                        </RadioGroup>
                    </FormControl>
                </div >
            </>}

            <div className="container center" style={{ paddingTop: 10 }}>
                <button onClick={() => {
                    // reset()
                    document.location.href = document.location.href
                }}>
                    重新加载
                </button>
            </div>
            <img src='https://cos.elysia.rip/憧憬成為魔法少女-50-3.png' />
        </div>
    )
}
