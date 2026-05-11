import type { DriveStep, Side } from "driver.js"

type TourStep = DriveStep & { page: string }

export const allTourSteps: TourStep[] = [
  // Home page
  {
    page: "home",
    element: "[data-tour='header-logo']",
    popover: {
      title: "Bienvenido a Somme",
      description: "Tu punto de partida para todo en seguridad electrónica y videovigilancia profesional.",
      side: "bottom" as Side,
      align: "start",
    },
  },
  {
    page: "home",
    element: "[data-tour='search-bar']",
    popover: {
      title: "Búsqueda Inteligente",
      description: "¿Sabés lo que buscás? Escribí el nombre del producto y encontralo al instante. También podés buscar por marca o categoría.",
      side: "bottom" as Side,
      align: "center",
    },
  },
  {
    page: "home",
    element: "[data-tour='categories-sidebar']",
    popover: {
      title: "Navegación por Categorías",
      description: "Explorá por categorías: cámaras IP, kits de seguridad, grabadores NVR, accesorios y más. Todo organizado para que encuentres rápido.",
      side: "right" as Side,
      align: "start",
    },
  },
  {
    page: "home",
    element: "[data-tour='hero-product']",
    popover: {
      title: "Producto Destacado",
      description: "Cada semana destacamos productos especiales con precios exclusivos. No te pierdas nuestras recomendaciones.",
      side: "bottom" as Side,
      align: "center",
    },
  },
  {
    page: "home",
    element: "[data-tour='new-arrivals']",
    popover: {
      title: "Recién Llegados",
      description: "Lo último en tecnología de seguridad llega acá primero. Mirá las novedades antes que nadie.",
      side: "top" as Side,
      align: "center",
    },
  },
  {
    page: "home",
    element: "[data-tour='on-sale']",
    popover: {
      title: "Ofertas Especiales",
      description: "Promociones activas por tiempo limitado. Aprovechá descuentos reales en productos seleccionados.",
      side: "top" as Side,
      align: "center",
    },
  },
  {
    page: "home",
    element: "[data-tour='brands-carousel']",
    popover: {
      title: "Marcas de Confianza",
      description: "Solo trabajamos con marcas líderes del mercado. Calidad garantizada en cada producto que ofrecemos.",
      side: "top" as Side,
      align: "center",
    },
  },
  {
    page: "home",
    element: "[data-tour='cart-button']",
    popover: {
      title: "Tu Carrito",
      description: "Tu carrito te espera. Revisá tus productos, ajustá cantidades y cuando estés listo, proceed al checkout.",
      side: "bottom" as Side,
      align: "center",
    },
  },
  // Catalog page
  {
    page: "catalog",
    element: "[data-tour='catalog-grid']",
    popover: {
      title: "Catálogo Completo",
      description: "Acá tenés acceso a todo nuestro catálogo. Usá los filtros de la izquierda para encontrar exactamente lo que necesitás.",
      side: "bottom" as Side,
      align: "center",
    },
  },
  {
    page: "catalog",
    element: "[data-tour='product-card']",
    popover: {
      title: "Ficha de Producto",
      description: "Cada producto tiene su ficha completa con fotos, especificaciones técnicas y precio. Hacé clic para ver todos los detalles.",
      side: "right" as Side,
      align: "center",
    },
  },
  // Product page
  {
    page: "product",
    element: "[data-tour='product-gallery']",
    popover: {
      title: "Galería de Imágenes",
      description: "Mirá el producto desde todos los ángulos. Hacé clic en las imágenes para ampliarlas y ver cada detalle.",
      side: "left" as Side,
      align: "center",
    },
  },
  {
    page: "product",
    element: "[data-tour='product-info']",
    popover: {
      title: "Detalles del Producto",
      description: "Toda la info técnica que necesitás: descripción completa, especificaciones, compatibilidad y garantía.",
      side: "right" as Side,
      align: "center",
    },
  },
  {
    page: "product",
    element: "[data-tour='add-to-cart']",
    popover: {
      title: "Agregar al Carrito",
      description: "¿Te convence? Agregalo al carrito y seguí comprando, o andá directo al checkout para finalizar.",
      side: "top" as Side,
      align: "center",
    },
  },
  // Cart page
  {
    page: "cart",
    element: "[data-tour='cart-items']",
    popover: {
      title: "Tu Selección",
      description: "Acá podés revisar cada producto, cambiar cantidades o eliminar lo que no necesités. Todo actualizado en tiempo real.",
      side: "right" as Side,
      align: "center",
    },
  },
  {
    page: "cart",
    element: "[data-tour='cart-summary']",
    popover: {
      title: "Resumen de Compra",
      description: "El resumen claro: subtotal, impuestos y total final. Sin sorpresas, sin costos ocultos.",
      side: "left" as Side,
      align: "center",
    },
  },
  {
    page: "cart",
    element: "[data-tour='checkout-button']",
    popover: {
      title: "Finalizar Compra",
      description: "Cuando todo esté como querés, hacé clic acá para ir al checkout y completar tu compra de forma segura.",
      side: "top" as Side,
      align: "center",
    },
  },
]

export function getStepsForPage(page: string): DriveStep[] {
  return allTourSteps
    .filter((step) => step.page === page)
    .map(({ element, popover }) => ({ element, popover }))
}
