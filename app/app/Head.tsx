"use client"

import Script from "next/script";

export function Heads() {
  return (
    <>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <link rel="icon" href="/assets/images/logo.png" />
      <link rel="stylesheet" href="/console.css" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"
        type="text/javascript"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js"
        type="text/javascript"
      />
      <Script src="/t.js" type="text/javascript" async />
    </>
  );
}
