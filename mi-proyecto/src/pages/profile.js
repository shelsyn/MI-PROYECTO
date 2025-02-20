import { useProfile } from "../pages/useProfile";
import Link from "next/link";
import { UserIcon, MailIcon, IdentificationIcon, ExclamationCircleIcon, CollectionIcon } from "@heroicons/react/outline";

export default function Profile() {
  const { userData, loading, error } = useProfile();

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">👤 Perfil de Usuario</h2>

      {/* Mostrar errores */}
      {error && (
        <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-md mb-6">
          <ExclamationCircleIcon className="h-7 w-7 mr-3" />
          <p className="text-lg">{error}</p>
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <p className="text-center text-gray-600 animate-pulse text-xl">Cargando perfil...</p>
      )}

      {/* Mostrar datos de usuario */}
      {userData && !loading && (
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <IdentificationIcon className="h-7 w-7 text-blue-600" />
            <div>
              <p className="text-gray-700 text-sm">ID:</p>
              <p className="text-xl font-medium">{userData.id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <UserIcon className="h-7 w-7 text-green-600" />
            <div>
              <p className="text-gray-700 text-sm">Nombre:</p>
              <p className="text-xl font-medium">{userData.nombre}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <MailIcon className="h-7 w-7 text-yellow-600" />
            <div>
              <p className="text-gray-700 text-sm">Email:</p>
              <p className="text-xl font-medium">{userData.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      {!loading && (
        <div className="mt-8 flex flex-col space-y-6">
          {/* Botón para editar perfil */}
          <Link href="/edit" passHref>
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              ✏️ Editar Perfil
            </button>
          </Link>

          {/* Botón para ver publicaciones */}
          <Link href="/publicaciones" passHref>
            <button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3">
              <CollectionIcon className="h-6 w-6" />
              <span>📚 Ver Mis Publicaciones</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
