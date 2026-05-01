'use server'

import { createClient } from '@/utils/supabase/server'

interface SaveTicketData {
  placeId: string;
  placeName: string;
  amount: number;
  quantity: number;
}

export async function saveTicketAction(data: SaveTicketData) {
  try {
    const supabase = await createClient()


    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User tidak ditemukan. Silakan login terlebih dahulu.' }
    }


    const { data: ticketData, error } = await supabase.from('tickets').insert({
      user_id: user.id,
      place_id: data.placeId,
      place_name: data.placeName,
      amount: data.amount,
      quantity: data.quantity,
      status: 'success'
    }).select().single()

    if (error) {
      console.error('Server Action Error (Supabase):', error)
      return { success: false, error: error.message }
    }

    return { success: true, ticketId: ticketData.id }
  } catch (error: any) {
    console.error('Server Action Error (General):', error)
    return { success: false, error: error.message || 'Terjadi kesalahan sistem' }
  }
}
