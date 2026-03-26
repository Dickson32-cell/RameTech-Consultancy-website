// Fix contact_messages table in Supabase
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    if (secret !== 'rametech-seed-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create contact_messages table if not exists
    const { error: createError } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS contact_messages (
          id UUID DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          service TEXT,
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_read BOOLEAN DEFAULT FALSE
        );
      `
    }).catch(() => {
      // RPC might not exist, try direct table creation via REST
      return { error: null }
    })

    // Try alternative: insert a test record first to see if table exists
    const { data, error: insertError } = await supabase
      .from('contact_messages')
      .insert([{ 
        name: 'Test User', 
        email: 'test@test.com', 
        phone: '', 
        service: '', 
        message: 'Test message',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.log('Table does not exist or error:', insertError)
      return NextResponse.json({ 
        success: false, 
        error: 'Table contact_messages does not exist in Supabase',
        details: insertError
      }, { status: 500 })
    }

    // Delete the test record
    if (data?.id) {
      await supabase.from('contact_messages').delete().eq('id', data.id)
    }

    return NextResponse.json({ success: true, message: 'contact_messages table is ready' })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
