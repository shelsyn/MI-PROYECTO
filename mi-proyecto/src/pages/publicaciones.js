import { useEffect, useState } from "react";
import api from "./api/axios";
import Link from "next/link";

export default function Publicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Función para obtener las publicaciones
  const obtenerPublicaciones = async () => {
    try {
      const response = await api.get("/publicaciones");
      setPublicaciones(response.data);
    } catch (err) {
      setError("Error al obtener publicaciones");
    }
  };

  // Cargar publicaciones al inicio
  useEffect(() => {
    obtenerPublicaciones();
  }, []);

  // Función para crear nueva publicación
  const crearPublicacion = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/publicaciones", {
        titulo,
        contenido,
      });
      setSuccess("Publicación creada exitosamente");
      setTitulo("");
      setContenido("");
      obtenerPublicaciones();
    } catch (err) {
      setError("Error al crear publicación");
    }
  };

  // Función para eliminar publicación
  const eliminarPublicacion = async (id) => {
    try {
      await api.delete(`/publicaciones/${id}`);
      setSuccess("Publicación eliminada exitosamente");
      obtenerPublicaciones();
    } catch (err) {
      setError("Error al eliminar publicación");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 bg-gradient-to-b from-white to-gray-100 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">Publicaciones</h1>

        {/* Botón "Volver al Perfil" más pequeño en la esquina */}
        <Link href="/profile">
          <button className="bg-gray-800 text-white py-2 px-4 rounded-md text-sm shadow-md hover:bg-gray-700 transition duration-300">
            Volver al Perfil
          </button>
        </Link>
      </div>

      {/* Mensajes de error y éxito */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      {/* Formulario para crear publicación */}
      <form onSubmit={crearPublicacion} className="space-y-8">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <textarea
          placeholder="Contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        ></textarea>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            type="submit"
            className="w-1/2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-4 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300"
          >
            Crear Publicación
          </button>
        </div>
      </form>

      {/* Listado de publicaciones */}
      <div className="mt-12 space-y-8">
        {publicaciones.length === 0 ? (
          <p className="text-center text-gray-500">No hay publicaciones aún.</p>
        ) : (
          publicaciones.map((pub) => (
            <div
              key={pub.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800">{pub.titulo}</h2>
              <p className="mt-4 text-lg text-gray-600">{pub.contenido}</p>
              <button
                onClick={() => eliminarPublicacion(pub.id)}
                className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
