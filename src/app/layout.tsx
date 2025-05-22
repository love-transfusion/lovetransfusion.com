import './globals.css'
import GlobalToast from './GlobalToast'
import { util_metadataGenerator } from './utilities/util_metadataGenerator'

export const revalidate = 30

export const metadata = util_metadataGenerator({
  title: 'Make a Difference in a Hurting Child’s Life—Effortlessly',
  description:
    'In just seconds, you can send a powerful expression of love and support to someone who needs it most.',
  clTwitterUsername: '@LoveTransfusion',
})

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
