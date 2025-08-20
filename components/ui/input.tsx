'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useMotionTemplate, useMotionValue, motion } from 'motion/react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  radius?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, radius = 100, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)

    let mouseX = useMotionValue(0)
    let mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect()

      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    }
    const ringColor = error
      ? 'inset-ring-2 inset-ring-red-500/25'
      : 'inset-ring-2 inset-ring-zinc-500/25'
    const motionColor = error ? '#ef4444' : '#3b82f6'
    const focusColor = error
      ? 'focus-visible:ring-2 focus-visible:ring-red-400'
      : 'focus-visible:ring-2 focus-visible:ring-neutral-400'

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${
                visible ? radius + 'px' : '0px'
              } circle at ${mouseX}px ${mouseY}px,
              ${motionColor},
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className={cn(
          'group/input rounded-lg p-[2px] transition duration-300',
          ringColor
        )}
      >
        <input
          type={type}
          className={cn(
            `
              flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2
              text-sm text-black transition duration-400
              group-hover/input:shadow-none file:border-0 file:bg-transparent
              file:text-sm file:font-medium placeholder:text-neutral-400
              focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50
              dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040]
              dark:focus-visible:ring-neutral-600
            `,
            focusColor,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
