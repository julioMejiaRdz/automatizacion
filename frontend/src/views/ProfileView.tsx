import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updateCurrentUserPassword, updateProfile } from '@/api/AuthAPI'
import ErrorMessage from '@/components/ErrorMessage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import type { UpdateCurrentUserPasswordForm, User, UserProfileForm } from '@/types/index'

function ProfileForm({ user }: { user: User }) {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({ defaultValues: { name: user.name, email: user.email } })

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => toast.error(error.message),
    onSuccess: (message) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de la cuenta</CardTitle>
        <CardDescription>Actualiza tu nombre y correo electrónico.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register('name', { required: 'El nombre es obligatorio' })} />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'El email es obligatorio',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' },
              })}
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCurrentUserPasswordForm>({
    defaultValues: { current_password: '', password: '', password_confirmation: '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateCurrentUserPassword,
    onError: (error) => toast.error(error.message),
    onSuccess: (message) => {
      toast.success(message)
      reset()
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar contraseña</CardTitle>
        <CardDescription>Usa al menos 8 caracteres.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="current_password">Contraseña actual</Label>
            <Input
              id="current_password"
              type="password"
              autoComplete="current-password"
              {...register('current_password', { required: 'La contraseña actual es obligatoria' })}
            />
            {errors.current_password && (
              <ErrorMessage>{errors.current_password.message}</ErrorMessage>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'La nueva contraseña es obligatoria',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              })}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmar nueva contraseña</Label>
            <Input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              {...register('password_confirmation', {
                required: 'Confirma la nueva contraseña',
                validate: (value, values) =>
                  value === values.password || 'Las contraseñas no coinciden',
              })}
            />
            {errors.password_confirmation && (
              <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Actualizando...' : 'Cambiar contraseña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function ProfileView() {
  const { data: user } = useAuth()
  if (!user) return null

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Mi perfil</h1>
      <ProfileForm user={user} />
      <ChangePasswordForm />
    </div>
  )
}
