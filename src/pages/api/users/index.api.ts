import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import { z } from 'zod'

import { prisma } from '../../../lib/prisma'

const userBodySchema = z.object({
  username: z.string().min(3),
  name: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = userBodySchema.parse(req.body)

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    setCookie({ res }, '@ignitecall:userId', userExists.id, {
      maxAge: 60 * 60 * 24 * 7, // 7days

      path: '/',
    })

    return res.status(400).json({
      message: 'Usuário já cadastrado, conecte-se com o Google 🌎',
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
