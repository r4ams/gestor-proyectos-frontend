'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Label, TextInput, Textarea, Button, Card } from 'flowbite-react';

const fetchProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
      });
    }
  }, [project, reset]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/projects/${id}`, data);
      router.push('/dashboard');
    } catch (error) {
      alert('Error al actualizar proyecto');
    }
  };

  if (isLoading) return <p className="p-4">Cargando proyecto...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">Editar Proyecto</h2>
        <Button color="gray" onClick={() => router.push('/dashboard')}>← Volver</Button>
      </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" value="Nombre del Proyecto" />
            <TextInput id="name" {...register('name', { required: true })} />
          </div>

          <div>
            <Label htmlFor="description" value="Descripción" />
            <Textarea id="description" rows={4} {...register('description')} />
          </div>

          <Button type="submit" color="blue">Actualizar</Button>
        </form>
      </Card>
    </div>
  );
}
