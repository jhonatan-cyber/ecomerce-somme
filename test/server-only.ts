// Stub de `server-only` para vitest.
//
// El paquete real usa la condicion de export `react-server` (-> empty.js) que
// Next.js aplica en el bundle server pero vitest no: sin este alias resuelve a
// index.js, que lanza un Error al importarse. Este modulo vacio replica el
// comportamiento del servidor en los tests y desacopla vitest.config.ts del
// layout interno del paquete (node_modules/server-only/empty.js).
export {}
