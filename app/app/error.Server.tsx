import type { JSX } from "react"
import ErrorClient from "./error.Client"

function E(e: Error) {
    return <ErrorClient error={{ message: e.message, name: "" }} />
}

export function ServerError<T>(func: (Prop: T) => Promise<JSX.Element>) {
    return async function Server(Prop: T) {
        let D: JSX.Element
        try {
            D = await func(Prop)
        } catch (e) {
            D = E(e as Error)
        }
        return D
    }
}