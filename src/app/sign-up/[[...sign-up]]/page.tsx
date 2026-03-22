import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center obsidian-bg gold-veins">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1
            className="text-2xl text-gold tracking-[0.08em]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Élan<span className="text-foreground/90">Noire</span>
          </h1>
          <p className="mono-text text-[10px] text-gold-muted/50 tracking-widest mt-2">
            AI WEB BUILDER
          </p>
        </div>
        <SignUp
          fallbackRedirectUrl="/builder"
          appearance={{
            elements: {
              rootBox: 'w-full max-w-md',
              card: 'bg-[#1a1a1d] border border-[#c9a84c]/10 shadow-2xl',
              headerTitle: 'text-[#e8e6e3]',
              headerSubtitle: 'text-[#8a8578]',
              socialButtonsBlockButton: 'border-[#c9a84c]/10 hover:bg-[#c9a84c]/5 text-[#e8e6e3]',
              formFieldLabel: 'text-[#8a8578]',
              formFieldInput: 'bg-[#111113] border-[#c9a84c]/10 text-[#e8e6e3]',
              formButtonPrimary: 'bg-[#c9a84c] hover:bg-[#d4b65c] text-[#111113]',
              footerActionLink: 'text-[#c9a84c] hover:text-[#d4b65c]',
              identityPreviewEditButton: 'text-[#c9a84c]',
            },
          }}
        />
      </div>
    </div>
  )
}
