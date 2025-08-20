'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { LoginData, LoginDataType } from '@/lib/zod/zod-schemas'
import { LoginFormUI } from '../forms/login-form-ui'
import { useProfile } from '@/hook/useProfile'

/**
 * LoginForm - Container component that manages login form state,
 * validation, and submission.
 *
 * Uses react-hook-form with Zod schema validation for user login.
 * Redirects authenticated users to the dashboard automatically.
 */
export default function LoginForm() {
  // Initialize react-hook-form with Zod resolver and default empty values
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDataType>({
    resolver: zodResolver(LoginData), // Use Zod schema for validation
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // State to hold form-level error messages (e.g. server returned errors)
  const [formError, setFormError] = useState('')

  // Next.js router instance for client-side navigation
  const router = useRouter()

  // Custom hook to get current user profile and loading status
  const { profile, loading } = useProfile()

  /**
   * Redirect automatically to /dashboard if the user is already signed in.
   * Runs when profile or router changes.
   */
  useEffect(() => {
    if (profile) {
      router.replace('/dashboard') // Redirect replaces history entry
    }
  }, [profile, router])

  // Show loading UI while profile data is being fetched
  if (loading) {
    return (
      <div className="h-screen w-screen min-h-[200px] flex flex-col flex-wrap items-center justify-center gap-8">
        <div className="flex flex-col items-center min-w-[300px] w-full max-w-lg">
          <h2 className="text-2xl font-bold">loading...</h2>
        </div>
      </div>
    )
  }

  /**
   * onSubmit - async callback for login form submission.
   * Sends form data to the backend login API and handles the response.
   *
   * @param data - Login form data validated by react-hook-form and Zod
   */
  const onSubmit = async (data: LoginDataType) => {
    setFormError('') // Reset form error on new submission

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })

    const resData = await res.json()

    if (res.ok) {
      // Redirect to dashboard page after successful login
      router.push('/dashboard')
    } else {
      // Set form-level error to display returned error message
      setFormError(resData.error)
    }
  }

  return (
    // Render the presentational login form UI component passing all necessary props
    <LoginFormUI
      onSubmit={handleSubmit(onSubmit)} // Wrap onSubmit with react-hook-form validation
      errors={errors} // Validation errors per field
      register={register} // Register function for inputs
      formError={formError} // Form-level error message
      isSubmitting={isSubmitting} // Submission loading state
    />
  )
}
