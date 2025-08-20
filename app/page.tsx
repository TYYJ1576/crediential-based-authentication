import Link from 'next/link'

import { LoginFormUI } from '@/components/forms/login-form-ui'
import { Button } from '@/components/ui'
import { GridBackground } from '@/components/background/grid-background'

export default function Home() {
  return (
    <GridBackground>
      <Button variant="outline">
        <Link href="/id/login">Get Started</Link>
      </Button>
    </GridBackground>
  )
}
