import { AnnouncementProvider } from '@/components/Announcement';
import { Music } from '@/Music/Client';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from "react";
import { Root } from './Drawer';
import { Heads } from './Head';
import Loading from './loading';
import Snackbar from './Snackbar';
import Sync from './Sync';

export const metadata: Metadata = {
  title: 'Koroneko Corp',
  description: '黑猫科技',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <Heads />
      </head>
      <body style={{ margin: "auto" }} suppressHydrationWarning={true}>
        <Root darkmode={cookies().get("dark")?.value === "true"}>
          <Snackbar>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </Snackbar>
          <AnnouncementProvider endpoint='https://zapi.elysia.rip/ann' />
        </Root>
        <Music />
        <Sync />
      </body>
    </html>
  )
}
