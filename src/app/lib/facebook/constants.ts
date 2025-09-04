export const env_FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID!
export const env_FACEBOOK_GRAPH_VERSION = process.env.GRAPH_VERSION ?? 'v20.0'
export const env_FACEBOOK_IDENTITY_ENABLED =
  (process.env.IDENTITY_ENABLED ?? 'false') === 'true'
export const env_FACEBOOK_SYSTEM_TOKEN = process.env.FACEBOOK_SYSTEM_TOKEN!
export const env_FACEBOOK_META_APP_SECRET = process.env.META_APP_SECRET!
export const env_FACEBOOK_SYNC_SECRET = process.env.FACEBOOK_SYNC_SECRET!
export const env_FACEBOOK_META_VERIFY_TOKEN =
  process.env.META_WEBHOOK_VERIFY_TOKEN!