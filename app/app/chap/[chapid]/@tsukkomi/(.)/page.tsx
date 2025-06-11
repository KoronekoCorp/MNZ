import { Tsukkomis } from './render'

export default async function Default(
    props:
        { params: Promise<{ chapid: string }>, searchParams: Promise<{ [key: string]: string | undefined }> }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;

    const {
        chapid
    } = params;

    if (searchParams.tsukkomis == null) { return null }

    return <Tsukkomis chapid={chapid} tsukkomis={searchParams.tsukkomis} searchParams={searchParams} />
}
