'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Acción para CREAR productos
export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const sku = formData.get('sku') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)

  await prisma.product.create({
    data: { name, sku, price, stock }
  })

  revalidatePath('/')
}

// Acción para BORRAR productos
export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  })
  
  revalidatePath('/')
}