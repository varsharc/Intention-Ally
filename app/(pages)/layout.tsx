// app/(pages)/layout.tsx - Protected routes layout
import { AppLayout } from '@/app/components/layout/AppLayout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}