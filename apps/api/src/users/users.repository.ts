import { Injectable } from "@nestjs/common"
import type {
  CurrentUserResponse,
  GetAllUsersResponse,
  UpdateCurrentUserProfileRequest,
} from "@workspace/shared"
import { PrismaService } from "../prisma/prisma.service"

type UpsertClerkUserInput = {
  clerkId: string
  email: string
  name: string
  imageUrl: string | null
}

type UpdateCurrentUserProfileInput = {
  clerkId: string
  name: UpdateCurrentUserProfileRequest["displayName"]
  timezone: string | null
  defaultLocation: string | null
}

function toCurrentUserResponse(user: {
  id: string
  clerkId: string | null
  email: string
  name: string
  imageUrl: string | null
  timezone: string | null
  defaultLocation: string | null
}): CurrentUserResponse {
  return {
    id: user.id,
    clerkId: user.clerkId ?? "",
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl,
    timezone: user.timezone,
    defaultLocation: user.defaultLocation,
  }
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertClerkUser(
    input: UpsertClerkUserInput
  ): Promise<CurrentUserResponse> {
    const existingByClerkId = await this.prisma.db.user.findUnique({
      where: {
        clerkId: input.clerkId,
      },
    })

    const user = existingByClerkId
      ? await this.prisma.db.user.update({
          where: {
            id: existingByClerkId.id,
          },
          data: input,
        })
      : await this.upsertClerkUserByEmail(input)

    return toCurrentUserResponse(user)
  }

  private async upsertClerkUserByEmail(input: UpsertClerkUserInput) {
    const existingByEmail = await this.prisma.db.user.findUnique({
      where: {
        email: input.email,
      },
    })

    if (existingByEmail) {
      return await this.prisma.db.user.update({
        where: {
          id: existingByEmail.id,
        },
        data: input,
      })
    }

    return await this.prisma.db.user.create({
      data: input,
    })
  }

  async deleteByClerkId(clerkId: string): Promise<void> {
    await this.prisma.db.user.deleteMany({
      where: {
        clerkId,
      },
    })
  }

  async updateCurrentUserProfile(
    input: UpdateCurrentUserProfileInput
  ): Promise<CurrentUserResponse> {
    const user = await this.prisma.db.user.update({
      where: {
        clerkId: input.clerkId,
      },
      data: {
        name: input.name,
        timezone: input.timezone,
        defaultLocation: input.defaultLocation,
      },
    })

    return toCurrentUserResponse(user)
  }

  async getAllUsers(): Promise<GetAllUsersResponse> {
    const users = await this.prisma.db.user.findMany({
      where: {
        clerkId: {
          not: null,
        },
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        imageUrl: true,
      },
    })

    return {
      users: users.map((user) => ({
        id: user.id,
        clerkId: user.clerkId!,
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl,
      })),
    }
  }
}
