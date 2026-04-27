import { BadRequestException, Injectable } from "@nestjs/common"
import { createClerkClient } from "@clerk/backend"
import type {
  CurrentUserResponse,
  GetAllUsersResponse,
  UpdateCurrentUserProfileRequest,
} from "@workspace/shared"
import { UsersRepository } from "./users.repository"

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async syncCurrentUser(clerkUserId: string): Promise<CurrentUserResponse> {
    const clerk = this.getClerkClient()
    const clerkUser = await clerk.users.getUser(clerkUserId)
    const primaryEmail =
      clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      ) ?? clerkUser.emailAddresses[0]

    if (!primaryEmail) {
      throw new BadRequestException("Clerk user has no email address")
    }

    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      clerkUser.username ||
      primaryEmail.emailAddress

    return this.usersRepository.upsertClerkUser({
      clerkId: clerkUser.id,
      email: primaryEmail.emailAddress,
      name: this.buildDisplayName(name),
      imageUrl: clerkUser.imageUrl || null,
    })
  }

  async updateCurrentUserProfile(
    clerkUserId: string,
    input: UpdateCurrentUserProfileRequest
  ): Promise<CurrentUserResponse> {
    const normalizedProfile = this.normalizeCurrentUserProfileInput(input)
    const currentUser = await this.syncCurrentUser(clerkUserId)

    if (currentUser.name !== normalizedProfile.displayName) {
      const { firstName, lastName } = this.splitDisplayName(
        normalizedProfile.displayName
      )

      await this.getClerkClient().users.updateUser(clerkUserId, {
        firstName,
        lastName,
      })
    }

    return await this.usersRepository.updateCurrentUserProfile({
      clerkId: clerkUserId,
      name: normalizedProfile.displayName,
      timezone: normalizedProfile.timezone,
      defaultLocation: normalizedProfile.defaultLocation,
    })
  }

  async getAllUsers(): Promise<GetAllUsersResponse> {
    return await this.usersRepository.getAllUsers()
  }

  private getClerkClient() {
    const secretKey = process.env.CLERK_SECRET_KEY

    if (!secretKey) {
      throw new BadRequestException("Missing CLERK_SECRET_KEY")
    }

    return createClerkClient({ secretKey })
  }

  private buildDisplayName(name: string): string {
    const normalizedName = name.trim()

    if (!normalizedName) {
      throw new BadRequestException("Display name is required")
    }

    return normalizedName
  }

  private normalizeCurrentUserProfileInput(
    input: UpdateCurrentUserProfileRequest
  ) {
    return {
      displayName: this.buildDisplayName(input.displayName),
      timezone: this.normalizeOptionalString(input.timezone),
      defaultLocation: this.normalizeOptionalString(input.defaultLocation),
    }
  }

  private normalizeOptionalString(value?: string | null): string | null {
    const normalizedValue = value?.trim()

    return normalizedValue ? normalizedValue : null
  }

  private splitDisplayName(displayName: string) {
    const [firstName, ...lastNameParts] = displayName.split(/\s+/)

    if (!firstName) {
      throw new BadRequestException("Display name is required")
    }

    return {
      firstName,
      lastName: lastNameParts.length > 0 ? lastNameParts.join(" ") : undefined,
    }
  }
}
