// src/app/api/v1/admin/pricing-tables/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'


// GET /api/v1/admin/pricing-tables/:id - Get single pricing table
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const pricingTable = await prisma.pricingTable.findUnique({
      where: { id: params.id },
      include: {
        department: true
      }
    })

    if (!pricingTable) {
      return NextResponse.json(errorResponse('Pricing table not found'), { status: 404 })
    }

    return NextResponse.json(successResponse(pricingTable))
  } catch (error) {
    console.error('Error fetching pricing table:', error)
    return NextResponse.json(errorResponse('Failed to fetch pricing table'), { status: 500 })
  }
}

// PUT /api/v1/admin/pricing-tables/:id - Update pricing table
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const body = await request.json()
    const { name, description, tableType, data, isActive } = body

    // Check if pricing table exists
    const existing = await prisma.pricingTable.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Pricing table not found'), { status: 404 })
    }

    // Validate JSON data if provided
    let parsedData
    if (data) {
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data
      } catch (e) {
        return NextResponse.json(errorResponse('Invalid JSON data format'), { status: 400 })
      }
    }

    // Update pricing table
    const pricingTable = await prisma.pricingTable.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(tableType && { tableType }),
        ...(parsedData && { data: parsedData }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        department: true
      }
    })

    console.log(`✅ Pricing table updated successfully: ${pricingTable.name} (ID: ${pricingTable.id})`)
    console.log(`   Department: ${pricingTable.department.name} (${pricingTable.department.slug})`)
    console.log(`   Active: ${pricingTable.isActive}`)

    // Revalidate relevant paths to clear cache
    try {
      revalidatePath('/departments')
      revalidatePath(`/departments/${pricingTable.department.slug}`)
      revalidatePath('/api/v1/departments')
      revalidatePath('/')
      console.log('✅ Cache revalidated for department pages')
    } catch (revalidateError) {
      console.error('Warning: Failed to revalidate cache:', revalidateError)
    }

    return NextResponse.json(successResponse(pricingTable))
  } catch (error) {
    console.error('Error updating pricing table:', error)
    return NextResponse.json(errorResponse('Failed to update pricing table'), { status: 500 })
  }
}

// DELETE /api/v1/admin/pricing-tables/:id - Delete pricing table
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    // Check if pricing table exists
    const existing = await prisma.pricingTable.findUnique({
      where: { id: params.id },
      include: {
        department: true
      }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Pricing table not found'), { status: 404 })
    }

    console.log(`🗑️ Deleting pricing table: ${existing.name} (ID: ${params.id})`)

    // Delete pricing table
    await prisma.pricingTable.delete({
      where: { id: params.id }
    })

    console.log(`✅ Pricing table deleted successfully: ${existing.name}`)

    // Revalidate relevant paths to clear cache
    try {
      revalidatePath('/departments')
      revalidatePath(`/departments/${existing.department.slug}`)
      revalidatePath('/api/v1/departments')
      revalidatePath('/')
      console.log('✅ Cache revalidated for department pages')
    } catch (revalidateError) {
      console.error('Warning: Failed to revalidate cache:', revalidateError)
    }

    return NextResponse.json(successResponse({ message: 'Pricing table deleted successfully' }))
  } catch (error) {
    console.error('Error deleting pricing table:', error)
    return NextResponse.json(errorResponse('Failed to delete pricing table'), { status: 500 })
  }
}
