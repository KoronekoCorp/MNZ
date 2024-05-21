import { Container } from "@mui/material";
import style from './error.module.css';

/**
 * not-Found目前存在BUG
 * 
 * 当存在`page.tsx`、`not-found.tsx`、`loading.tsx`时，且`page.tsx`调用`notFound()`时会触发
 * 
 * **Minified React error #310**`Rendered more hooks than during the previous render.`
 * 
 * 仅在**生产环境**中存在
 * 
 * @link https://github.com/vercel/next.js/issues/63388
 */
export default function Page() {
    return <Container sx={{ textAlign: "center", color: "text.primary" }}>
        <h1 className={style.error} style={{ fontSize: "calc(100vw/13)" }} data-text={"404 Not Found"}>404 Not Found</h1>
        <div>
            <img src="https://cos.koroneko.co/%E6%86%A7%E6%86%AC%E6%88%90%E7%82%BA%E9%AD%94%E6%B3%95%E5%B0%91%E5%A5%B3-50-3.png" />
        </div>
    </Container>
}