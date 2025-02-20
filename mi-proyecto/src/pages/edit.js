import { useState, useEffect } from "react";
import api from "../pages/api/axios";
import Link from "next/link";

const Perfil = () => {
  const [perfil, setPerfil] = useState({ id: "", nombre: "", email: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Obtener datos del perfil al cargar la página
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerfil(response.data);
      } catch (error) {
        setErrorMessage("Error al cargar el perfil");
      }
    };

    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      await api.put(
        "/profile",
        {
          nombre: perfil.nombre,
          email: perfil.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Mostrar mensaje de éxito y limpiar error
      setSuccessMessage("Perfil actualizado exitosamente");
      setErrorMessage("");
    } catch (error) {
      // ✅ Mostrar mensaje de error y limpiar éxito
      setErrorMessage("Error al actualizar el perfil");
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Editar Perfil
        </h2>

        {/* Mensajes */}
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">ID:</label>
            <p className="text-gray-600">{perfil.id}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium" htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={perfil.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium" htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={perfil.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Guardar Cambios
          </button>
        </form>

        {/* Botón para ir al perfil */}
        <div className="mt-6">
          <Link href="/profile">
            <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
              Volver al Perfil
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
