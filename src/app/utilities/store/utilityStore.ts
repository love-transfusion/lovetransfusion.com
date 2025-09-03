import { I_Store_Utility } from '@/types/store.type'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const utilityStore = create(
  immer<I_Store_Utility>((set) => ({
    // ********* Toast *********
    toast: null,
    settoast: (dataObj) => {
      set((state) => {
        state.toast = dataObj || null
      })
    },
    userInStore: null,
    setuserInStore: (dataObj) => {
      set((state) => {
        state.userInStore = dataObj || null
      })
    },
    fbError: null,
    setfbError(data) {
      set((state) => {
        state.fbError = data
      })
    },
  }))
)

export default utilityStore
