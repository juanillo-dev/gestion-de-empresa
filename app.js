// ---------- DETECCIÓN DE ENTORNO ----------
const ES_GITHUB = location.hostname.includes("github.io");

// ---------- ENDPOINTS ----------
const API_PRODUCTOS = ES_GITHUB ? null : "/productos";
const API_CONTACTO  = ES_GITHUB ? null : "/contacto";

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();

    const form = document.getElementById("contacto");
    if (form) {
        form.addEventListener("submit", enviarFormulario);
    }
});

// ---------- CARGAR PRODUCTOS ----------
function cargarProductos() {

    // MODO DEMO (GitHub)
    if (ES_GITHUB) {
        const contenedor = document.getElementById("productos");
        if (!contenedor) return;

        contenedor.innerHTML = `
            <div class="producto">
                <h3>Reformas integrales</h3>
                <p class="precio">Desde 3.000 € <span class="aprox">aprox.</span></p>
            </div>
            <div class="producto">
                <h3>Electricidad</h3>
                <p class="precio">Desde 150 € <span class="aprox">aprox.</span></p>
            </div>
            <div class="producto">
                <h3>Fontanería</h3>
                <p class="precio">Desde 120 € <span class="aprox">aprox.</span></p>
            </div>
        `;
        return;
    }

    // MODO REAL (LOCAL)
    fetch(API_PRODUCTOS)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error HTTP: " + response.status);
            }
            return response.json();
        })
        .then(productos => {
            const contenedor = document.getElementById("productos");
            if (!contenedor) return;

            contenedor.innerHTML = "";

            if (!productos || productos.length === 0) {
                contenedor.innerHTML = "<p>No hay servicios disponibles</p>";
                return;
            }

            productos.forEach(p => {
                const div = document.createElement("div");
                div.classList.add("producto");

                div.innerHTML = `
                    <h3>${p.nombre}</h3>
                    <p class="precio">
                        ${p.precio.toLocaleString("es-ES")} €
                        <span class="aprox">aprox.</span>
                    </p>
                `;

                contenedor.appendChild(div);
            });
        })
        .catch(() => {
            const contenedor = document.getElementById("productos");
            if (contenedor) {
                contenedor.innerHTML =
                    "<p>Error conectando con el servidor</p>";
            }
        });
}

// ---------- FORMULARIO CONTACTO ----------
function enviarFormulario(e) {
    e.preventDefault();

    const resultado = document.getElementById("resultado");

    // MODO DEMO (GitHub)
    if (ES_GITHUB) {
        if (resultado) {
            resultado.innerText =
                "Formulario deshabilitado en la versión de demostración.";
        }
        return;
    }

    // MODO REAL (LOCAL)
    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        email: document.getElementById("email").value.trim(),
        mensaje: document.getElementById("mensaje").value.trim()
    };

    fetch(API_CONTACTO, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.text();
        })
        .then(msg => {
            if (resultado) resultado.innerText = msg;
            document.getElementById("contacto").reset();
        })
        .catch(() => {
            if (resultado) {
                resultado.innerText =
                    "No se pudo enviar el mensaje. Inténtalo más tarde.";
            }
        });
}
