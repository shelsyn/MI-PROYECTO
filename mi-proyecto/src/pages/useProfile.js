// hooks/useProfile.js
import { useState, useEffect } from "react";
import api from "../pages/api/axios";
import { useRouter } from "next/router";

export const useProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("⚠️ No estás autenticado. Redirigiendo al login...");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        const response = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal, 
        });

        setUserData(response.data);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          console.log("Solicitud cancelada");
        } else if (err.response) {
          console.error("Error del servidor:", err.response.data);
          setError(err.response.data.message || "Error al obtener el perfil.");
        } else if (err.request) {
          console.error("Sin respuesta del servidor:", err.request);
          setError(" El servidor no respondió. Verifica tu conexión.");
        } else {
          console.error("Error inesperado:", err.message);
          setError("Ocurrió un error inesperado.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      controller.abort(); // Limpiar la solicitud si el componente se desmonta
    };
  }, [router]);

  return { userData, loading, error };
};
