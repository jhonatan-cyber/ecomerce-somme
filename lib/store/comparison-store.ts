import { create } from 'zustand'
import type { Product, ProductComparison } from '@/lib/types'

interface ComparisonStore {
  selectedProducts: string[]
  selectedSpecs: string[]
  isComparisonMode: boolean
  
  // Actions
  toggleProduct: (productId: string) => void
  removeProduct: (productId: string) => void
  clearComparison: () => void
  toggleSpec: (spec: string) => void
  setComparisonMode: (enabled: boolean) => void
  getComparison: (products: Product[]) => ProductComparison
}

export const useComparisonStore = create<ComparisonStore>((set, get) => ({
  selectedProducts: [],
  selectedSpecs: ['resolution', 'night_vision', 'weather_resistance', 'price'],
  isComparisonMode: false,

  toggleProduct: (productId: string) => {
    set((state) => {
      const isSelected = state.selectedProducts.includes(productId)
      const newSelected = isSelected
        ? state.selectedProducts.filter(id => id !== productId)
        : [...state.selectedProducts, productId]
      
      return {
        selectedProducts: newSelected,
        isComparisonMode: newSelected.length > 0
      }
    })
  },

  removeProduct: (productId: string) => {
    set((state) => {
      const newSelected = state.selectedProducts.filter(id => id !== productId)
      return {
        selectedProducts: newSelected,
        isComparisonMode: newSelected.length > 0
      }
    })
  },

  clearComparison: () => {
    set({
      selectedProducts: [],
      isComparisonMode: false,
      selectedSpecs: ['resolution', 'night_vision', 'weather_resistance', 'price']
    })
  },

  toggleSpec: (spec: string) => {
    set((state) => {
      const isSelected = state.selectedSpecs.includes(spec)
      const newSpecs = isSelected
        ? state.selectedSpecs.filter(s => s !== spec)
        : [...state.selectedSpecs, spec]
      
      return { selectedSpecs: newSpecs }
    })
  },

  setComparisonMode: (enabled: boolean) => {
    set({ isComparisonMode: enabled })
  },

  getComparison: (products: Product[]) => {
    const { selectedProducts, selectedSpecs } = get()
    const comparisonProducts = products.filter(p => selectedProducts.includes(p.id))
    
    return {
      products: comparisonProducts,
      selectedSpecs
    }
  }
}))
