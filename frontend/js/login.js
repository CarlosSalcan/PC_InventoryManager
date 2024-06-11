async function iniciarSesion() {
    try {
        // Obtener los valores del formulario
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Verificar si los campos están vacíos
        if (!username || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Enviar la solicitud al servidor
        const response = await fetch('http://localhost:3000/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Verificar la respuesta del servidor
        if (response.ok) {
            // Redirigir al usuario a la página de inicio después del inicio de sesión exitoso
            window.location.href = '../html/index.html'; // Cambia a la ruta correcta
        } else {
            const data = await response.json();
            alert(data.message); // Mostrar un mensaje de error si las credenciales son incorrectas
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
    }
}
