'use client';

import { useForm } from 'react-hook-form';
import { Label, TextInput, Textarea, Button, Card } from 'flowbite-react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function CreateProject() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await api.post('/projects', data);
      router.push('/dashboard');
    } catch (error) {
      alert('Error al crear proyecto');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Crear Proyecto</h2>
          <Button color="gray" onClick={() => router.push('/dashboard')}>← Volver</Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" value="Nombre del Proyecto" />
            <TextInput
              id="name"
              {...register('name', { required: true })}
              color={errors.name ? 'failure' : undefined}
            />
          </div>

          <div>
            <Label htmlFor="description" value="Descripción" />
            <Textarea id="description" rows={4} {...register('description')} />
          </div>

          <Button type="submit" color="blue">Guardar</Button>
        </form>
      </Card>
    </div>
  );
}
