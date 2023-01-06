import { useForm } from 'react-hook-form'
import { Check } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession as unstableGetServerSession } from 'next-auth/next'

import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'
import { API } from '../../../lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const updateProfileFormSchema = z.object({
  bio: z.string(),
})

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileFormData) {
    await API.put('/users/update-profile', {
      bio: data.bio,
    })

    // Reseta os valores do campo da bio
    reset()

    await router.push(`/schedule/${session.data?.user.username}`)
  }

  return (
    <>
      {/*  noindex => o Google não vai indexar essa página */}
      <NextSeo title="Atualize seu perfil | Ignite Call" noindex />
      <Container>
        <Header>
          <Heading as="strong">Defina sua disponibilidade</Heading>
          <Text size="sm">
            Por último, uma breve descrição e uma foto de perfil.
          </Text>

          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>

          <Button type="submit" size="md" disabled={isSubmitting}>
            Finalizar
            <Check />
          </Button>
        </ProfileBox>
      </Container>
    </>
  )
}

// Carregamento da Sessão com os dados do usuário no ServerSide
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstableGetServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}
