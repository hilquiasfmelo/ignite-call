import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight, Plugs, PlugsConnected } from 'phosphor-react'
import { signIn, signOut, useSession } from 'next-auth/react'

import { Container, Header } from '../styles'
import { Auth, AuthError, ConnectBox, ConnectItem } from './styles'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  // !! => transforma algo em um Boolean
  const hasAuthError = !!router.query?.error

  const isSignedIn = session.status === 'authenticated'

  async function handleConnectCalendar() {
    await signIn('google')
  }

  async function handleLogoutUser() {
    signOut({
      redirect: false,
    }).then(() => {
      router.push('/')
    })
  }

  async function handleNavigateToNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <>
      {/*  noindex => o Google não vai indexar essa página */}
      <NextSeo title="Conecte sua agenda do Goole | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text size="sm">
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>

          <MultiStep size={4} currentStep={2} />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>

            {isSignedIn ? (
              <>
                <Button size="sm" disabled>
                  Conectado
                  <PlugsConnected />
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                onClick={handleConnectCalendar}
              >
                Conectar
                <Plugs />
              </Button>
            )}
          </ConnectItem>

          {/* Dispara uma mensagem de erro caso ele exista */}
          {hasAuthError && (
            <AuthError size="sm">
              Falha ao se conectar ao Google, verifique se você{' '}
              <strong>habilitou as permissões</strong> de acesso ao{' '}
              <strong>Google Calendar</strong>.
            </AuthError>
          )}

          <Button
            onClick={handleNavigateToNextStep}
            type="submit"
            disabled={!isSignedIn}
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </ConnectBox>
        {isSignedIn && (
          <>
            <Auth size="sm">
              {`Olá ${session.data.user.name} deseja sair?`}
              <strong>
                <button onClick={handleLogoutUser}>Clique aqui</button>
              </strong>
            </Auth>
          </>
        )}
      </Container>
    </>
  )
}
