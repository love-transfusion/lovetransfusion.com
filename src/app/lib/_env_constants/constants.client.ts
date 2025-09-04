export const env_FACEBOOK_PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!
export const env_FACEBOOK_GRAPH_VERSION =
  process.env.NEXT_PUBLIC_GRAPH_VERSION ?? 'v20.0'
export const env_FACEBOOK_IDENTITY_ENABLED =
  (process.env.NEXT_PUBLIC_IDENTITY_ENABLED ?? 'false') === 'true'
