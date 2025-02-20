// pages/login.js
import { useState } from "react";
import loginUser from "../pages/loginUser";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita recargar la página

    const token = await loginUser(email, password);

    if (token) {
      setSuccess("Inicio de sesión exitoso ");
      setError("");
      console.log("Token:", token);

      // Guarda el token en localStorage para futuras peticiones
      localStorage.setItem("accessToken", token);
      // Redirigir a otra página después del login (ejemplo: perfil)
      window.location.href = "/profile";
    } else {
      setError("Credenciales incorrectas. Intenta nuevamente.");
      setSuccess("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500 bg-gray-100"
              placeholder="correo@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500 bg-gray-100"
              placeholder="Tu contraseña"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
