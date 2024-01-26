import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import "./search.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "店舗検索",
    description: "公式店舗検索",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
        <head>
            <meta charSet="UTF-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
            <meta httpEquiv="Content-Security-Policy"
                  content="script-src * 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com *.google.com https://*.ggpht.com *.googleusercontent.com https://www.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://ssl.google-analytics.com data: blob:; img-src * 'self' https://*.googleapis.com https://*.gstatic.com *.google.com *.googleusercontent.com www.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://www.google-analytics.com data: blob:; frame-src * *.google.com data:; connect-src * 'self' https://*.googleapis.com *.google.com https://*.gstatic.com https://www.google-analytics.com data: blob:; font-src * 'self' https://fonts.gstatic.com https://fonts.gstatic.com data:; style-src * 'self' 'unsafe-inline' https://fonts.googleapis.com data:; worker-src * blob:;"/>
        </head>
        <body className={`${inter.className} page-store`}>{children}</body>
        </html>
    );
}
