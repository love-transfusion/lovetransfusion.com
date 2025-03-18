interface I_ToastObject {
  clStatus: 'success' | 'error' | 'information'
  clTitle?: string
  clDescription: string
  /**Duration in milliseconds before the toast disappears. */
  clDuration?: number
  clRedirect?: string
}

export interface I_Store_Utility {
  toast: I_ToastObject | null
  settoast: (data: I_ToastObject | null) => void
}
