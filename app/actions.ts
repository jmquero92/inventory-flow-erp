'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// 1. Acción para CREAR (Ahora con Log inicial)
export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const sku = formData.get('sku') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)

  // Usamos una transacción: O se crean los dos, o ninguno
  await prisma.$transaction(async (tx) => {
    // 1. Crear el producto
    const newProduct = await tx.product.create({
      data: { name, sku, price, stock }
    })

    // 2. Crear el log de entrada inicial
    await tx.stockLog.create({
      data: {
        productId: newProduct.id,
        change: stock,
        reason: "Stock inicial"
      }
    })
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

// 3. Acción para EDITAR (Ahora detecta cambios y guarda LOGS)
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const sku = formData.get('sku') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)

  // PASO 1: Buscamos el producto ANTES de cambiarlo para saber cuánto tenía
  const oldProduct = await prisma.product.findUnique({
    where: { id },
    select: { stock: true } // Solo nos interesa el stock antiguo
  })

  if (!oldProduct) throw new Error("Producto no encontrado")

  // PASO 2: Calculamos la diferencia (Nuevo - Viejo)
  const diff = stock - oldProduct.stock

  // PASO 3: Guardamos todo en una transacción
  await prisma.$transaction(async (tx) => {
    // A. Actualizamos el producto
    await tx.product.update({
      where: { id },
      data: { name, sku, price, stock }
    })

    // B. Si el stock ha cambiado, creamos un registro en el historial
    if (diff !== 0) {
      await tx.stockLog.create({
        data: {
          productId: id,
          change: diff,
          reason: diff > 0 ? "Entrada de stock (Manual)" : "Salida de stock (Manual)"
        }
      })
    }
  })

  revalidatePath('/')
}