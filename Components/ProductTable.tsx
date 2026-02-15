'use client'

import { useState } from "react"
import { EditProductModal } from "@/Components/EditProductModal" // Importamos el modal de edición
import { deleteProduct } from "@/app/actions" // Importamos la acción de borrar
import { toast } from "sonner" // Importamos las notificaciones
import { Trash2, AlertCircle, Package } from "lucide-react"

// Definimos la estructura de los datos del producto
type Product = {
  id: string
  name: string
  sku: string
  price: number
  stock: number
}

export function ProductTable({ initialProducts }: { initialProducts: Product[] }) {
  // Estado local para actualizar la lista visualmente rápido
  const [products, setProducts] = useState(initialProducts)

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await deleteProduct(id) // Llamada al servidor
        toast.success("Producto eliminado") // Notificación de éxito
      } catch (error) {
        toast.error("Error al eliminar") // Notificación de error
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 font-medium border-b">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {initialProducts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-8 w-8 text-gray-300" />
                  <p>No hay productos en el inventario.</p>
                </div>
              </td>
            </tr>
          ) : (
            initialProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                  {product.sku}
                </td>
                <td className="px-4 py-3 font-medium">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${product.stock > 10 ? 'bg-green-100 text-green-800' : 
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {product.stock} un.
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2 items-center">
                  {/* Botón de Editar */}
                  <EditProductModal product={product} />

                  {/* Botón de Borrar */}
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                    title="Eliminar producto"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}