import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight, Plugs } from 'phosphor-react'
import { signIn, useSession } from 'next-auth/react'

import { Container, Header } from '../styles'
import { ConnectBox, ConnectItem } from './styles'

export default function ConnectCalendar() {
  const session = useSession()

  return (
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

          <Button
            type="submit"
            size="sm"
            variant="secondary"
            onClick={() => signIn('google')}
          >
            Conectar
            <Plugs />
          </Button>
        </ConnectItem>

        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>

      <Text>{JSON.stringify(session.data)}</Text>
      <Text>{JSON.stringify(session.status)}</Text>
    </Container>
  )
}
