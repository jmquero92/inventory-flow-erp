import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Empezando la siembra de datos...')

  // Producto 1: Cerámica Básica
  const p1 = await prisma.product.upsert({
    where: { sku: 'CER-001' },
    update: {}, // Si existe, no hacemos nada
    create: {
      sku: 'CER-001',
      name: 'Jarrón de Cerámica Azul',
      description: 'Jarrón artesanal pintado a mano, 30cm de alto.',
      price: 25.50,
      stock: 50,
    },
  })

  // Producto 2: Textil
  const p2 = await prisma.product.upsert({
    where: { sku: 'TEX-002' },
    update: {},
    create: {
      sku: 'TEX-002',
      name: 'Mantel de Lino Blanco',
      description: 'Mantel para mesa de 6 personas, bordado.',
      price: 45.00,
      stock: 12,
    },
  })

  // Producto 3: Madera
  const p3 = await prisma.product.upsert({
    where: { sku: 'MAD-003' },
    update: {},
    create: {
      sku: 'MAD-003',
      name: 'Caja de Té Organzadora',
      price: 15.99,
      stock: 0, // Sin stock (para probar alertas)
    },
  })

  console.log('✅ Semilla plantada correctamente:')
  console.log({ p1, p2, p3 })
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