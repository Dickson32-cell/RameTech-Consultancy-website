// src/app/api/v1/admin/pricing-tables/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'


// GET /api/v1/admin/pricing-tables - Get all pricing tables
export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get('departmentId')

    const where = departmentId ? { departmentId } : {}

    const pricingTables = await prisma.pricingTable.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(successResponse(pricingTables))
  } catch (error) {
    console.error('Error fetching pricing tables:', error)
    return NextResponse.json(errorResponse('Failed to fetch pricing tables'), { status: 500 })
  }
}

// POST /api/v1/admin/pricing-tables - Create new pricing table
export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const { departmentId, name, description, tableType, data, isActive } = body

    // Validation
    if (!departmentId || !name || !data) {
      return NextResponse.json(errorResponse('Department ID, name and data are required'), { status: 400 })
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    })

    if (!department) {
      return NextResponse.json(errorResponse('Department not found'), { status: 404 })
    }

    // Validate JSON data
    let parsedData
    try {
      parsedData = typeof data === 'string' ? JSON.parse(data) : data
    } catch (e) {
      return NextResponse.json(errorResponse('Invalid JSON data format'), { status: 400 })
    }

    // Create pricing table
    const pricingTable = await prisma.pricingTable.create({
      data: {
        departmentId,
        name,
        description,
        tableType: tableType || 'simple',
        data: parsedData,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(successResponse(pricingTable), { status: 201 })
  } catch (error) {
    console.error('Error creating pricing table:', error)
    return NextResponse.json(errorResponse('Failed to create pricing table'), { status: 500 })
  }
}
