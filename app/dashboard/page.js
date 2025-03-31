'use client';

import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import useAuthGuard from '@/hooks/useAuthGuard';
import { Button } from 'flowbite-react';
import { PencilSquareIcon, TrashIcon, PlusIcon, ArrowRightOnRectangleIcon, UsersIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const fetchProjects = async () => {
  const { data } = await api.get('/projects');
  return data;
};

export default function Dashboard() {
  const isAuthChecked = useAuthGuard();
  const queryClient = useQueryClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: isAuthChecked,
  });

  const confirmDelete = (id) => {
    setProjectToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${projectToDelete}`);
      setShowConfirm(false);
      setProjectToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      alert('Error al eliminar proyecto');
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    } catch (error) {
      alert('Error al cerrar sesión');
    }
  };

  if (!isAuthChecked) return <p className="p-4">Verificando sesión...</p>;
  if (isLoading) return <p className="p-4">Cargando proyectos...</p>;
  if (isError) return <p className="p-4 text-red-600">Error al cargar proyectos.</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Mis Proyectos</h1>
        <div className="flex gap-3">
          <Link href="/projects/create">
            <Button color="blue" className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Crear proyecto
            </Button>
          </Link>
          <Link href="/users">
            <Button color="gray" className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              Administrar usuarios
            </Button>
          </Link>
          <Button color="failure" onClick={handleLogout} className="flex items-center gap-2">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No hay proyectos disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                <p className="text-gray-600">{project.description || 'Sin descripción'}</p>
              </div>

              <div className="flex gap-2">
                <Link href={`/projects/${project.id}/edit`}>
                  <Button color="gray" size="xs" className="flex items-center gap-1">
                    <PencilSquareIcon className="w-4 h-4" />
                    Editar
                  </Button>
                </Link>

                <Button
                  color="failure"
                  size="xs"
                  onClick={() => confirmDelete(project.id)}
                  className="flex items-center gap-1"
                >
                  <TrashIcon className="w-4 h-4" />
                  Eliminar
                </Button>
                <Link href={`/projects/${project.id}`}>
                  <Button color="blue" size="xs" className="flex items-center gap-1">
                    Ver
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de Confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-2">¿Eliminar proyecto?</h2>
            <p className="text-sm text-gray-600 mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
