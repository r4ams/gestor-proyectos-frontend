'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useState, useEffect } from 'react';
import { Button, Label, TextInput, Textarea, Checkbox } from 'flowbite-react';

const fetchProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

const fetchTasks = async (id) => {
  const { data } = await api.get(`/projects/${id}/tasks`);
  return data;
};

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [newTask, setNewTask] = useState({ name: '', description: '' });
  const [editTaskData, setEditTaskData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
  });

  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => fetchTasks(id),
  });

  const createTask = useMutation({
    mutationFn: (task) => api.post(`/projects/${id}/tasks`, task),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', id]);
      setNewTask({ name: '', description: '' });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (taskId) => api.delete(`/tasks/${taskId}`),
    onSuccess: () => queryClient.invalidateQueries(['tasks', id]),
  });

  const toggleCompletion = useMutation({
    mutationFn: (task) => api.put(`/tasks/${task.id}`, {
      name: task.name,
      description: task.description,
      completed: !task.completed,
    }),
    onSuccess: () => queryClient.invalidateQueries(['tasks', id]),
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }) => api.put(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', id]);
      setShowEditModal(false);
    },
  });

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    createTask.mutate(newTask);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateTask.mutate({ id: editTaskData.id, data: editTaskData });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button color="gray" onClick={() => router.push('/dashboard')} className="mb-4">
        ← Volver al Dashboard
      </Button>

      {loadingProject ? (
        <p>Cargando proyecto...</p>
      ) : (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
      )}

      <form onSubmit={handleTaskSubmit} className="space-y-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Agregar nueva tarea</h2>
        <div>
          <Label htmlFor="name" value="Nombre de la tarea" />
          <TextInput id="name" value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="description" value="Descripción" />
          <Textarea id="description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
        </div>
        <Button type="submit" color="blue">Agregar</Button>
      </form>

      {loadingTasks ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No hay tareas aún.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`p-4 bg-white rounded border flex justify-between items-center ${task.completed ? 'opacity-60' : ''}`}
            >
              <div>
                <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox checked={task.completed} onChange={() => toggleCompletion.mutate(task)} />
                <Button size="xs" color="light" onClick={() => { setEditTaskData(task); setShowEditModal(true); }}>Editar</Button>
                <Button size="xs" color="failure" onClick={() => deleteTask.mutate(task.id)}>Eliminar</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de Edición con Tailwind puro */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Editar tarea</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name" value="Nombre de la tarea" />
                <TextInput
                  id="edit-name"
                  value={editTaskData?.title || ''}
                  onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description" value="Descripción" />
                <Textarea
                  id="edit-description"
                  value={editTaskData?.description || ''}
                  onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
