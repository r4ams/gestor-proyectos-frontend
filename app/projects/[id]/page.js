"use client";
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, TextInput, Button, Label } from 'flowbite-react';
import { useState } from 'react';

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
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState('');

  const { data: project, isLoading: loadingProject, isError: errorProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    enabled: !!id
  });

  const { data: tasks, isLoading: loadingTasks, isError: errorTasks } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => fetchTasks(id),
    enabled: !!id
  });

  const createTask = useMutation({
    mutationFn: async () => {
      await api.post(`/projects/${id}/tasks`, { title: newTask });
    },
    onSuccess: () => {
      setNewTask('');
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
    }
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId) => {
      await api.delete(`/projects/${id}/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
    }
  });

  if (loadingProject) return <div className="p-8 text-center">Cargando proyecto...</div>;
  if (errorProject || !project) return <div className="p-8 text-center text-red-600">Error al cargar el proyecto.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h1>
        <p className="text-gray-600">{project.description || 'Sin descripción'}</p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tareas</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newTask.trim() !== '') createTask.mutate();
          }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <TextInput
            placeholder="Nueva tarea"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" color="blue">
            Agregar
          </Button>
        </form>

        {loadingTasks ? (
          <p>Cargando tareas...</p>
        ) : errorTasks ? (
          <p className="text-red-600">Error al cargar tareas.</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No hay tareas aún.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                <span>{task.title}</span>
                <Button size="xs" color="failure" onClick={() => deleteTask.mutate(task.id)}>
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}