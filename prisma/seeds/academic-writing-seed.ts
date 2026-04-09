import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedAcademicWriting() {
  console.log('Seeding Academic Writing services...')

  // Clear existing data
  await prisma.academicWritingServiceItem.deleteMany({})
  await prisma.academicWritingPhase.deleteMany({})

  // Phase 1: Project Inception & Scoping
  const phase1 = await prisma.academicWritingPhase.create({
    data: {
      name: 'Phase 1: Project Inception & Scoping',
      description: null,
      order: 0,
      isActive: true,
      serviceItems: {
        create: [
          {
            name: 'Topic Discovery & Gap Analysis',
            description: 'Lit review to propose 3 viable topics with clear research gaps.',
            bachelorPrice: 200,
            masterPrice: 500,
            phdPrice: 1500,
            order: 0,
            isActive: true
          },
          {
            name: 'Research Proposal / Concept Note',
            description: 'Developing the blueprint, objectives, and timeline for supervisor approval.',
            bachelorPrice: 400,
            masterPrice: 1000,
            phdPrice: 3000,
            order: 1,
            isActive: true
          }
        ]
      }
    }
  })

  // Phase 2: The Foundation
  const phase2 = await prisma.academicWritingPhase.create({
    data: {
      name: 'Phase 2: The Foundation',
      description: null,
      order: 1,
      isActive: true,
      serviceItems: {
        create: [
          {
            name: 'Introduction & Background',
            description: 'Setting the context, problem statement, and significance.',
            bachelorPrice: 300,
            masterPrice: 1000,
            phdPrice: 1500,
            order: 0,
            isActive: true
          },
          {
            name: 'Comprehensive Literature Review',
            description: 'Extensive sourcing, critical analysis, and theoretical framework building.',
            bachelorPrice: 800,
            masterPrice: 2500,
            phdPrice: 5000,
            order: 1,
            isActive: true
          }
        ]
      }
    }
  })

  // Phase 3: The Blueprint (Methodology & Design)
  const phase3 = await prisma.academicWritingPhase.create({
    data: {
      name: 'Phase 3: The Blueprint (Methodology & Design)',
      description: null,
      order: 2,
      isActive: true,
      serviceItems: {
        create: [
          {
            name: 'Research Design & Methodology',
            description: 'Defining the approach, population, sample size, and analytical framework.',
            bachelorPrice: 400,
            masterPrice: 1500,
            phdPrice: 3000,
            order: 0,
            isActive: true
          },
          {
            name: 'Instrument/Protocol Design',
            description: 'Developing questionnaires, interview guides, or lab experimental protocols.',
            bachelorPrice: 200,
            masterPrice: 500,
            phdPrice: 1500,
            order: 1,
            isActive: true
          },
          {
            name: 'Engineering: Architecture & Simulation Setup',
            description: 'Specialized: CAD modelling, defining system architecture, or setting up software simulation parameters (e.g., MATLAB, ANSYS).',
            bachelorPrice: 800,
            masterPrice: 3500,
            phdPrice: 5000,
            order: 2,
            isActive: true
          }
        ]
      }
    }
  })

  // Phase 4: Execution & Synthesis
  const phase4 = await prisma.academicWritingPhase.create({
    data: {
      name: 'Phase 4: Execution & Synthesis',
      description: null,
      order: 3,
      isActive: true,
      serviceItems: {
        create: [
          {
            name: 'Data Analysis & Visualization',
            description: 'Cleaning data, running stats (SPSS, R, Python, GIS) and generating charts.',
            bachelorPrice: 1000,
            masterPrice: 3000,
            phdPrice: 6000,
            order: 0,
            isActive: true
          },
          {
            name: 'Engineering: Software / Prototype Dev',
            description: 'Specialized: Coding a functional software prototype, training an ML model, or building a hardware schematic.',
            bachelorPrice: 1500,
            masterPrice: 4000,
            phdPrice: 10000,
            order: 1,
            isActive: true
          },
          {
            name: 'Results & Discussion',
            description: 'Translating the analysis into academic writing and linking back to the Lit Review.',
            bachelorPrice: 800,
            masterPrice: 2500,
            phdPrice: 5000,
            order: 2,
            isActive: true
          }
        ]
      }
    }
  })

  // Phase 5: Quality Assurance, Polish & Defence
  const phase5 = await prisma.academicWritingPhase.create({
    data: {
      name: 'Phase 5: Quality Assurance, Polish & Defence',
      description: null,
      order: 4,
      isActive: true,
      serviceItems: {
        create: [
          {
            name: 'Thesis Compilation & Formatting',
            description: 'Automated TOC, lists of figures, margin/font compliance to university rubrics.',
            bachelorPrice: 300,
            masterPrice: 800,
            phdPrice: 2000,
            order: 0,
            isActive: true
          },
          {
            name: 'Proofreading, Editing & Plagiarism Mgt',
            description: 'Deep structural editing, citation Alignment (APA, Harvard, IEEE), and Turnitin reduction.',
            bachelorPrice: 400,
            masterPrice: 2000,
            phdPrice: 5000,
            order: 1,
            isActive: true
          },
          {
            name: 'Defence Preparation',
            description: 'Creating the presentation slide deck (PPT) and compiling a document of anticipated examiner questions.',
            bachelorPrice: 200,
            masterPrice: 1000,
            phdPrice: 1500,
            order: 2,
            isActive: true
          }
        ]
      }
    }
  })

  console.log('✅ Academic Writing services seeded successfully!')
  console.log(`Created ${5} phases with service items`)
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedAcademicWriting()
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
