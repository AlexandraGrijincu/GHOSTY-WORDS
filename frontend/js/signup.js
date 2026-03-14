document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.querySelector('input[type="email"]').value;
            const passwordInput = document.querySelector('input[type="password"]').value;
            const userInput = document.querySelector('input[type="text"]').value;
            const payload = {
                username: userInput,
                email: emailInput,
                parola: passwordInput
            };

            const isLoginPage = document.title.toLowerCase().includes("log in") ||
                form.querySelector('button').innerText.toLowerCase().includes("log in");

            const endpoint = isLoginPage ? 'http://localhost:8080/api/login' : 'http://localhost:8080/api/register';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                // VERIFICAREA ESENȚIALĂ:
                if (response.ok) {
                    const data = await response.json();
                    console.log("Succes:", data.message);

                    // Salvăm ID-ul utilizatorului în localStorage (opțional, util pentru pagina următoare)
                    if(data.userId) {
                        localStorage.setItem('userId', data.userId);
                    }

                    window.location.href = "home.html";
                } else {
                    const errorData = await response.json();
                    alert("Eroare: " + (errorData.message || "A apărut o problemă!"));
                }

            } catch (error) {
                console.error("Eroare server:", error);
                alert("Serverul nu răspunde. Verifică dacă backend-ul este pornit.");
            }
        }); // Închide submit listener
    } // Închide if(form)
}); // Închide DOMContentLoaded