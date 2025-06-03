import { I_Store_Tooltips } from '@/types/store.type'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const tooltipsStore = create(
  immer<I_Store_Tooltips>((set) => ({
    dashboardTooltips: null,
    setdashboardTooltips: (dataObj) => {
      set((state) => {
        state.dashboardTooltips = dataObj || null
      })
    },
  }))
)

export default tooltipsStore
