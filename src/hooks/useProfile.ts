import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Profile, HealthGoal, SubscriptionStatus } from '@/types'

export function useProfile(userId: string | undefined) {
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery<Profile | null>({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .single()
      if (error) throw error
      return data as Profile
    },
  })

  const updateProfile = useMutation({
    mutationFn: async (updates: {
      full_name?: string
      health_goal?: HealthGoal
      subscription_status?: SubscriptionStatus
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId!)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })

  return { profile, isLoading, updateProfile: updateProfile.mutate }
}
