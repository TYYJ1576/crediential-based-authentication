'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

import { RegisterData, RegisterDataType } from '@/lib/zod/zod-schemas'
import { RegisterFormUI } from '../forms/register-form-ui'

/**
 * RegisterForm - Container component that handles registration form state,
 * validation, and submission logic.
 *
 * Uses react-hook-form for form handling with Zod schema validation.
 * On successful submission, displays a success message.
 * On failure, displays form-level error message.
 */
export default function RegisterForm() {
  // Initialize react-hook-form with Zod validation and default empty values
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDataType>({
    resolver: zodResolver(RegisterData), // Integrate Zod schema as validator
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  // Local state to track form-level error messages (e.g. server errors)
  const [formError, setFormError] = useState('')

  // Local state to hold any informational or success messages
  const [message, setMessage] = useState('')

  /**
   * onSubmit - async callback for form submission.
   * Sends a POST request to "/api/auth/register" with form data.
   * Updates messages according to response.
   *
   * @param data - Form data validated by react-hook-form and Zod
   */
  const onSubmit = async (data: RegisterDataType) => {
    setFormError('') // Clear previous error state

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })

    const resData = await res.json()

    if (res.ok) {
      // On success set success message
      setMessage(resData.message)
    } else {
      // On failure set form-level error message
      setFormError(resData.error)
    }
  }

  return (
    // Render the presentational register form UI component passing all necessary props
    <RegisterFormUI
      onSubmit={handleSubmit(onSubmit)} // Wrap submit with react-hook-form handling
      errors={errors} // Validation errors to display
      register={register} // Register function for inputs
      formError={formError} // Form-level error message
      isSubmitting={isSubmitting} // Submission loading state
      message={message} // Informational/success message
    />
  )
}
