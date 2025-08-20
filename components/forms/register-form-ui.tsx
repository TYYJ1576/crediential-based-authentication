'use client'

import React from 'react'
import { IconBrandGoogle } from '@tabler/icons-react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'

import { Label, Input } from '../ui'
import { LabelInputContainer, BottomGradient } from './forms-commons'

import { RegisterDataType } from '@/lib/zod/zod-schemas'

/**
 * RegisterFormUI - Presentational component for user registration form.
 *
 * Props:
 * @param onSubmit - Form submit event handler.
 * @param errors - Validation errors from react-hook-form.
 * @param register - React Hook Form register function for inputs.
 * @param formError - Form-level or server error message string.
 * @param isSubmitting - Indicates if form submission is in progress.
 * @param message - Any informational or success message to show.
 *
 * Renders a registration form with username, email, and password fields,
 * validation error display, submit button, links for login/password recovery,
 * and a Google login button.
 */
export function RegisterFormUI({
  onSubmit,
  errors,
  register,
  formError,
  isSubmitting,
  message,
}: {
  onSubmit: React.FormEventHandler<HTMLFormElement>
  errors: FieldErrors<RegisterDataType>
  register: UseFormRegister<RegisterDataType>
  formError: string
  isSubmitting: boolean
  message: string
}) {
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      {/* Heading */}
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Create your account
      </h2>

      {/* Registration form */}
      <form className="my-8" onSubmit={onSubmit}>
        {/* Username field */}
        <LabelInputContainer className={errors.username ? '' : 'mb-4'}>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            {...register('username')} // Register username input
            type="text"
            error={!!errors.username} // Show error style if username invalid
            disabled={isSubmitting} // Disable during submission
          />
        </LabelInputContainer>
        {/* Username validation error message */}
        {errors.username && (
          <p className="mb-4 max-w-sm text-sm text-red-600">
            {errors.username.message}
          </p>
        )}

        {/* Email field */}
        <LabelInputContainer className={errors.email ? '' : 'mb-4'}>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            {...register('email')} // Register email input
            error={!!errors.email} // Show error style if email invalid
            disabled={isSubmitting} // Disable during submission
          />
        </LabelInputContainer>
        {/* Email validation error message */}
        {errors.email && (
          <p className="mb-4 max-w-sm text-sm text-red-600">
            {errors.email.message}
          </p>
        )}

        {/* Password field */}
        <LabelInputContainer className={errors.password ? '' : 'mb-4'}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            {...register('password')} // Register password input
            type="password"
            error={!!errors.password} // Show error style if password invalid
            disabled={isSubmitting} // Disable during submission
          />
        </LabelInputContainer>
        {/* Password validation error message */}
        {errors.password && (
          <p className="mb-4 max-w-sm text-sm text-red-600">
            {errors.password.message}
          </p>
        )}

        {/* Display form-level errors */}
        {formError && (
          <p className="mb-2 max-w-sm text-sm text-red-600">{formError}</p>
        )}

        {/* Display any informational or success messages */}
        {message && (
          <p className="mb-2 max-w-sm text-sm text-green-600">{message}</p>
        )}

        {/* Submit button */}
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 disabled:opacity-70 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          disabled={isSubmitting} // Disable while submitting
        >
          {/* Show 'loading...' text if submitting, else the button label */}
          {isSubmitting && <p>loading...</p>}
          {!isSubmitting && <p>Register &rarr;</p>}
          <BottomGradient />
        </button>

        {/* Link to login page */}
        <div>
          {!isSubmitting && (
            <a
              href="/id/login"
              className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 hover:underline"
            >
              Already have an account?
            </a>
          )}
          {isSubmitting && (
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
              Already have an account?
            </p>
          )}
        </div>
        {/* Link to password recovery page */}
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

        {/* Horizontal divider */}
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* Google login button */}
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
