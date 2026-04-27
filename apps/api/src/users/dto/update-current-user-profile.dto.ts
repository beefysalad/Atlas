import type { UpdateCurrentUserProfileRequest } from "@workspace/shared"

export class UpdateCurrentUserProfileDto implements UpdateCurrentUserProfileRequest {
  displayName!: string
  timezone?: string | null
  defaultLocation?: string | null
}
