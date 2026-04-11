-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items del pedido
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Todos pueden leer productos
CREATE POLICY "Productos visibles para todos" ON products
  FOR SELECT USING (true);

-- Políticas RLS: Solo admins autenticados pueden modificar productos
CREATE POLICY "Solo admins pueden insertar productos" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden actualizar productos" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden eliminar productos" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas RLS: Todos pueden crear pedidos
CREATE POLICY "Cualquiera puede crear pedidos" ON orders
  FOR INSERT WITH CHECK (true);

-- Políticas RLS: Solo admins pueden ver todos los pedidos
CREATE POLICY "Solo admins pueden ver pedidos" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden actualizar pedidos" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas RLS: Items de pedidos
CREATE POLICY "Cualquiera puede crear items de pedido" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo admins pueden ver items de pedido" ON order_items
  FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas RLS: Clientes
CREATE POLICY "Cualquiera puede crear clientes" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo admins pueden ver clientes" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');
