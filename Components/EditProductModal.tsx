'use client'

import { Button } from "@/Components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Pencil } from "lucide-react" // Icono de lápiz
import { useState } from "react"
import { updateProduct } from "@/app/actions"

// Definimos qué forma tienen los datos que recibimos
interface ProductProps {
  id: string
  name: string
  sku: string
  price: number
  stock: number
}

export function EditProductModal({ product }: { product: ProductProps }) {
  const [open, setOpen] = useState(false)

  // Esta función maneja el envío para poder cerrar el modal automáticamente
  async function handleSubmit(formData: FormData) {
    await updateProduct(product.id, formData)
    setOpen(false) // Cerramos el modal tras guardar
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        
        {/* Usamos action={handleSubmit} para interceptar el envío */}
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nombre</Label>
            <Input id="name" name="name" defaultValue={product.name} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">SKU</Label>
            <Input id="sku" name="sku" defaultValue={product.sku} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Precio</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Stock</Label>
            <Input id="stock" name="stock" type="number" defaultValue={product.stock} className="col-span-3" required />
          </div>
          
          <Button type="submit">Guardar Cambios</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}