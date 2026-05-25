# QA Checklist - Storefront + Ecommerce

Fecha: 2026-05-25
Scope: redes sociales por settings, categorias/subcategorias en catalogo, conteo de productos.

## 1) Storefront Settings (Backoffice)
- Ir a `Settings > Storefront`.
- En "Redes sociales del storefront", completar:
  - Facebook: URL valida
  - Instagram: URL valida
  - TikTok: URL valida
  - YouTube: URL valida
- Guardar con `Guardar redes sociales`.
- Resultado esperado:
  - Toast de exito.
  - Al recargar, los valores persisten.

## 2) Footer Ecommerce (Redes)
- Abrir ecommerce (home o catalogo).
- Ir al footer y revisar iconos sociales.
- Resultado esperado:
  - Si hay URL configurada: icono clickeable, abre en nueva pestana.
  - Si no hay URL configurada: icono deshabilitado visualmente.

## 3) Categorias -> Productos (paridad con Inventario)
- En `somme` (modulo Inventario):
  - Entrar a una categoria con conteo conocido (ejemplo: Camaras Analogicas).
  - Anotar cantidad total.
- En ecommerce (`/catalog?category=<id>`):
  - Verificar texto `Mostrando X productos`.
- Resultado esperado:
  - `X` coincide con el total esperado para esa categoria (categoria padre + subcategorias).

## 4) Multi-subcategoria
- En ecommerce, dentro de una categoria con subcategorias:
  - Seleccionar 2 o mas chips de subcategorias.
  - Verificar actualizacion del listado y del contador.
  - Quitar una subcategoria desde chips activos.
- Resultado esperado:
  - El listado contiene union de subcategorias seleccionadas.
  - El contador cambia correctamente.
  - Quitar chip elimina solo esa subcategoria del filtro.

## 5) Regresion rapida
- Buscar por texto en catalogo.
- Ordenar por precio asc/desc.
- Entrar a una ficha producto y volver.
- Resultado esperado:
  - No errores de hidratacion en consola.
  - Filtros/orden siguen funcionando.

## 6) Smoke tecnico
- Ejecutar typecheck:
  - `pnpm -C somme exec tsc --noEmit --pretty false`
  - `pnpm -C somme-ecomerce exec tsc --noEmit --pretty false`
- Resultado esperado: ambos sin errores.

## 7) Criterios de aprobacion
- [ ] Redes sociales persisten en settings.
- [ ] Footer usa links dinamicos del backend.
- [ ] Categoria en ecommerce muestra todos los productos esperados.
- [ ] Multi-subcategoria funciona correctamente.
- [ ] Sin errores TS.
