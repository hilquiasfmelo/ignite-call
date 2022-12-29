import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { PrismaAdapter } from '../../../lib/auth/prisma-adapter'

export function buildNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions {
  return {
    // Função de Adapter
    adapter: PrismaAdapter(req, res),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            scope: process.env.GOOGLE_SCOPE_USER,
          },
        },
        // Busca somente os dados do usuário que queremos do Google
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            // Escrito dessa forma pois o mesmo já está criado no Banco
            username: '',
            email: profile.email,
            avatar_url: profile.picture,
          }
        },
      }),
    ],

    // No momento que o usuário se logar, essas funções serão chamadas
    callbacks: {
      // Verifica se o usuário não permitou acesso ao Google Calendar
      async signIn({ account }) {
        if (
          !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
        ) {
          return '/register/connect-calendar/?error=permissions'
        }

        // Tudo ok... Prossiga!
        return true
      },

      // Retorna todos os dados que queremos como resposta para ser consumido pelo Frontend
      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function Auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
