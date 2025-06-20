"use client"

import Script from "next/script";

export function Heads() {
  return (
    <>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="referrer" content="never" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png" />
      <link rel="stylesheet" href="/console.css" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"
        type="text/javascript" async
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js"
        type="text/javascript" async
      />
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" type="text/javascript" async />
      <Script src="/t.js" type="text/javascript" async />
      <Script src="https://cos.elysia.rip/t.js" type="text/javascript" async crossOrigin="anonymous" />
    </>
  );
}
