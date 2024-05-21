import type { Metadata } from 'next'
import { Heads } from './Head'
import { Suspense } from "react";
import Loading from './loading';
import Snackbar from './Snackbar';
import Sync from './Sync';
import { Security } from '@/Security/Layout.Client';
import { Music } from '@/Music/Client';
import { Root } from './Drawer';
import { cookies } from 'next/headers';
import { AnnouncementProvider } from '@/components/Announcement';

export const metadata: Metadata = {
  title: 'Koroneko Corp',
  description: '黑猫科技',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dark = cookies().get("dark")?.value === "true"
  return (
    <html lang="zh">
      <head>
        <Heads />
      </head>
      <body style={{ margin: "auto" }} suppressHydrationWarning={true}>
        <Root darkmode={dark}>
          <Snackbar>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </Snackbar>
          <AnnouncementProvider endpoint='https://ann.koroneko.co' />
        </Root>
        <Music dark={dark} />
        <Sync />
        <Security />
      </body>
    </html>
  )
}
