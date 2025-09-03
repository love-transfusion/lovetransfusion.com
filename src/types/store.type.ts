import { I_supa_tooltips_with_user_tooltips } from '@/app/hooks/this-website-only/useTooltips'

// Utility Store ----------------------
interface I_ToastObject {
  clStatus: 'success' | 'error' | 'information'
  clTitle?: string
  clDescription: string
  /**Duration in milliseconds before the toast disappears. */
  clDuration?: number
  clRedirect?: string
}

interface I_user {
  id: string
  recipient_id: string
  parent_name: string
  first_name: string
}

export interface I_Store_Utility {
  toast: I_ToastObject | null
  settoast: (data: I_ToastObject | null) => void
  userInStore: I_user | null
  setuserInStore: (data: I_user | null) => void
  fbError: string | null
  setfbError: (data: string | null) => void
}

// Tooltips Store ----------------------
export interface I_Store_Tooltips {
  dashboardTooltips: I_supa_tooltips_with_user_tooltips[] | null
  setdashboardTooltips: (data: I_supa_tooltips_with_user_tooltips[]) => void
}
