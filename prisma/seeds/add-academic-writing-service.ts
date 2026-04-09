import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function addAcademicWritingService() {
  console.log('Adding Academic Writing service to Services table...')

  // Check if service already exists
  const existing = await prisma.service.findFirst({
    where: {
      slug: 'academic-writing'
    }
  })

  if (existing) {
    console.log('Academic Writing service already exists, updating...')
    await prisma.service.update({
      where: { id: existing.id },
      data: {
        name: 'Academic Writing',
        description: 'Professional academic writing support for Bachelor, Master, and PhD level research. From topic discovery to thesis defense, we provide comprehensive support throughout your academic journey.',
        icon: 'FaGraduationCap',
        features: [
          'Topic Discovery & Gap Analysis',
          'Research Proposals & Methodology',
          'Literature Reviews',
          'Data Analysis & Visualization',
          'Results & Discussion Writing',
          'Thesis Compilation & Formatting',
          'Plagiarism Management',
          'Defense Preparation'
        ],
        order: 2,
        isActive: true
      }
    })
    console.log('✅ Academic Writing service updated successfully!')
  } else {
    await prisma.service.create({
      data: {
        name: 'Academic Writing',
        slug: 'academic-writing',
        description: 'Professional academic writing support for Bachelor, Master, and PhD level research. From topic discovery to thesis defense, we provide comprehensive support throughout your academic journey.',
        icon: 'FaGraduationCap',
        features: [
          'Topic Discovery & Gap Analysis',
          'Research Proposals & Methodology',
          'Literature Reviews',
          'Data Analysis & Visualization',
          'Results & Discussion Writing',
          'Thesis Compilation & Formatting',
          'Plagiarism Management',
          'Defense Preparation'
        ],
        order: 2,
        isActive: true
      }
    })
    console.log('✅ Academic Writing service created successfully!')
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  addAcademicWritingService()
    .then(() => {
      console.log('Seed completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error seeding:', error)
      process.exit(1)
    })
    .finally(() => {
      prisma.$disconnect()
    })
}
