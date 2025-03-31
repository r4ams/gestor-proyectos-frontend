"use client";
import { useState } from 'react';
import api from '@/lib/axios';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { Label, TextInput, Button, Card } from 'flowbite-react';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      const { token } = response.data;

      // Guarda el token en localStorage
      localStorage.setItem('access_token', token);

      // Redirige al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Credenciales inválidas o error del servidor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email" value="Correo electrónico" />
            <TextInput id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required shadow />
          </div>
          <div>
            <Label htmlFor="password" value="Contraseña" />
            <TextInput id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required shadow />
          </div>
          <Button type="submit" color="blue" className="cursor-pointer">
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
}