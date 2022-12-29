import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'User already taken.',
    })
  }

  const user = await prisma.user.create({
    data: {
      username,
      name,
    },
  })

  // Criando cookie e setando o ID do usuário
  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7days

    // Seta a visibilidade do cookie para todas rotas
    path: '/',
  })

  return res.status(201).json(user)
}
