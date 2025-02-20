/* eslint-disable @next/next/no-html-link-for-pages */
// pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import api from "./api/axios";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter(); // Para redirección

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await api.post("/register", {
        nombre,
        email,
        contraseña: password, // El backend espera "contraseña"
      });

      if (response.status === 201) {
        setMensaje("✅ Usuario registrado exitosamente. Redirigiendo al login...");
        setTimeout(() => router.push("/login"), 2000); // Redirige al login después de 2s
      }
    } catch (error) {
      if (error.response && error.response.data.detail) {
        setMensaje(`⚠️ ${error.response.data.detail}`);
      } else {
        setMensaje("⚠️ Error al registrar usuario. Por favor, intenta nuevamente.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Registrar Usuario</h2>

        {mensaje && (
          <p className={`text-center mb-4 ${mensaje.startsWith("✅") ? "text-green-500" : "text-red-500"}`}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition"
          >
            Registrar
          </button>
        </form>

        {/* Enlace para ir al login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  );
}
