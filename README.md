## Introduction

This project demonstrates how to implement a complete authentication system in Next.js using MongoDB and Redis. The authentication features include registering and logging in with a traditional email and password, Google login, and password reset functionality.

## Table of Contents

- [UI Components](#ui-components)
  - [Button](#button)
  - [Background](#background)
  - [Input](#input)
  - [Label](#label)
  - [Message Box](#message-box)
- [Forms UI](#forms-ui)
  - [Register Form](#register-form)
  - [Login Form](#login-form)
  - [Email Verification Form](#email-verification-form)
- [Validation](#validation)
  - [Zod](#zod)
- [Database](#mongodb)
- [Send Email](#nodemailer)
- [API](#api)
  - [Register](#register)
  - [Login](#login)
  - [Email Verification](#email-verification)

## UI Components

### Button

#### Button component from Shadcn/ui

Link: https://ui.shadcn.com/docs/components/button

### Input

#### Input component form modified from Aceternity UI

Link: https://ui.aceternity.com/components/signup-form

Modification:

- Added error and radius props to the InputProps interface and input component.
- Included dynamic styling to change the ring color and focus ring color based on the error prop.
- Made the radius prop customizable with a default value of 100 to control the hover effect radius.
- Wrapped the component's outer motion.div with conditional ring classes (inset-ring-2 with different colors) based on the error state.
- Changed the fixed focus-visible ring style to dynamically switch between red and neutral colors depending on error.
- Used cn utility to conditionally apply classes including the ring color classes.
- Removed the original fixed shadow and ring classes from the input element and replaced them with dynamic classes influenced by error.
- Added hover shadow toggle group-hover/input:shadow-none on the input element.
- Moved some static classes into template literals for easier conditional class management.
- Introduced mouse position states using useMotionValue with mouseX and mouseY and applied the radial gradient background reflecting these values.
- Enabled the radial background effect only on mouse enter and move by toggling visible state.

See the implementation in [`components/ui/input.tsx`](components/ui/input.tsx)

### Label

#### Label component form modified from Aceternity UI

Link: https://ui.aceternity.com/components/signup-form

### Message Box

- Displays a centered message box with a topic title and message text.
- Shows a button with customizable text.
- If signOut prop is true:
  - Clicking the button triggers an asynchronous sign-out API call.
  - On successful sign-out, redirects to the given redirectLocation.
  - On failure, displays an error message below the message text.
- If signOut prop is false or undefined:
  - The button acts as a link navigating to the redirectLocation.
- Uses Next.js router for client-side navigation.
- Manages sign-out error state and displays it if sign-out fails.

See the implementation in [`components/ui/message-box.tsx`](components/ui/message-box.tsx)

## Forms UI

### Register Form UI

- Displays a user registration form with fields for username, email, and password.
- Integrates with React Hook Form for input registration and validation error handling.
- Shows validation error messages below respective input fields.
- Displays form-level or server error messages and success/informational messages.
- Disables inputs and buttons during form submission.
- Contains a submit button that shows a loading state when submitting.
- Provides links to login and password recovery pages, with conditional rendering depending on submission state.
- Includes a styled horizontal divider separating form from the Google login button.
- Renders a Google login button with an icon, styled consistently with the form.
- Uses presentational components for labels, inputs, and styling wrappers to organize form layout.

See the implementation in [`components/forms/register-form-ui.tsx`](components/forms/register-form-ui.tsx)

### Login Form UI

- Renders a login form UI with email and password input fields.
- Uses React Hook Form for input registration and validation error handling.
- Displays validation error messages below the respective email and password inputs.
- Shows form-level or server error messages if provided.
- Disables inputs and buttons during form submission.
- Submit button shows a loading state ("loading...") while submitting and "Login →" otherwise.
- Provides links for user registration and password recovery with conditional rendering based on submission state.
- Inserts a styled horizontal divider separating the form from additional login options.
- Includes a Google login button with an icon and consistent styling.
- Uses presentational components for labels, inputs, and layout wrappers for organized form structure.

See the implementation in [`components/forms/login-form-ui.tsx`](components/forms/login-form-ui.tsx)

## Forms

### Register Form

- Manages user registration form state and validation using React Hook Form with Zod schema resolver.
- Sets default empty values for username, email, and password fields.
- Handles form submission asynchronously, sending registration data to the /api/auth/register endpoint via POST.
- Processes the server response:
- On success, sets a success message to display.
- On failure, sets a form-level error message to display.
- Passes form handlers, state, errors, and messages as props to a presentational RegisterFormUI component for rendering.
- Manages loading state (isSubmitting) automatically through React Hook Form during submission.

See the implementation in [`components/auth/register.tsx`](components/auth/register.tsx)

### Login Form

Client-side login form component with the following functionalities:

- Uses React Hook Form with Zod schema (LoginData) for form validation of email and password inputs.
- Initializes form fields with default empty values and tracks validation errors and submission state.
- Uses a custom hook useProfile to get the current user profile and loading status.
- Automatically redirects authenticated users to the /dashboard route to prevent access to the login page.
- Displays a loading message while the profile is being fetched.
- Handles form submission by sending a POST request with login credentials to the /api/auth/login endpoint.
- On successful login response, redirects the user to /dashboard.
- On failed login, displays the returned error message as a form-level error.
- Passes all necessary form state, handlers, and errors as props to the presentational LoginFormUI component for rendering.

See the implementation in [`components/auth/login.tsx`](components/auth/login.tsx)

### Email Verification Form

- Accepts a verifyToken as a prop (from URL or parent component).
- On mount (or when verifyToken changes), sends a POST request to /api/auth/verify-email with the token to verify the user's email.
- Maintains local state for verification status with possible values: "Verifying", "Success", "Fail", or "Missing".
- Displays a message reflecting the current verification status:
  - "Verifying..." while the request is in progress.
  - Success message upon successful verification.
  - Failure message if the verification fails or a network error occurs.
  - Missing token message if verifyToken is not provided.
- Conditionally renders navigation buttons based on verification outcome:
  - On success: Button linking to the Login page.
  - On failure: Button linking to the Registration page.
  - If token is missing: Button linking to the Home page.
- Centers the content both vertically and horizontally with spacing for good UX.

See the implementation in [`components/auth/verification.tsx`](components/auth/verification.tsx)

## Validation

### Zod

- LoginData schema:
  - email: must be a valid email address.
  - password: must be a string with length between 8 and 24 characters (inclusive exclusive), otherwise returns an error message "Password length must be within 8-24 characters".
- RegisterData schema:
  - username: must be a string with length between 4 and 16 characters (inclusive exclusive), with error message "Username length must be within 4-16 characters".
  - email: must be a valid email address.
  - password: must be a string with length between 9 and 23 characters (inclusive exclusive), with error message "Password length must be within 8-24 characters".
- Exports TypeScript types LoginDataType and RegisterDataType inferred from these schemas for strong typing in forms or other parts of the app.

See the implementation in [`lib/zod/zod-schemas.ts`](lib/zod/zod-schemas.ts)

## MongoDB

### Connection

Establishes a connection with MongoDB

See the implementation in [`lib/mongodb/mongodb.ts`](lib/mongodb/mongodb.ts)

### User Model

- Defines a TypeScript interface UserDocument describing the user document structure with fields:

  - \_id: string (Mongo document ID)
  - username: string
  - email: string
  - password: string (hashed)
  - emailVerified: Date or null (timestamp when the email is verified)
  - verifyToken: string or null (token for email verification)
  - verifyTokenExpiry: Date or null (expiry time for verification token)
  - createAt: Date (timestamp for document creation)
  - updateAt: Date (timestamp for last document update)

- Defines a Mongoose schema UserSchema with validation and defaults:

  - username: required string with error message "Name is required"
  - email: required, unique string matching an email regex pattern with the error message "Email is invalid"
  - password: required string
  - Optional fields for email verification and recovery tokens and their expiries, all defaulting to null
  - Enables automatic timestamping (createdAt and updatedAt fields) via { timestamps: true }

- Exports a User model, reusing the existing User model if already compiled in Mongoose's models cache (useful for hot reload in some environments).

See the implementation in [`lib/mongodb/model/User.ts`](lib/mongodb/models/User.ts)

## Nodemailer

an email sending utility using Nodemailer and Google's OAuth2 for authentication with Gmail.

See the implementation in [`lib/email/send-email.ts`](lib/email/send-email.ts)

## Api

### Register

Server-side API route handler for user registration that performs the following key functions:

- Validates incoming request JSON data against the RegisterData Zod schema to ensure proper structure and types. Returns 400 with validation errors if invalid.
- Connects to a MongoDB database.
- Checks if a user with the given email already exists and has verified their email (non-null emailVerified). If so, returns a 400 error to prevent duplicate registrations.
- Hashes the user's password securely with bcrypt.
- Generates a unique verification token (random 32-byte hex string) and sets an expiry time 1 hour in the future.
- Inserts or updates the user record in the database (upsert: true):

  - Sets username, email, hashed password.

  - Sets emailVerified to null (unverified).

  - Stores verifyToken and its expiry.

- Constructs an email verification URL including the encoded verification token.
- Generates an HTML verification email using a separate VerificationEmail component.
- Sends the verification email to the user via the SendEmail utility.
- If sending email fails, returns a 400 error with the sending error message.
- On success, returns a 200 response with a message confirming that the verification email was sent.
- Catches and logs any unexpected errors and returns a 400 response with the error.

See the implementation in [`app/api/auth/register/route.ts`](app/api/auth/register/route.ts)

### Login

Server-side POST API handler for user login with the following functions:

- Parses and validates the incoming JSON request body against the LoginData Zod schema; returns a 400 error with detailed validation info if invalid.
- Connects to MongoDB.
- Queries the User collection for a user with the provided email whose email is verified (non-null emailVerified date).
- Returns a 400 error if no such verified user exists.
- Compares the provided password against the stored hashed password using bcrypt.
- Returns a 401 Unauthorized error if the password does not match.
- Generates a unique session ID with UUID v4 and sets a session expiration time of 12 hours from the current time.
- Creates a new Session document in MongoDB with the session ID, user ID, user data (username and email), and expiration.
- Serializes a secure, HTTP-only cookie named session_id with the session ID, scoped to the root path and set to expire along with the session; includes secure flag in production and uses lax same-site mode for CSRF protection.
- Returns a 200 success response with a message "Login success", including the session cookie in the Set-Cookie header.
- Catches unexpected errors and responds with a 500 status and a generic "Login failed" error message.

See the implementation in [`app/api/auth/login/route.ts`](app/api/auth/login/route.ts)

### Email Verification

Server-side POST API handler for email verification with the following key functions:

- Parses the request JSON body to extract the verifyToken.
- Connects to the MongoDB database.
- Looks up a user document with the matching verifyToken.
- Returns a 400 error response if no user is found with the provided token.
- Checks if the token has not expired by comparing verifyTokenExpiry with the current time.
- If the token is valid and not expired:
  - Updates the user document by setting:
    - emailVerified to the current timestamp (marking the email as verified),
    - verifyToken and verifyTokenExpiry to null (invalidate the token).
- Returns a 400 error if the update fails.
- If the update succeeds or the token is valid, returns a 200 success response indicating "verification succeed".
- Catches any unexpected errors, logs them, and responds with 400 status and the error message.

See the implementation in [`app/api/auth/verify-email/route.ts`](app/api/auth/verify-email/route.ts)
