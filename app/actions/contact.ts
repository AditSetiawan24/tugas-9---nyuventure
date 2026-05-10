'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, "Nama lengkap harus diisi"),
  email: z.string().email("Format email tidak valid"),
  topic: z.string().min(1, "Topik harus dipilih"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
})

export async function saveContactAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      topic: formData.get('topic'),
      message: formData.get('message'),
    }

    const validatedData = contactSchema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const supabase = await createClient()

    const { error } = await supabase.from('contacts').insert({
      name: validatedData.data.name,
      email: validatedData.data.email,
      topic: validatedData.data.topic,
      message: validatedData.data.message,
    })

    if (error) {
      console.error('Server Action Error (Supabase):', error)
      return { success: false, message: error.message }
    }

    return { success: true, message: 'Pesan berhasil terkirim!' }
  } catch (error: any) {
    console.error('Server Action Error (General):', error)
    return { success: false, message: 'Terjadi kesalahan sistem' }
  }
}
