// src/app/api/v1/departments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/departments - Get all active departments (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    // If slug is provided, get single department
    if (slug) {
      const department = await prisma.department.findUnique({
        where: { slug, isActive: true },
        include: {
          subDepartments: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
              services: {
                where: { isActive: true },
                orderBy: { order: 'asc' }
              },
              projects: {
                where: { isActive: true },
                orderBy: { order: 'asc' }
              }
            }
          },
          services: {
            where: {
              isActive: true,
              subDepartmentId: null // Only root-level services
            },
            orderBy: { order: 'asc' }
          },
          projects: {
            where: {
              isActive: true,
              subDepartmentId: null // Only root-level projects
            },
            orderBy: { order: 'asc' }
          },
          pricingTables: {
            where: { isActive: true }
          }
        }
      })

      if (!department) {
        return NextResponse.json(errorResponse('Department not found'), { status: 404 })
      }

      return NextResponse.json(successResponse(department))
    }

    // Get all departments
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            subDepartments: true,
            services: true,
            projects: true
          }
        }
      }
    })

    return NextResponse.json(successResponse(departments))
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(errorResponse('Failed to fetch departments'), { status: 500 })
  }
}
