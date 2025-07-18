import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const isActive = searchParams.get('isActive');

    let query = supabase
      .from('events')
      .select(`
        *,
        venue:venues(*)
      `);

    if (businessId) {
      query = query.eq('venue.business_id', businessId);
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      date,
      time,
      duration,
      venueId,
      price,
      capacity,
      isActive = true
    } = body;

    // Calculate start and end times
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + (parseFloat(duration) * 60 * 60 * 1000));

    const { data, error } = await supabase
      .from('events')
      .insert({
        venue_id: venueId,
        title,
        description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        price: parseFloat(price) || 0,
        capacity: parseInt(capacity),
        available_tickets: parseInt(capacity),
        category,
        is_active: isActive
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 