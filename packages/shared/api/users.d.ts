export type CurrentUserResponse = {
  id: string
  clerkId: string
  email: string
  name: string
  imageUrl: string | null
  timezone: string | null
  defaultLocation: string | null
}

export type UpdateCurrentUserProfileRequest = {
  displayName: string
  timezone?: string | null
  defaultLocation?: string | null
}

export type User = {
  id: string
  clerkId: string
  name: string
  email: string
  imageUrl: string | null
}

export type GetAllUsersResponse = {
  users: User[]
}
