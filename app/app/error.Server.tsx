import ErrorClient from "./error.Client"

function E(e: Error) {
    return <ErrorClient error={{ message: e.message, name: "" }} />
}

export function ServerError(func: (Prop: any) => Promise<JSX.Element>) {
    return async function Server(Prop: any) {
        let D: JSX.Element
        try {
            D = await func(Prop)
        } catch (e) {
            D = E(e as Error)
        }
        return D
    }
}