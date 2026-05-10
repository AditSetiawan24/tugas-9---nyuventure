'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const ticketSchema = z.object({
  placeId: z.string().min(1, "Place ID wajib ada"),
  placeName: z.string().min(1, "Nama tempat wajib ada"),
  amount: z.coerce.number().min(1, "Amount tidak valid"),
  quantity: z.coerce.number().min(1, "Quantity tidak valid"),
  customerName: z.string().min(1, "Nama pemesan wajib diisi"),
  customerEmail: z.string().email("Format email tidak valid"),
  customerPhone: z.string().min(10, "Nomor telepon tidak valid").max(15, "Nomor telepon terlalu panjang"),
})

export async function saveTicketAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      placeId: formData.get('placeId') as string,
      placeName: formData.get('placeName') as string,
      amount: formData.get('amount') as string,
      quantity: formData.get('quantity') as string,
      customerName: formData.get('customerName') as string,
      customerEmail: formData.get('customerEmail') as string,
      customerPhone: formData.get('customerPhone') as string,
    }

    const validatedData = ticketSchema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        data: rawData,
      }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'User tidak ditemukan. Silakan login terlebih dahulu.' }
    }

    const { data: ticketData, error } = await supabase.from('tickets').insert({
      user_id: user.id,
      place_id: validatedData.data.placeId,
      place_name: validatedData.data.placeName,
      amount: validatedData.data.amount,
      quantity: validatedData.data.quantity,
      customer_name: validatedData.data.customerName,
      customer_email: validatedData.data.customerEmail,
      customer_phone: validatedData.data.customerPhone,
      status: 'success'
    }).select().single()

    if (error) {
      console.error('Server Action Error (Supabase):', error)
      return { success: false, message: error.message }
    }

    return { success: true, ticketId: ticketData.id, message: 'Pembayaran berhasil!' }
  } catch (error: any) {
    console.error('Server Action Error (General):', error)
    return { success: false, message: error.message || 'Terjadi kesalahan sistem' }
  }
}
