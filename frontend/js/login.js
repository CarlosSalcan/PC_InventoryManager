async function iniciarSesion() {
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://localhost:3000/tics/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            // Inicio de sesión exitoso
            alert('Inicio de sesión exitoso');
            // Redirigir al usuario a la página principal, por ejemplo:
            window.location.href = `../frontend/index.html?username=${username}`;
        } else {
            // Error de inicio de sesión
            alert('Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión');
    }
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    await iniciarSesion();
});
