import type {
  CurrentUserResponse,
  GetAllUsersResponse,
  UpdateCurrentUserProfileRequest,
} from "@workspace/shared"

import { apiClient } from "@/lib/axios"

async function syncCurrentUser(token: string): Promise<CurrentUserResponse> {
  const response = await apiClient.post<CurrentUserResponse>(
    "/users/me/sync",
    undefined,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}
async function getAllUsers(token: string): Promise<GetAllUsersResponse> {
  const response = await apiClient.get<GetAllUsersResponse>("/users/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

async function getCurrentUserProfile(
  token: string
): Promise<CurrentUserResponse> {
  const response = await apiClient.get<CurrentUserResponse>("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

async function updateCurrentUserProfile(
  token: string,
  data: UpdateCurrentUserProfileRequest
): Promise<CurrentUserResponse> {
  const response = await apiClient.patch<CurrentUserResponse>(
    "/users/me/profile",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

export {
  getAllUsers,
  getCurrentUserProfile,
  syncCurrentUser,
  updateCurrentUserProfile,
}
export type {
  CurrentUserResponse,
  GetAllUsersResponse,
  UpdateCurrentUserProfileRequest,
}
