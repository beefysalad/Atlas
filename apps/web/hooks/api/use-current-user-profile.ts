"use client"

import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import type { CurrentUserResponse } from "@workspace/shared"

import { getCurrentUserProfile } from "@/lib/api/users"

const currentUserProfileQueryKey = ["users", "current"] as const

function useCurrentUserProfile() {
  const { getToken } = useAuth()

  return useQuery<CurrentUserResponse>({
    queryKey: currentUserProfileQueryKey,
    queryFn: async () => {
      const token = await getToken()

      if (!token) {
        throw new Error("No token found")
      }

      return getCurrentUserProfile(token)
    },
  })
}

export { currentUserProfileQueryKey, useCurrentUserProfile }
