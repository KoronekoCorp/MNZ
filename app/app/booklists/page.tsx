import { R } from '@/components/push'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '书单',
    description: '黑猫科技,毛线球Corp',
}


export default async function Page() {
    return <R url='/booklists/hot' />
}