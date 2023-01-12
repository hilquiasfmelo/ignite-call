import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'phosphor-react'
import { useRouter } from 'next/router'
import { Button, Text, TextInput } from '@ignite-ui/react'

import { Form, FormAnnotation } from './styles'
import { API } from '../../../../lib/axios'

type RequestProsp = [
  {
    username: string
  },
]

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário deve ter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
})

type claimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<claimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  // Redirects the user to the registration screen
  const router = useRouter()

  async function handleClaimUsername(dataUser: claimUsernameFormData) {
    const { username } = dataUser

    const { data } = await API.get<RequestProsp>('/users/get')

    const user = data.filter((user) => user.username === username)

    if (user.length <= 0) {
      return await router.push(`/register/?username=${username}`)
    } else {
      alert('Usuário já cadastrado, conecte-se com o Google 🌎')

      return await router.push(`/register/connect-calendar`)
    }
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      {errors.username ? (
        <FormAnnotation>
          <Text size="sm" style={{ color: '#F75A68' }}>
            {errors.username.message}
          </Text>
        </FormAnnotation>
      ) : (
        <FormAnnotation>
          <Text size="sm">Digite o nome do usuário desejado</Text>
        </FormAnnotation>
      )}
    </>
  )
}
