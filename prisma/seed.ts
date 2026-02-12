import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Empezando la siembra de datos...')

  // Producto 1
  const p1 = await prisma.product.upsert({
    where: { sku: 'CER-001' },
    update: {},
    create: {
      sku: 'CER-001',
      name: 'Jarrón de Cerámica Azul',
      price: 25.50,
      stock: 50,
    },
  })

  // Producto 2
  const p2 = await prisma.product.upsert({
    where: { sku: 'TEX-002' },
    update: {},
    create: {
      sku: 'TEX-002',
      name: 'Mantel de Lino Blanco',
      price: 45.00,
      stock: 12,
    },
  })

  // Producto 3
  const p3 = await prisma.product.upsert({
    where: { sku: 'MAD-003' },
    update: {},
    create: {
      sku: 'MAD-003',
      name: 'Caja de Té Organizadora',
      price: 15.99,
      stock: 0,
    },
  })

  console.log('✅ Semilla plantada correctamente.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })