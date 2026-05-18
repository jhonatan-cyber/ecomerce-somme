import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RecentlyViewedItem {
  id: string
  name: string
  price: number
  image_url: string | null
}

interface RecentlyViewedStore {
  items: RecentlyViewedItem[]
  addItem: (item: RecentlyViewedItem) => void
  clearItems: () => void
}

const MAX_ITEMS = 8

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items
        const filtered = items.filter((i) => i.id !== item.id)
        set({ items: [item, ...filtered].slice(0, MAX_ITEMS) })
      },
      clearItems: () => set({ items: [] }),
    }),
    {
      name: "recently-viewed",
    },
  ),
)
