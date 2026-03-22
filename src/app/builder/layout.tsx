'use client'

import { LanguageProvider } from '@/lib/i18n/i18n-context'

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="h-screen w-screen overflow-hidden flex flex-col">
        {children}
      </div>
    </LanguageProvider>
  );
}
