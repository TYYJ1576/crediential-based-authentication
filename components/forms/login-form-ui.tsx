'use client'

import React from 'react'
import { IconBrandGoogle } from '@tabler/icons-react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'

import { Label, Input } from '../ui'
import { LabelInputContainer, BottomGradient } from './forms-commons'

import { LoginDataType } from '@/lib/zod/zod-schemas'

/**
 * LoginFormUI - Presentational component for login form UI.
 *
 * @param onSubmit - Form submission handler.
 * @param errors - Validation errors from react-hook-form.
 * @param register - react-hook-form register function for fields.
 * @param formError - Server or form-level errors to display.
 * @param isSubmitting - Boolean indicating form submission in progress.
 *
 * Renders the login form with email and password fields, form error messages,
 * submit button, and additional links for registration and password recovery.
 * Also includes a button for Google login.
 */
export function LoginFormUI({
  onSubmit,
  errors,
  register,
  formError,
  isSubmitting,
}: {
  onSubmit: React.FormEventHandler<HTMLFormElement>
  errors: FieldErrors<LoginDataType>
  register: UseFormRegister<LoginDataType>
  formError: string
  isSubmitting: boolean
}) {
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      {/* Form Heading */}
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Login your account
      </h2>

      {/* Login Form */}
      <form className="my-8" onSubmit={onSubmit}>
        {/* Email Input Field */}
        <LabelInputContainer className={errors.email ? '' : 'mb-4'}>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            {...register('email')} // Register email input with react-hook-form
            error={!!errors.email} // Show error state if email validation fails
            disabled={isSubmitting} // Disable input while submitting
          />
        </LabelInputContainer>
        {/* Display email validation error */}
        {errors.email && (
          <p className="mb-4 max-w-sm text-sm text-red-600">
            {errors.email.message}
          </p>
        )}

        {/* Password Input Field */}
        <LabelInputContainer className={errors.password ? '' : 'mb-4'}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            {...register('password')} // Register password input with react-hook-form
            type="password"
            error={!!errors.password} // Show error state if password validation fails
            disabled={isSubmitting} // Disable input while submitting
          />
        </LabelInputContainer>
        {/* Display password validation error */}
        {errors.password && (
          <p className="mb-4 max-w-sm text-sm text-red-600">
            {errors.password.message}
          </p>
        )}

        {/* Display form-level error */}
        {formError && (
          <p className="mb-2 max-w-sm text-sm text-red-600">{formError}</p>
        )}

        {/* Submit button */}
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          disabled={isSubmitting} // Disable button while submitting
        >
          {/* Show loading text or login text based on submission state */}
          {isSubmitting && <p>loading...</p>}
          {!isSubmitting && <p>Login &rarr;</p>}
          <BottomGradient />
        </button>

        {/* Links for registration and password recovery */}
        <div>
          {!isSubmitting && (
            <a
              href="/id/register"
              className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 hover:underline"
            >
              Don&apos;t have an account?
            </a>
          )}
          {isSubmitting && (
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
              Don&apos;t have an account?
            </p>
          )}
        </div>
        <div>
          {!isSubmitting && (
            <a
              href="/id/recovery"
              className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 hover:underline"
            >
              Forgot your password?
            </a>
          )}
          {isSubmitting && (
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
              Forgot your password?
            </p>
          )}
        </div>

        {/* Separator */}
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* Google Login Button */}
        <div className="flex flex-col space-y-4">
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  )
}
