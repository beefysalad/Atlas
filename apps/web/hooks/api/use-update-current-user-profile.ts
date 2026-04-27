"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UpdateCurrentUserProfileRequest } from "@workspace/shared"

import { currentUserProfileQueryKey } from "@/hooks/api/use-current-user-profile"
import { updateCurrentUserProfile } from "@/lib/api/users"

function useUpdateCurrentUserProfile() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateCurrentUserProfileRequest) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No token found")
      }

      return updateCurrentUserProfile(token, data)
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(currentUserProfileQueryKey, updatedProfile)
      void queryClient.invalidateQueries({
        queryKey: currentUserProfileQueryKey,
      })
    },
  })
}

export { useUpdateCurrentUserProfile }
