import ModalS from '@/app/chap/[chapid]/@tsukkomi/(.)/client'
import { Tsukkomis } from '@/app/chap/[chapid]/@tsukkomi/(.)/render'

export default async function Default({ params: { chapid }, searchParams }:
    { params: { chapid: string }, searchParams: { [key: string]: string | undefined } }) {
    if (searchParams.tsukkomis == null) { return null }

    return <ModalS index={searchParams.tsukkomis}>
        <Tsukkomis chapid={chapid} tsukkomis={searchParams.tsukkomis} searchParams={searchParams} />
    </ModalS>
}
