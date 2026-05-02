import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Subscription } from '@/types'

export function useSubscription(userId: string | undefined) {
  const { data: subscription, isLoading } = useQuery<Subscription | null>({
    queryKey: ['subscription', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId!)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data as Subscription | null
    },
  })

  return { subscription, isLoading }
}
