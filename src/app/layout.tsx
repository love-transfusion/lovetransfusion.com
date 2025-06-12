import { Metadata } from 'next'
import './globals.css'
import GlobalToast from './GlobalToast'
export const revalidate = 30

const title = 'Make a Difference in a Hurting Child’s Life—Effortlessly'
const description =
  'In just seconds, you can send a powerful expression of love and support to someone who needs it most.'
const url = 'https://www.lovetransfusion.com'
const siteName = 'Love Transfusion'
const imageUrl = '/images/meta-images/Love Transfusion Share.png'

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | Love Transfusion`,
  },
  description,

  // OpenGraph metadata
  openGraph: {
    title,
    description,
    url,
    siteName,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter/X Card metadata
  twitter: {
    card: 'summary_large_image',
    title: title,
    description,
    creator: '@LoveTransfusion',
    images: [imageUrl],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/hox1ite.css" />
      </head>
      <body className="font-acumin-variable">
        <GlobalToast />
        <div>{children}</div>
      </body>
    </html>
  )
}
