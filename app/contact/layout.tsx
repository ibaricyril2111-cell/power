import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact et horaires',
  description: 'Contactez Power Primeur au 06 59 84 50 17 ou rendez-vous au 114 rue Paul Vaillant-Couturier, 94140 Alfortville.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
