import Verification from '@/components/auth/verification'

export default async function VerifyEmail({
  params,
}: {
  params: Promise<{ verifyToken: string }>
}) {
  const { verifyToken } = await params

  return <Verification verifyToken={verifyToken} />
}
