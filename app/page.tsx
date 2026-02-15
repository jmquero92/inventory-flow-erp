import { prisma } from "@/lib/db";
import { ProductTable } from "@/Components/ProductTable";
import { RecentActivity } from "@/Components/RecentActivity";
import { Search } from "@/Components/Search";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DollarSign, Package } from "lucide-react";

// Forzamos renderizado dinámico para que los datos estén siempre frescos
export const dynamic = 'force-dynamic';

// Definimos el tipo de las Props para Next.js 15 (searchParams es una Promesa)
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: Props) {
  // 1. Esperamos a que lleguen los parámetros de la URL (Vital para Next.js 15)
  const searchParams = await props.searchParams;
  const query = typeof searchParams.query === 'string' ? searchParams.query : '';

  // 2. Buscamos en la base de datos filtrando por el texto
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } }, // Busca por nombre
        { sku: { contains: query, mode: 'insensitive' } },  // Busca por SKU
      ],
    },
    orderBy: { createdAt: 'desc' }
  });

  // 3. Calculamos los KPIs (Se recalculan si filtras con el buscador)
  const totalValue = products.reduce((acc, product) => acc + (product.price * product.stock), 0);
  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      
      {/* CABECERA Y BUSCADOR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">Vista general de tu inventario.</p>
        </div>
        
        {/* Componente de Búsqueda */}
        <div className="w-full md:w-1/3">
           <Search />
        </div>
      </div>

      {/* TARJETAS DE RESUMEN (KPIs) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor del Inventario</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">Valor total de stock actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades en Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Total de productos físicos</p>
          </CardContent>
        </Card>
      </div>

      {/* GRID PRINCIPAL: Tabla + Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA (2/3): Tabla de Productos */}
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductTable initialProducts={products} />
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA (1/3): Actividad Reciente */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
        
      </div>
    </main>
  );
}