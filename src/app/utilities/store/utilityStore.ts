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
  }))
)

export default utilityStore
// loading: false,
// setloading: (bool) => {
//   set((state) => {
//     state.loading = bool
//   })
// },
// user: null,
// setUser: (data) => {
//   set((state) => {
//     state.user = data
//   })
// },
// isMobileMenuOpen: false,
// setIsMobileMenuOpen: (data) => {
//   set((state) => {
//     state.isMobileMenuOpen = data
//   })
// },
// prevPath: null,
// setprevPath: (pathStr) => {
//   set((state) => {
//     state.prevPath = pathStr
//   })
// },
// showModal: false,
// setShowModal: (pathStr) => {
//   set((state) => {
//     state.showModal = pathStr
//   })
// },
// sidebarSearchFieldClicked: null,
// setsidebarSearchFieldClicked: (data) => {
//   set((state) => {
//     state.sidebarSearchFieldClicked = data
//   })
// },
