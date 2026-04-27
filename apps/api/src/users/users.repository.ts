import { Injectable } from "@nestjs/common"
import type {
  CurrentUserResponse,
  GetAllUsersResponse,
} from "@workspace/shared"
import { PrismaService } from "../prisma/prisma.service"

type UpsertClerkUserInput = {
  clerkId: string
  email: string
  name: string
  imageUrl: string | null
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

    return {
      id: user.id,
      clerkId: user.clerkId!,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
    }
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
