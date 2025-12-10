document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDisplay = document.getElementById('message');

    // Función para mostrar mensajes al usuario
    const showMessage = (text, type) => {
        messageDisplay.textContent = text;
        messageDisplay.className = `message-area ${type}`;
    };

    // Manejador del envío del formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita el envío tradicional del formulario
        showMessage('', ''); // Limpia mensajes anteriores

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // Llama a tu endpoint de Express
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso (Código de estado 200)
                // 🚨 PASOS CRÍTICOS: GUARDAR TOKEN y ID DEL USUARIO 🚨
                if (data.token) {
                    // 1. GUARDAR EL TOKEN para el acceso a la API (admin.js lo lee)
                    localStorage.setItem('authToken', data.token);
                } else {
                    // Error si no se recibe el token
                    showMessage('Login exitoso, pero el token de seguridad no fue recibido.', 'error');
                    return;
                }

                if (data.user && data.user.id) {
                    // 2. GUARDAR EL ID del usuario (Necesario para la función finalizarPedido)
                    localStorage.setItem('user_id', data.user.id);
                }

                showMessage(`¡Bienvenido, ${data.user.nombre}! Redirigiendo...`, 'success');

                // Redirigir a la pantalla principal del sistema
                setTimeout(() => {
                    window.location.href = '/public/core.html';
                }, 1500);

            } else {
                // ... (Login fallido) ...
                // Login fallido (Códigos de estado 400, 401, 403, etc.)
                showMessage(data.message || 'Error al iniciar sesión. Inténtelo de nuevo.', 'error');
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            showMessage('No se pudo conectar con el servidor. Verifique la conexión.', 'error');
        }
    });
});






