// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from './providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Intention-Ally | Intelligent Search Companion',
  description: 'Discover high-quality information tailored to your needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}