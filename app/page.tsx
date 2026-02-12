import { prisma } from "@/lib/db"
import { addProduct, deleteProduct } from "./actions"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Trash2 } from "lucide-react"
import { EditProductModal } from "@/Components/EditProductModal"
import { Search } from "@/Components/Search" // 👈 Importamos el buscador

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"

// 1. Recibimos los parámetros de búsqueda (searchParams)
export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  // 2. Modificamos la consulta para filtrar
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' }
  })

  // Cálculos para el Dashboard (Se recalculan con el filtro)
  const totalProductos = products.length
  const valorTotal = products.reduce((acc, p) => acc + (p.price * p.stock), 0)
  const productosSinStock = products.filter(p => p.stock === 0).length

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-slate-50 gap-8">
      <div className="w-full max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 text-center">Inventory Flow ERP</h1>

        {/* DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Valor Inventario (Filtrado)</CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(valorTotal)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Items Encontrados</CardDescription>
              <CardTitle className="text-2xl">{totalProductos}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Agotados</CardDescription>
              <CardTitle className="text-2xl text-red-500">{productosSinStock}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* FORMULARIO */}
        <Card>
          <CardHeader>
            <CardTitle>Añadir Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addProduct} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px] space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input name="name" id="name" placeholder="Ej: Plato de Barro" required />
              </div>
              <div className="w-[150px] space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input name="sku" id="sku" placeholder="SKU-001" required />
              </div>
              <div className="w-[100px] space-y-2">
                <Label htmlFor="price">Precio (€)</Label>
                <Input name="price" id="price" type="number" step="0.01" required />
              </div>
              <div className="w-[100px] space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input name="stock" id="stock" type="number" required />
              </div>
              <Button type="submit">Guardar</Button>
            </form>
          </CardContent>
        </Card>

        {/* TABLA CON BUSCADOR */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Inventario Actual</CardTitle>
                <CardDescription>Gestión de productos y stock.</CardDescription>
              </div>
              {/* 👇 Aquí está el Buscador */}
              <Search />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">SKU</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                      No se encontraron productos con "{query}"
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}
                      </TableCell>
                      <TableCell>{product.stock} u.</TableCell>
                      <TableCell>
                        {product.stock > 0 ? (
                          <span className="text-green-600 font-bold">En Stock</span>
                        ) : (
                          <span className="text-red-600 font-bold">Agotado</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2 items-center">
                        <EditProductModal product={product} />
                        <form action={async () => {
                          'use server'
                          await deleteProduct(product.id)
                        }}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}