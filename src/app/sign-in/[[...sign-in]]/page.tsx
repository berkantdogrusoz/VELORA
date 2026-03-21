import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
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
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full max-w-md',
            },
          }}
        />
      </div>
    </div>
  )
}
