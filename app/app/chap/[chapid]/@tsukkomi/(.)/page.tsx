import { Tsukkomis } from './render'

export default async function Default({ params: { chapid }, searchParams }:
    { params: { chapid: string }, searchParams: { [key: string]: string | undefined } }) {
    if (searchParams.tsukkomis == null) { return null }

    return <Tsukkomis chapid={chapid} tsukkomis={searchParams.tsukkomis} searchParams={searchParams} />
}
