import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

import { prisma } from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const users = await prisma.user.findMany()

  const getId = users.find((user) => user.id)

  if (getId) {
    setCookie({ res }, '@ignitecall:userId', getId.id, {
      maxAge: 60 * 60 * 24 * 7, // 7days

      path: '/',
    })
  }

  return res.json(users)
}
