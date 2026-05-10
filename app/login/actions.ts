'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()


  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  const { data: adminData } = await supabase
    .from('admins')
    .select('email')
    .eq('email', data.email)
    .single()

  if (adminData) {
    revalidatePath('/admin', 'layout')
    redirect('/admin/dashboard')
  } else {
    revalidatePath('/mvp', 'layout')
    redirect('/mvp')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  const { data: adminData } = await supabase
    .from('admins')
    .select('email')
    .eq('email', data.email)
    .single()

  if (adminData) {
    revalidatePath('/admin', 'layout')
    redirect('/admin/dashboard')
  } else {
    revalidatePath('/mvp', 'layout')
    redirect('/mvp')
  }
}
