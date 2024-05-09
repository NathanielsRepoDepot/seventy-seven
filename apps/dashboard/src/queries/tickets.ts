import type { Status } from '@/lib/search-params'
import { type Prisma, prisma } from '@seventy-seven/orm/prisma'
import { z } from 'zod'
import { usersQueries } from './users'

export const folderSchema = z.union([
  z.literal('all'),
  z.literal('unhandled'),
  z.literal('snoozed'),
  z.literal('starred'),
  z.literal('closed'),
])

export type Folder = z.infer<typeof folderSchema>

export type TicketsFindMany = Awaited<ReturnType<typeof findMany>>
export type TicketsFindById = NonNullable<Awaited<ReturnType<typeof findById>>>

const findMany = async (statuses: Status[] = []) => {
  const user = await usersQueries.findMe()

  const SELECT = {
    id: true,
    created_at: true,
    subject: true,
    snoozed_until: true,
    starred_at: true,
    closed_at: true,
    assigned_to_user: {
      select: {
        id: true,
        full_name: true,
        image_url: true,
      },
    },
    messages: {
      take: 1,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        sent_from_full_name: true,
        sent_from_email: true,
        sent_from_avatar_url: true,
        body: true,
        handler: {
          select: {
            id: true,
            full_name: true,
            image_url: true,
          },
        },
      },
    },
  } satisfies Prisma.TicketSelect

  const OR: Prisma.TicketWhereInput['OR'] =
    statuses.length === 0
      ? undefined
      : [
          ...(statuses.includes('unhandled') ? [{ closed_at: null }] : []),
          ...(statuses.includes('starred') ? [{ starred_at: { not: null } }] : []),
          ...(statuses.includes('snoozed') ? [{ snoozed_until: { not: null } }] : []),
          ...(statuses.includes('closed') ? [{ closed_at: { not: null } }] : []),
        ]

  const tickets = await prisma.ticket.findMany({
    where: {
      team_id: user.current_team_id,
      OR,
    },
    select: SELECT,
    orderBy: { created_at: 'desc' },
  })

  // "Unhandled" tickets are those where the last message was sent by a customer and not a team member.
  // Think of it as "unread" or "not responded to"
  const ticketsWithHandledStatus = tickets.map((ticket) => {
    const lastMessage = ticket.messages.at(-1)
    const isUnhandled = !lastMessage?.handler

    return {
      ...ticket,
      isUnhandled,
    }
  })

  if (statuses.length > 0 && statuses.includes('unhandled')) {
    return ticketsWithHandledStatus.filter((ticket) => ticket.isUnhandled)
  }

  return ticketsWithHandledStatus
}

const findById = async (id: string) => {
  const user = await usersQueries.findMe()

  const ticket = await prisma.ticket.findFirst({
    where: {
      // Make sure the ticket belongs to the user's team
      team: {
        members: {
          some: {
            user_id: user.id,
          },
        },
      },
      id,
    },
    select: {
      id: true,
      subject: true,
      starred_at: true,
      closed_at: true,
      assigned_to_user: {
        select: {
          id: true,
          full_name: true,
          image_url: true,
        },
      },
      team: {
        select: {
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  full_name: true,
                  image_url: true,
                },
              },
            },
          },
        },
      },
      messages: {
        select: {
          created_at: true,
          id: true,
          handler: {
            select: {
              id: true,
              full_name: true,
              image_url: true,
            },
          },
          sent_from_full_name: true,
          sent_from_email: true,
          sent_from_avatar_url: true,
          body: true,
        },
        orderBy: {
          created_at: 'asc',
        },
      },
    },
  })

  return ticket
}

export const ticketsQueries = {
  findMany,
  findById,
}
