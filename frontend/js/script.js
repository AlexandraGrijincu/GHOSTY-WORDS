document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('form');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Oprim reîncărcarea paginii

        // Colectăm datele din input-uri
        const username = document.querySelector('input[placeholder="User name"]').value;
        const email = document.querySelector('input[placeholder="Email"]').value;
        const password = document.querySelector('input[placeholder="Password"]').value;

        const userData = { username, email, password };

        try {
            // Trimitem datele către server (înlocuiește URL-ul când ai backend-ul gata)
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Cont creat cu succes!");
            } else {
                alert("Eroare: " + result.message);
            }
        } catch (error) {
            console.error("Eroare la conectarea cu serverul:", error);
            alert("Serverul nu răspunde. Asigură-te că backend-ul este pornit!");
        }
    });
});