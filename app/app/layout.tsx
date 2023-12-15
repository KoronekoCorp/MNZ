import type { Metadata } from 'next'
import { Heads } from './Head'
import { Suspense } from "react";
import Loading from './loading';
import Snackbar from './Snackbar';
import Sync from './Sync';
import { Security } from '@/Security/Layout.Client';
import { Music } from '@/Music/Client';
import { Root } from './Drawer';

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
      <body style={{ margin: "auto" }}>
        <Root>
          <Snackbar>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </Snackbar>
        </Root>
        <Music />
        <Sync />
        <Security />
      </body>
    </html>
  )
}
