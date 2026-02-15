import { prisma } from "@/lib/db";
import { ProductTable } from "@/Components/ProductTable";
import { RecentActivity } from "@/Components/RecentActivity";
import { Search } from "@/Components/Search";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DollarSign, Package, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link"; // Necesario para los botones

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.query === 'string' ? searchParams.query : '';
  
  // 1. LÓGICA DE PAGINACIÓN
  const page = Number(searchParams.page) || 1; // Página actual (por defecto 1)
  const pageSize = 5; // Productos por página (Pon 5 para probar, luego sube a 10)
  const skip = (page - 1) * pageSize;

  // 2. CONSULTA CON PAGINACIÓN
  // Necesitamos dos consultas: una para los datos y otra para saber el total
  const [products, totalProducts] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      skip: skip, // Saltamos los anteriores
      take: pageSize, // Cogemos solo 5
    }),
    prisma.product.count({ // Contamos el total para saber si hay página siguiente
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
      }
    })
  ]);

  const totalPages = Math.ceil(totalProducts / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // 3. CÁLCULOS KPI (OJO: Aquí deberíamos calcular sobre TODO, no solo la página)
  // Para simplificar y no hacer 3 consultas, usaremos los datos paginados como muestra,
  // o haríamos una consulta extra aggregate. Por ahora, para un MVP, déjalo así o haz un aggregate:
  const aggregation = await prisma.product.aggregate({
    _sum: { stock: true },
    where: {
       OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ],
    }
  });
  
  // Esto es aproximado para el valor total si no hacemos otra query pesada, 
  // pero para el stock total usamos el aggregate de arriba que es rápido.
  const totalStock = aggregation._sum.stock || 0;

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">Gestión de inventario ({totalProducts} productos).</p>
        </div>
        <div className="w-full md:w-1/3">
           <Search />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* ... (Tus tarjetas de KPI igual que antes) ... */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Registros en base de datos</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades Totales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Suma de stock físico</p>
          </CardContent>
        </Card>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Inventario (Página {page} de {totalPages || 1})</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductTable initialProducts={products} />
            </CardContent>
          </Card>

          {/* 4. CONTROLES DE PAGINACIÓN */}
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/?query=${query}&page=${page - 1}`}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md border 
                ${!hasPrevPage ? 'pointer-events-none opacity-50 bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Link>
            
            <span className="text-sm text-gray-600">
              Página {page}
            </span>

            <Link
              href={`/?query=${query}&page=${page + 1}`}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md border 
                ${!hasNextPage ? 'pointer-events-none opacity-50 bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </main>
  );
}