export interface StoreNavigationCategory {
  id: string
  name: string
  subcategories?: {
    id: string
    name: string
  }[]
}

export const defaultStoreNavigationCategories: StoreNavigationCategory[] = [
  { 
    id: "camaras-analogicas", 
    name: "Cámaras Analógicas",
    subcategories: [
      { id: "1mp", name: "1MP" },
      { id: "2mp", name: "2MP" },
      { id: "5mp", name: "5MP" },
      { id: "8mp", name: "8MP" },
    ]
  },
  { 
    id: "camaras-ip", 
    name: "Cámaras IP",
    subcategories: [
      { id: "2mp", name: "2MP" },
      { id: "4mp", name: "4MP" },
      { id: "8mp", name: "8MP (4K)" },
      { id: "ptz", name: "PTZ" },
    ]
  },
  { id: "camaras-inalambricas", name: "Cámaras Inalámbricas" },
  { 
    id: "grabadores", 
    name: "Grabadores",
    subcategories: [
      { id: "dvr-4ch", name: "DVR 4 Canales" },
      { id: "dvr-8ch", name: "DVR 8 Canales" },
      { id: "dvr-16ch", name: "DVR 16 Canales" },
      { id: "nvr", name: "NVR (IP)" },
    ]
  },
  { id: "accesorios-de-corriente", name: "Accesorios de Corriente" },
  { id: "video-porteros", name: "Video Porteros" },
]

export function getStoreCategoryHref(categoryId: string, subcategoryId?: string) {
  if (subcategoryId) {
    return `/catalog?category=${encodeURIComponent(categoryId)}&subcategory=${encodeURIComponent(subcategoryId)}`
  }
  return `/catalog?category=${encodeURIComponent(categoryId)}`
}
