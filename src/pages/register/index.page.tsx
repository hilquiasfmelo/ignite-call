import { useForm } from 'react-hook-form'
import { ArrowRight } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AxiosError } from 'axios'

import { API } from '../../lib/axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário deve ter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras' }),
})

type registerFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<registerFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  // Busca o username do usuário pelos query params
  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: registerFormData) {
    try {
      await API.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push(`/register/connect-calendar`)
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)

        return await router.push(`/register/connect-calendar`)
      }
    }
  }

  return (
    <>
      <NextSeo
        title="Crie uma conta | Ignite Call"
        description="Precisamos de algumas informações para criar seu perfil! Ah, você
        pode editar essas informações depois."
      />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text size="sm">
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register('username')}
            />

            {/* Aciona uma mensagem se houver um erro  */}
            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>

          <label>
            <Text size="sm">Nome de completo</Text>
            <TextInput placeholder="Seu nome" {...register('name')} />

            {/* Aciona uma mensagem se houver um erro  */}
            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
