import api from "./api/axios";

const loginUser = async (email, password) => {
  try {
    const response = await api.post(
      "/login",
      new URLSearchParams({
        username: email,
        password: password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response?.data || error);
    return null;
  }
};

export default loginUser;
