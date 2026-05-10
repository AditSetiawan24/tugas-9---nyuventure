'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteTicketAction(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('tickets').delete().eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Failed to delete ticket:', err)
    return { success: false, error: err.message }
  }
}

export async function updateTicketStatusAction(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'success' ? 'canceled' : 'success'
    const supabase = await createClient()
    const { error } = await supabase.from('tickets').update({ status: newStatus }).eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (err: any) {
    console.error('Failed to update ticket status:', err)
    return { success: false, error: err.message }
  }
}
