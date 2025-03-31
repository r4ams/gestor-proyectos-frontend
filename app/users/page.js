'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Label, TextInput } from 'flowbite-react';
import { TrashIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

const fetchUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [showForm, setShowForm] = useState(false);

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const createUser = useMutation({
    mutationFn: (user) => api.post('/users', user),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setNewUser({ name: '', email: '', password: '' });
      setShowForm(false);
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser.mutate(newUser);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Botón de regreso */}
      <div className="mb-4">
        <Button color="gray" onClick={() => router.push('/dashboard')} className="flex items-center gap-2">
          <ArrowLeftIcon className="w-5 h-5" />
          Volver al Dashboard
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Administrar Usuarios</h1>
        <Button onClick={() => setShowForm(!showForm)} color="blue" className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Nuevo Usuario
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded shadow p-4 mb-6">
          <div>
            <Label htmlFor="name" value="Nombre" />
            <TextInput id="name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="password" value="Contraseña" />
            <TextInput id="password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          </div>
          <Button type="submit" color="blue">Crear Usuario</Button>
        </form>
      )}

      {isLoading ? (
        <p>Cargando usuarios...</p>
      ) : isError ? (
        <p className="text-red-600">Error al cargar usuarios.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <Button color="failure" size="xs" onClick={() => deleteUser.mutate(user.id)} className="flex items-center gap-1">
                <TrashIcon className="w-4 h-4" />
                Eliminar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
