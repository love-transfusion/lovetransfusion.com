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
}
