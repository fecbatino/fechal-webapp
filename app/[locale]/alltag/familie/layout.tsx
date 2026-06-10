import { FamilyProvider } from '@/lib/family-context'

export default function FamilieLayout({ children }: { children: React.ReactNode }) {
  return <FamilyProvider>{children}</FamilyProvider>
}
