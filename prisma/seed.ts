import { prisma } from '#app/utils/db.server.ts'
import { cleanupDb } from '#tests/db-utils.ts'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await cleanupDb(prisma)
	console.timeEnd('🧹 Cleaned up the database...')

	console.time(' Seeding materials, material units, orders, and order details...');

  // Seed Material Units
  await prisma.material_unit.create({ data: { unit_code: 'KG', unit_name: 'Kilogram' } });
  await prisma.material_unit.create({ data: { unit_code: 'M', unit_name: 'Meter' } });
  await prisma.material_unit.create({ data: { unit_code: 'PC', unit_name: 'Piece' } });
  // ... add more material units as needed

  // Seed Materials
//   const material1 = await prisma.material.create({
//     data: {
//       materialName: 'Steel',
//       materialCode: 'STEEL-123',
//       materialDesc: 'High-quality steel',
//       materialUnitCode: 'KG',
//     },
//   });

//   const order1 = await prisma.order.create({ data: { orderDate: new Date() } });
// 	await prisma.order.create({ data: { orderDate: new Date() } });

//   await prisma.orderDetail.create({
//     data: {
//       orderId: order1.orderId, // Assuming orders have been created already
//       materialId: material1.materialId,
//       orderQuantity: 100,
//       receivedDate: new Date(),
//     },
//   });
  // ... create other materials and their order details similarly

  // Seed Orders
  
  // ... add more orders as needed

  // ... create order details for other orders

  console.timeEnd(' Seeding materials, material units, orders, and order details...');

	console.timeEnd(`🌱 Database has been seeded`)

	// await prisma.employee.create({
	// 	data: {
	// 		firstName: 'John',
	// 		lastName: 'Doe',
	// 		email: 'john.doe@example.com',
	// 		startDate: new Date()
	// 	},
	// })

	// await prisma.employee.create({
	// 	data: {
	// 		firstName: 'Jane',
	// 		lastName: 'Doe',
	// 		email: 'jane.doe@example.com',
	// 		startDate: new Date()
	// 	},
	// })
	
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
