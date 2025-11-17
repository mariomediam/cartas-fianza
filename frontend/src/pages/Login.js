import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "../store/authStore";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (!username.trim() || !password.trim()) {
      toast.error("Por favor ingrese usuario y contraseña");
      setLoading(false);
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      toast.success("¡Bienvenido! Sesión iniciada correctamente");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Lado izquierdo - Formulario */}
      <div className="flex flex-1 items-center justify-center p-2 bg-white">
        <div className="w-full max-w-md">
          {/* Logo y título */}
          <div className="flex items-center pb-2 my-4 ">
            <div className="flex justify-center items-center w-full">
              <img
                src={`${process.env.PUBLIC_URL}/images/logo-unf.png`}
                alt="Logo Universidad Nacional de Frontera"
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  // Fallback a SVG si la imagen no se encuentra
                  e.target.style.display = "none";
                  e.target.nextSibling.classList.remove("hidden");
                }}
              />
            </div>
          </div>

          {/* Título del sistema */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight text-center">
            SISTEMA DE GESTIÓN DE CARTAS FIANZA
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Ingrese a su cuenta
            </h3>

            <div className="mb-3">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         disabled:bg-gray-100 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         disabled:bg-gray-100 disabled:cursor-not-allowed
                         transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 text-[15px] font-semibold text-white 
                       bg-dark rounded-md mt-4
                       hover:bg-dark-400 hover:-translate-y-0.5 hover:shadow-lg
                       active:translate-y-0
                       disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none
                       transition-all duration-300"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>

      {/* Lado derecho - Imagen (oculta en móvil) */}
      <div
        className="hidden lg:flex flex-1 relative bg-primary-500 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/office-background.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/70 to-dark/80"></div>
      </div>
    </div>
  );
};

export default Login;
