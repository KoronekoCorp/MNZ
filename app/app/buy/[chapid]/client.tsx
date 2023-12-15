"use client"
import { useEffect, useState } from 'react';


interface Data {
    success: boolean
}

export default function Share({ chap, auto }: { chap: number | string, auto: boolean }) {
    const [success, setSuccess] = useState(false);
    const [loading, setloading] = useState(false)

    const handleButtonClick = () => {
        setloading(true)
        fetch(`/api/share/${chap}`)
            .then((res) => res.json())
            .then((e: Data) => {
                setloading(false)
                setSuccess(e.success)
            })
            .catch(() => { handleButtonClick() })
    };

    useEffect(() => {
        if (auto) { handleButtonClick() }
    }, [chap])

    return < >
        {success
            ? <button className='shadowed tertiary'
                disabled={true}>
                <i className="fa fa-share-alt" aria-hidden="true" />已分享成功
            </button>
            : <button className='shadowed primary'
                disabled={loading}
                onClick={handleButtonClick}>
                <i className="fa fa-share-alt" aria-hidden="true" />分享此内容
            </button>}
        <button className="shadowed tertiary" onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(document.getElementsByTagName("article")[0].innerText)
        }}>
            <i className="fa fa-files-o" aria-hidden="true" /> 复制文字
        </button>
    </>
}