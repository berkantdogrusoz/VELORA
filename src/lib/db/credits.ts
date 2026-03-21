import { supabase } from './supabase'

const FREE_CREDITS = 3

export async function getOrCreateUser(clerkId: string, email?: string) {
  // Try to find existing user
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single()

  if (existing) return existing

  // Create new user with free credits
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      clerk_id: clerkId,
      email: email || null,
      credits: FREE_CREDITS,
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create user: ${error.message}`)
  return newUser
}

export async function getUserCredits(clerkId: string): Promise<number> {
  const user = await getOrCreateUser(clerkId)
  return user.credits
}

export async function deductCredit(clerkId: string, amount: number = 1): Promise<boolean> {
  // Atomic deduction — only succeeds if user has enough credits
  const { data, error } = await supabase.rpc('deduct_credits', {
    p_clerk_id: clerkId,
    p_amount: amount,
  })

  if (error) {
    // Fallback: manual check and update
    const { data: user } = await supabase
      .from('users')
      .select('credits')
      .eq('clerk_id', clerkId)
      .single()

    if (!user || user.credits < amount) return false

    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: user.credits - amount })
      .eq('clerk_id', clerkId)
      .gte('credits', amount)

    return !updateError
  }

  return data === true
}

export async function addCredits(clerkId: string, amount: number): Promise<void> {
  const user = await getOrCreateUser(clerkId)

  const { error } = await supabase
    .from('users')
    .update({ credits: user.credits + amount })
    .eq('clerk_id', clerkId)

  if (error) throw new Error(`Failed to add credits: ${error.message}`)
}

export async function logGeneration(
  clerkId: string,
  prompt: string,
  creditsUsed: number
): Promise<void> {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single()

  await supabase.from('generations').insert({
    user_id: user?.id,
    clerk_id: clerkId,
    prompt: prompt.substring(0, 500),
    credits_used: creditsUsed,
  })
}
