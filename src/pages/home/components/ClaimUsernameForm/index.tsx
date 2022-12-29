import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'phosphor-react'
import { useRouter } from 'next/router'
import { Button, Text, TextInput } from '@ignite-ui/react'

import { Form, FormAnnotation } from './styles'

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

  async function handleClaimUsername(data: claimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
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
