interface CustomMetadataType {
  title:
    | {
        default: string
        template: string
      }
    | string
  description?: string
  clDomain?: string
  clSiteName?: string
  clImagePublicURL?: `/${string}`
  clTwitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  clTwitterUsername?: `@${string}`
}

/**
 * ```
 * {
    title:
      | {
          default: string
          template: string
        }
      | string
    description?: string
    clDomain?: string
    clSiteName?: string
    clImagePublicURL?: `/${string}`
    clTwitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
    clTwitterUsername?: `@${string}`
  }
  ```
 */
export const util_metadataGenerator = ({
  title,
  description,
  clDomain: domain = 'https://www.lovetransfusion.com',
  clSiteName: siteName = 'Love Transfusion',
  clImagePublicURL = '/images/meta-images/Love Transfusion Share.png',
  clTwitterCard: card = 'summary_large_image',
  clTwitterUsername,
}: CustomMetadataType) => {
  const metadata = {
    title: {
      default: title,
      template: `%s - ${title}`,
    },
    description: description,

    // OpenGraph metadata
    openGraph: {
      title,
      description,
      url: domain,
      siteName,
      images: [
        {
          url: clImagePublicURL,
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
      card,
      title,
      description,
      creator: clTwitterUsername,
      images: [clImagePublicURL],
    },
  }
  return metadata
}
