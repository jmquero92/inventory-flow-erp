'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// 1. Acción para CREAR
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

// 2. Acción para BORRAR
export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  })
  
  revalidatePath('/')
}

// 3. Acción para EDITAR (La nueva)
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const sku = formData.get('sku') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)

  await prisma.product.update({
    where: { id },
    data: { name, sku, price, stock }
  })

  revalidatePath('/')
}