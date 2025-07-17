'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Event, EventFilters, EventSearchParams } from '@/types/events'

export function useEvents(filters?: EventFilters) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .eq('is_active', true)

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      if (filters?.priceMin !== undefined) {
        query = query.gte('price', filters.priceMin)
      }

      if (filters?.priceMax !== undefined) {
        query = query.lte('price', filters.priceMax)
      }

      if (filters?.date) {
        const startOfDay = new Date(filters.date)
        const endOfDay = new Date(filters.date)
        endOfDay.setHours(23, 59, 59, 999)
        
        query = query
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString())
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setEvents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const searchEvents = async (params: EventSearchParams) => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .eq('is_active', true)

      if (params.q) {
        query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`)
      }

      if (params.category) {
        query = query.eq('category', params.category)
      }

      if (params.price_range) {
        const [min, max] = params.price_range.split('-').map(Number)
        if (min !== undefined) query = query.gte('price', min)
        if (max !== undefined) query = query.lte('price', max)
      }

      if (params.date) {
        const startOfDay = new Date(params.date)
        const endOfDay = new Date(params.date)
        endOfDay.setHours(23, 59, 59, 999)
        
        query = query
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString())
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setEvents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search events')
    } finally {
      setLoading(false)
    }
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
    searchEvents
  }
} 