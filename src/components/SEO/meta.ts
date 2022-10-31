import { MetaProps } from "."

export interface CreateMetaProps {
  siteTitle: string
  siteDescription: string
  url: string
  image: string
  title: string
  date?: string
}

export const createMeta = ({
  siteTitle,
  siteDescription,
  url,
  image,
  title,
  date,
}: CreateMetaProps): MetaProps[] => {
  const meta: MetaProps[] = [
    {
      property: `og:locale`,
      content: `ko_KR`,
    },
    {
      property: `og:locale:alternate`,
      content: `en_US`,
    },
    {
      property: `og:site_name`,
      content: siteTitle,
    },
    {
      property: `description`,
      content: siteDescription,
    },
    {
      property: `og:url`,
      content: url,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      property: `og:description`,
      content: siteDescription,
    },
    {
      property: `og:image`,
      content: image,
    },
    {
      property: `og:image:height`,
      content: `300`,
    },
    {
      property: `og:image:width`,
      content: `300`,
    },
  ]

  if (date) {
    meta.push({
      property: "article:published_time",
      content: date,
    })
  }

  return meta
}
