'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function loginAction(prevState, formData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/leads',
    })
    return null
  } catch (err) {
    if (err instanceof AuthError) {
      return 'Incorrect email or password.'
    }
    throw err
  }
}
