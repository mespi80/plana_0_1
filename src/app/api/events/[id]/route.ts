import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venue:venues(*)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isActive
    } = body;

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (venueId !== undefined) updateData.venue_id = venueId;
    if (price !== undefined) updateData.price = parseFloat(price) || 0;
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (isActive !== undefined) updateData.is_active = isActive;

    // Update times if date/time/duration provided
    if (date && time && duration) {
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + (parseFloat(duration) * 60 * 60 * 1000));
      updateData.start_time = startTime.toISOString();
      updateData.end_time = endTime.toISOString();
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', params.id)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 