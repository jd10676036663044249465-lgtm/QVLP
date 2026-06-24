// =============================
// SECCION: Configuracion global
// Contexto: rutas principales de la aplicacion y valores compartidos.
// =============================
const CONFIG = {
    LOCATIONS: {
        mayales: "menu_mayales.html",
        guatapuri: "menu_guatapuri.html",
        checkout: "checkout.html"
    }
};

let currentProduct = null;

let currentProductImage = null;

// =============================
// SECCION: Estado de la aplicacion
// Contexto: guarda la sede activa, el producto actual y el carrito en memoria.
// =============================
const state = {
    location: null,
    cart: []
};

// =============================
// SECCION: Persistencia local
// Contexto: acceso centralizado a localStorage para carrito y sede.
// =============================
const storage = {
    get(key) {
        return JSON.parse(localStorage.getItem(key));
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};

// =============================
// SECCION: Navegacion
// Contexto: controla cambio de sede, regreso entre paginas y paso al checkout.
// =============================
function selectLocation(location) {

    const cart = storage.get("cart") || [];

    if (cart.length > 0) {
        const confirmChange = confirm("Tienes un pedido activo. Cambiar de sede lo eliminará. ¿Continuar?");
        
        if (!confirmChange) return;

        storage.remove("cart");
    }

    state.location = location;
    localStorage.setItem("location", location);

    if (!CONFIG.LOCATIONS[location]) {
        console.error("Location inválida:", location);
        return;
    }

    window.location.href = CONFIG.LOCATIONS[location];
}

function goToCheckout() {
    const cart = storage.get("cart") || [];

    if (cart.length === 0) {
        showAlert("Agrega productos antes de continuar");
        return;
    }

    window.location.href = "checkout.html";
}

function goBack() {

    const currentPage = window.location.pathname;

    const location = getLocation();

    const cart = storage.get("cart") || [];

    const hasItems = Array.isArray(cart) && cart.length > 0;

    // =========================
    // CHECKOUT → MENÚ
    // =========================
    if (currentPage.includes("checkout.html")) {

        // 🔥 si hay pedido
        if (hasItems) {

            showModal(
                "Tu pedido sigue en proceso. ¿Volver al menú?",
                () => {

                    if (location === "mayales") {
                        window.location.href = "menu_mayales.html";

                    } else if (location === "guatapuri") {
                        window.location.href = "menu_guatapuri.html";

                    } else {
                        window.location.href = "index.html";
                    }

                }
            );

            return;
        }

        // 🔥 sin pedido
        if (location === "mayales") {
            window.location.href = "menu_mayales.html";

        } else if (location === "guatapuri") {
            window.location.href = "menu_guatapuri.html";

        } else {
            window.location.href = "index.html";
        }

        return;
    }

    // =========================
    // MENÚ → INDEX
    // =========================
    if (hasItems) {

        showModal(
            "Tu pedido está en proceso. Si sales, podrías perder tu selección.",
            () => {

                storage.remove("cart");

                window.location.href = "index.html";
            }
        );

        return;
    }

    window.location.href = "index.html";
}

// =============================
// SECCION: Opciones de personalizacion
// Contexto: listas de toppings, salsas y batidos disponibles para el modal.
// =============================

const OPTIONS = {

    toppings: [
        "Pico de gallo",
        "Cebolla",
        "Jalapeño",
        "Nachos",
        "Queso costeño",
        "Queso mozzarella",
        "Papa ripio"
    ],

    salsas: [
        "Guacamole",
        "Tomate",
        "Piña",
        "Crema de leña",
        "Dulce maíz",
        "Mostaza"
    ],

    refrescos: [
        "Coca Cola",
        "Quatro",
        "Kola Roman",
        "Sprite",
        "Agua"
    ],

    refrescantes: [
        "Maracuyá",
        "Mango",
        "Mango y Maracuyá",
        "Fresa",
        "Mora",
        "Tomate de Árbol",
        "Guanábana",
        "Corozo",
        "Lulo"
    ],

    verdes: [
        "Piña + Apio + Pepino",
        "Perejil + Naranja"
    ],

    enLeche: [
        "Fresa",
        "Lulo",
        "Sapote",
        "Mora",
        "Fresa y Guanábana",
        "Guanábana"
    ]
};
const TOPPING_IMAGES = {

    "Pico de gallo": "img/products/toppings/Pico_de_gallo.webp",

    "Cebolla": "img/products/toppings/Cebolla.webp",

    "Jalapeño": "img/products/toppings/Jalapeño.webp",

    "Nachos": "img/products/toppings/Nacho.webp",

    "Queso costeño": "img/products/toppings/Queso_costeño.webp",

    "Queso mozzarella": "img/products/toppings/Queso_mozzarella.webp",

    "Papa ripio": "img/products/toppings/Papa_ripio.webp"
};

const SALSA_IMAGES = {

    "Guacamole": "img/products/salsas/guacamole.webp",

    "Tomate": "img/products/salsas/tomate.webp",

    "Piña": "img/products/salsas/piña.webp",

    "Crema de leña": "img/products/salsas/crema_de_leña.webp",

    "Dulce maíz": "img/products/salsas/dulce_maiz.webp",

    "Mostaza": "img/products/salsas/mostaza.webp"
};
// =============================
// SECCION: Datos del menu
// Contexto: productos por sede, categoria, precio, imagen y reglas de personalizacion.
// =============================
const data = {

    mayales: {

        perros: [

            {
                id: "perro_sencillo",

                type: "dog",

                name: "Perro Sencillo",

                price: 17900,

                img: "img/products/perros/perro_sencillo.webp",

                customizable: true,

                options: {
                    toppings: true,
                    salsas: true
                }
            },

            {
                id: "perro_doble",

                type: "dog",

                name: "Perro Doble",

                price: 21900,

                img: "img/products/perros/perro_doble.webp",

                customizable: true,

                options: {
                    toppings: true,
                    salsas: true
                }
            },

            {
                id: "combo_1",

                type: "combo",

                name: "Combo #1",

                description: "Perro sencillo + Coca Cola 250 ml",

                price: 20900,

                img: "img/products/Combos/Combo_1.webp",

                customizable: true,

                included: {
                bebida: "Coca Cola 250 ml"
                },

                options: {
                    toppings: true,
                    salsas: true,
                }
            },

            {
                id: "combo_2",

                type: "combo",

                name: "Combo #2",

                description: "Perro doble + Coca Cola 250 ml",

                price: 23900,

                img: "img/products/Combos/Combo_2.webp",

                customizable: true,

                included: {
                bebida: "Coca Cola 250 ml"
                },

                options: {
                    toppings: true,
                    salsas: true,

                }
            },

            {
                id: "combo_3",

                type: "combo_batido",

                name: "Combo #3",

                description: "Perro sencillo + Batido refrescante",

                price: 21900,

                img: "img/products/Combos/Combo_3.webp",

                customizable: true,

                options: {
                    toppings: true,
                    salsas: true,
                    batidos: true
                }
            },

            {
                id: "combo_4",

                type: "combo_batido",

                name: "Combo #4",

                description: "Perro doble + Batido refrescante",

                price: 22900,

                img: "img/products/Combos/Combo_4.webp",

                customizable: true,

                options: {
                    toppings: true,
                    salsas: true,
                    batidos: true
                }
            }

        ],

        bebidas: [

            {
                id: "coca_250",

                type: "drink",

                name: "Coca Cola 250 ml",

                price: 4000,

                img: "img/products/Gaseosas/Coca_250ml.webp",

                customizable: false
            },

            {
                id: "coca_400",

                type: "drink",

                name: "Coca Cola 400 ml",

                price: 5000,

                img: "img/products/Gaseosas/Coca_400ml.webp",

                customizable: false
            },

            {
                id: "coca_1500",

                type: "drink",

                name: "Coca Cola 1.5L",

                price: 9000,

                img: "img/products/Gaseosas/Coca_1.5L.webp",

                customizable: false
            },

            {
                id: "quatro_400",

                type: "drink",

                name: "Quatro 400 ml",

                price: 5000,

                img: "img/products/Gaseosas/Quatro_400ml.webp",

                customizable: false
            },

            {
                id: "quatro_1500",

                type: "drink",

                name: "Quatro 1.5L",

                price: 9000,

                img: "img/products/Gaseosas/Quatro_1.5L.webp",

                customizable: false
            },

            {
                id: "kola_400",

                type: "drink",

                name: "Kola Roman 400 ml",

                price: 5000,

                img: "img/products/Gaseosas/Kola_400ml.webp",

                customizable: false
            },

            {
                id: "kola_1500",

                type: "drink",

                name: "Kola Roman 1.5L",

                price: 9000,

                img: "img/products/Gaseosas/Kola_1L.webp",

                customizable: false
            },

            {
                id: "agua_280",

                type: "drink",

                name: "Agua 280 ml",

                price: 2000,

                img: "img/products/Gaseosas/Agua_280ml.webp",

                customizable: false
            },

            {
                id: "agua_600",

                type: "drink",

                name: "Agua 600 ml",

                price: 4000,

                img: "img/products/Gaseosas/Agua_600ml.webp",

                customizable: false
            },

            {
                id: "agua_manzana_280",

                type: "drink",

                name: "Agua de Manzana 280 ml",

                price: 3000,

                img: "img/products/Gaseosas/Agua_manzana_280ml.webp",

                customizable: false
            },

            {
                id: "ginger_400",

                type: "drink",

                name: "Ginger 400 ml",

                price: 5000,

                img: "img/products/Gaseosas/Ginger_400ml.webp",

                customizable: false
            }

        ],

        batidos: {

            refrescantes: [

                {
                    id: "batido_maracuya",

                    type: "shake",

                    name: "Maracuyá",

                    price: 9500,

                    img: "img/products/Batidos/Maracuyá.webp",

                    customizable: false
                },

                {
                    id: "batido_mango",

                    type: "shake",

                    name: "Mango",

                    price: 9500,

                    img: "img/products/Batidos/Mango.webp",

                    customizable: false
                },

                {
                    id: "batido_mango_maracuya",

                    type: "shake",

                    name: "Mango y Maracuyá",

                    price: 9500,

                    img: "img/products/Batidos/Mango_Maracuyá.webp",

                    customizable: false
                },

                {
                    id: "batido_fresa",

                    type: "shake",

                    name: "Fresa",

                    price: 9500,

                    img: "img/products/Batidos/Fresa.webp",

                    customizable: false
                },

                {
                    id: "batido_mora",

                    type: "shake",

                    name: "Mora",

                    price: 9500,

                    img: "img/products/Batidos/Mora.webp",

                    customizable: false
                },

                {
                    id: "batido_tomate_arbol",

                    type: "shake",

                    name: "Tomate de Árbol",

                    price: 9500,

                    img: "img/products/Batidos/Tomate_de_Árbol.webp",

                    customizable: false
                },

                {
                    id: "batido_guanabana",

                    type: "shake",

                    name: "Guanábana",

                    price: 9500,

                    img: "img/products/Batidos/Guanabaná.webp",

                    customizable: false
                },

                {
                    id: "batido_corozo",

                    type: "shake",

                    name: "Corozo",

                    price: 9500,

                    img: "img/products/Batidos/Corozo.webp",

                    customizable: false
                },

                {
                    id: "batido_lulo",

                    type: "shake",

                    name: "Lulo",

                    price: 9500,

                    img: "img/products/Batidos/Lulo.webp",

                    customizable: false
                }

            ],

            verdes: [

                {
                    id: "verde_pina_apio",

                    type: "shake",

                    name: "Piña + Apio ",

                    price: 9500,

                    img: "img/products/Batidos/piña_apio.webp",

                    customizable: false
                },

            ],


            en_leche: [

                {
                    id: "leche_fresa",

                    type: "shake",

                    name: "Fresa",

                    price: 13000,

                    img: "img/products/Batidos/Fresa.webp",

                    customizable: false
                },

                {
                    id: "leche_lulo",

                    type: "shake",

                    name: "Lulo",

                    price: 13000,

                    img: "img/products/Batidos/Fresa_Lulo.webp",

                    customizable: false
                },

                {
                    id: "leche_sapote",

                    type: "shake",

                    name: "Sapote",

                    price: 13000,

                    img: "img/products/Batidos/Sapote.webp",

                    customizable: false
                },

                {
                    id: "leche_mora",

                    type: "shake",

                    name: "Mora",

                    price: 13000,

                    img: "img/products/Batidos/Mora_con_leche.webp",

                    customizable: false
                },

                {
                    id: "leche_fresa_guanabana",

                    type: "shake",

                    name: "Fresa y Guanábana",

                    price: 13000,

                    img: "img/products/Batidos/fresa_Guanábana.webp",

                    customizable: false
                },

                {
                    id: "leche_guanabana",

                    type: "shake",

                    name: "Guanábana",

                    price: 13000,

                    img: "img/products/Batidos/Guanábana_leche.webp",

                    customizable: false
                }

            ]
        },

        crispetas: [

            {
                id: "crispeta_pequena",

                type: "popcorn",

                name: "Crispetas Pequeñas",

                price: 5000,

                img: "img/products/Palomitas/crispetas_pequeñas.webp",

                customizable: false
            },

            {
                id: "crispeta_mediana",

                type: "popcorn",

                name: "Crispetas Medianas",

                price: 7000,

                img: "img/products/Palomitas/crispetas_medianas.webp",

                customizable: false
            },

            {
                id: "crispeta_grande",

                type: "popcorn",

                name: "Crispetas Grandes",

                price: 9000,

                img: "img/products/Palomitas/crispetas_grandes.webp",

                customizable: false
            }

        ]
    },

    guatapuri: {

        perros: [

            {
                id: "g_perro_sencillo",

                type: "dog",

                name: "Perro Sencillo",

                price: 17900,

                img: "img/products/Perros/perro_sencillo2.webp",

                customizable: true,

                options: {
                    toppings: true,
                    salsas: true
                }
            },

            {
                id: "g_perro_doble",

                type: "dog",

                name: "Perro Doble",

                price: 21900,

                img: "img/products/Perros/perro_doble2.webp",

                customizable: true,

                options: {
                    toppings: true,
                    salsas: true
                }
            },

            {
                id: "g_combo_1",

                type: "combo",

                name: "Combo #1",

                description: "Perro sencillo + Coca Cola 250 ml",

                price: 20900,

                img: "img/products/Combos/Combo_1.webp",

                customizable: true,

                options: {
                    toppings: true,
                    salsas: true,
                    refrescos: true
                }
            },

            {
                id: "g_combo_2",

                type: "combo",

                name: "Combo #2",

                description: "Perro doble + Coca Cola 250 ml",

                price: 23900,

                img: "img/products/Combos/Combo_2.webp",

                customizable: true,

                options: {
                    toppings: true,
                    salsas: true,
                    refrescos: true
                }
            }

        ],

         bebidas: [

            {
                id: "coca_250",

                type: "drink",

                name: "Coca Cola 250 ml",

                price: 4000,

                img: "img/products/Gaseosas/Coca_250ml.webp",

                customizable: false
            },

            {
                id: "coca_400",

                type: "drink",

                name: "Coca Cola 400 ml",

                price: 5000,

                img: "img/products/Gaseosas/Coca_400ml.webp",

                customizable: false
            },

            {
                id: "coca_1500",

                type: "drink",

                name: "Coca Cola 1.5L",

                price: 9000,

                img: "img/products/Gaseosas/Coca_1.5L.webp",

                customizable: false
            },

            {
                id: "quatro_400",

                type: "drink",

                name: "Quatro 400 ml",

                price: 5000,

                img: "img/products/Gaseosas/Quatro_400ml.webp",

                customizable: false
            },

            {
                id: "quatro_1500",

                type: "drink",

                name: "Quatro 1.5L",

                price: 9000,

                img: "img/products/Gaseosas/Quatro_1.5L.webp",

                customizable: false
            },

            {
                id: "kola_400",

                type: "drink",

                name: "Kola Roman 400 ml",

                price: 5000,

                img: "img/products/Gaseosas/Kola_400ml.webp",

                customizable: false
            },

            {
                id: "kola_1500",

                type: "drink",

                name: "Kola Roman 1.5L",

                price: 9000,

                img: "img/products/Gaseosas/Kola_1L.webp",

                customizable: false
            },

            {
                id: "agua_280",

                type: "drink",

                name: "Agua 280 ml",

                price: 2000,

                img: "img/products/Gaseosas/Agua_280ml.webp",

                customizable: false
            },

            {
                id: "agua_600",

                type: "drink",

                name: "Agua 600 ml",

                price: 4000,

                img: "img/products/Gaseosas/Agua_600ml.webp",

                customizable: false
            },

            {
                id: "agua_manzana_280",

                type: "drink",

                name: "Agua de Manzana 280 ml",

                price: 3000,

                img: "img/products/Gaseosas/Agua_manzana_280ml.webp",

                customizable: false
            },

            {
                id: "ginger_400",

                type: "drink",

                name: "Ginger 400 ml",

                price: 5000,

                img: "img/products/Gaseosas/Ginger_400ml.webp",

                customizable: false
            }

        ]
    }
};

// =============================
// SECCION: Utilidades generales
// Contexto: funciones pequeñas para sede activa, menu e informacion reutilizable.
// =============================
function getLocation() {
    const path = window.location.pathname.toLowerCase();
    const pathLocation = path.includes("mayales")
        ? "mayales"
        : path.includes("guatapuri")
            ? "guatapuri"
            : null;

    if (pathLocation) {
        localStorage.setItem("location", pathLocation);
        return pathLocation;
    }

    let loc = localStorage.getItem("location");

    if (loc) {
        loc = loc.toLowerCase().trim();
    }

    return loc;
}

function getMenu() {
    return data[getLocation()];
}

const toppingsData = [
    "Ketchup",
    "Mostaza",
    "Mayonesa",
    "Queso",
    "Cebolla",
    "Pepinillos"
];

let selectedToppings = [];
let selectedSalsas = [];

let selectedRefresco = null;
let selectedBatido = null;

function renderToppings() {
    const container = document.getElementById("toppings");

    if (!container) return;

    container.innerHTML = toppingsData.map(t => `
        <div class="topping" onclick="toggleTopping(this, '${t}')">
            ${t}
        </div>
    `).join("");
}

function toggleTopping(el, name) {
    el.classList.toggle("active");

    if (selectedToppings.includes(name)) {
        const i = selectedToppings.indexOf(name);
        selectedToppings.splice(i, 1);
    } else {
        selectedToppings.push(name);
    }
}

// =============================
// SECCION: Renderizado de productos
// Contexto: crea tarjetas, filas horizontales y subcategorias visibles del menu.
// =============================
function createProductHTML(item) {

return `

<div
    class="product-card"
    onclick="openProductModal('${item.id}')"
>

    <div class="product-image-wrap">

        <img
            src="${item.img}"
            class="product-img"
            alt="${item.name}"
        >

        <button
            type="button"
            class="add-btn"
            aria-label="Agregar ${item.name}"
            onclick="event.stopPropagation();
            openProductModal('${item.id}')"
        >

            <img
                src="assets/icons/agregar.svg"
                alt=""
            >

        </button>

    </div>

    <div class="product-info">

        <h3 class="product-name">
            ${item.name}
        </h3>

        ${item.description ? `
            <p class="product-description">
                ${item.description}
            </p>
        ` : ""}

        <span class="product-price">
            $${item.price.toLocaleString("es-CO")}
        </span>

    </div>

</div>

`;

}

function renderProducts(container) {
    const menu = getMenu();
    if (!menu) return;

    const category = container.parentElement.dataset.category;
    const categoryData = menu[category];
    if (!categoryData) return;

    container.innerHTML = "";

    // 🔹 CASO 1: categoría normal (array)
    if (Array.isArray(categoryData)) {
        categoryData.forEach(item => {
            container.innerHTML += createProductHTML(item);
        });
    } 
    // 🔹 CASO 2: subcategorías (como batidos)
    else {
        for (let sub in categoryData) {

            const subContainer = document.createElement("div");
            subContainer.className = "sub-category";

            subContainer.innerHTML = `
                <div class="sub-header">
                    <span>${sub.replace("_", " ").toUpperCase()}</span>
                    <span class="material-icons arrow">expand_more</span>
                </div>
                <div class="sub-products"></div>
            `;

            const header = subContainer.querySelector(".sub-header");
            const productsDiv = subContainer.querySelector(".sub-products");

            header.onclick = (e) => {
                e.stopPropagation();

                const allSubs = container.querySelectorAll(".sub-products");
                const allHeaders = container.querySelectorAll(".sub-header");

                // 🔥 cerrar todos
                allSubs.forEach(el => {
                    if (el !== productsDiv) el.classList.remove("open");
                });

                allHeaders.forEach(h => {
                    if (h !== header) h.classList.remove("active");
                });

                // 🔥 toggle actual
                productsDiv.classList.toggle("open");
                header.classList.toggle("active");
            };

            categoryData[sub].forEach(item => {
                productsDiv.innerHTML += createProductHTML(item);
            });

            container.appendChild(subContainer);
        }
    }

}


function formatSubcategoryName(name) {
    return name
        .replace("_", " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

function renderVisibleProducts(container) {
    const menu = getMenu();
    if (!menu || !container) return;

    const category = container.parentElement.dataset.category;
    const categoryData = menu[category];
    if (!categoryData) return;

    container.innerHTML = "";
    container.classList.remove("has-subcategories");

    if (Array.isArray(categoryData)) {
        container.innerHTML = categoryData
            .map(item => createProductHTML(item))
            .join("");

        return;
    }

    container.classList.add("has-subcategories");

    Object.entries(categoryData).forEach(([subcategory, products]) => {
        const subContainer = document.createElement("div");
        subContainer.className = "product-subcategory";

        subContainer.innerHTML = `
            <div class="subcategory-title-row">
                <h3 class="subcategory-title">
                    ${formatSubcategoryName(subcategory)}
                </h3>
            </div>

            <div class="product-row">
                ${products.map(item => createProductHTML(item)).join("")}
            </div>
        `;

        container.appendChild(subContainer);
    });
}

function getBatidoOptionImage(name) {
    const sources = [
        getMenu()?.batidos,
        data.mayales?.batidos
    ].filter(Boolean);

    for (const source of sources) {
        const products = Object.values(source).flat();
        const found = products.find(item => item.name === name);

        if (found?.img) return found.img;
    }

    return "img/Logo_vivvan_los_perros_page-0001-removebg-preview.png";
}

// SECCION: Controles de desplazamiento
// Contexto: agrega flechas izquierda/derecha a filas horizontales cuando hay mas contenido.
function setupScrollControls(row) {
    if (!row || row.dataset.scrollControlsReady === "true") return;

    const parent = row.parentElement;
    if (!parent) return;

    parent.classList.add("has-scroll-hint");
    row.dataset.scrollControlsReady = "true";

    const controls = document.createElement("div");
    controls.className = "scroll-controls";
    controls.innerHTML = `
        <button
            type="button"
            class="scroll-arrow scroll-arrow-left"
            aria-label="Ver productos anteriores"
            data-scroll-direction="-1"
        >
            <span class="material-icons" aria-hidden="true">
                chevron_left
            </span>
        </button>

        <button
            type="button"
            class="scroll-arrow scroll-arrow-right"
            aria-label="Ver mas productos"
            data-scroll-direction="1"
        >
            <span class="material-icons" aria-hidden="true">
                chevron_right
            </span>
        </button>
    `;

    row.insertAdjacentElement("afterend", controls);

    const leftButton = controls.querySelector(".scroll-arrow-left");
    const rightButton = controls.querySelector(".scroll-arrow-right");

    const update = () => {
        const hasOverflow = row.scrollWidth > row.clientWidth + 8;
        const canScrollLeft = row.scrollLeft > 8;
        const canScrollRight =
            row.scrollLeft + row.clientWidth < row.scrollWidth - 10;

        controls.hidden = !hasOverflow;
        leftButton.hidden = !hasOverflow || !canScrollLeft;
        rightButton.hidden = !hasOverflow || !canScrollRight;
    };

    controls.addEventListener("click", (event) => {
        const button = event.target.closest("[data-scroll-direction]");
        if (!button) return;

        event.stopPropagation();
        const direction = Number(button.dataset.scrollDirection);
        row.scrollBy({
            left: direction * Math.max(row.clientWidth * 0.85, 140),
            behavior: "smooth"
        });

        window.setTimeout(update, 420);
    });

    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.requestAnimationFrame(update);
}

function setupProductScrollHints(scope = document) {
    scope
        .querySelectorAll(".products:not(.has-subcategories), .product-row")
        .forEach(setupScrollControls);
}

function setupIngredientScrollHints(scope = document) {
    scope
        .querySelectorAll(".modal-option-scroll, .modal-dropdown .sub-products")
        .forEach(setupScrollControls);
}

// SECCION: Busqueda y seleccion en el modal
// Contexto: centraliza busqueda de productos y seleccion de ingredientes.
function findProductById(productId) {
    const menu = getMenu();
    if (!menu) return null;

    for (const categoryData of Object.values(menu)) {
        const groups = Array.isArray(categoryData)
            ? [categoryData]
            : Object.values(categoryData);

        for (const group of groups) {
            const found = group.find(item => item.id === productId);
            if (found) return found;
        }
    }

    return null;
}

function toggleSelectedIngredient(element, group, value) {
    const target = group === "toppings" ? selectedToppings : selectedSalsas;
    const index = target.indexOf(value);

    if (index >= 0) {
        target.splice(index, 1);
        element.classList.remove("active");
        return;
    }

    target.push(value);
    element.classList.add("active");
}

function selectBatidoOption(element, value) {
    document
        .querySelectorAll(".batido-item")
        .forEach(item => item.classList.remove("active"));

    element.classList.add("active");
    selectedBatido = value;
}

function openProductModal(productId) {

    const menu = getMenu();

    let selectedProduct = null;

    selectedToppings = [];

    selectedSalsas = [];

    selectedRefresco = null;

    selectedBatido = null;

    // 🔥 buscar producto en todas las categorías
    for (let category in menu) {

        const categoryData = menu[category];

        // categoría normal
        if (Array.isArray(categoryData)) {

            const found = categoryData.find(
                item => item.id === productId
            );

            if (found) {
                selectedProduct = found;
                break;
            }

        }

        // subcategorías
        else {

            for (let sub in categoryData) {

                const found = categoryData[sub].find(
                    item => item.id === productId
                );

                if (found) {
                    selectedProduct = found;
                    break;
                }

            }

        }

    }

    // 🔥 seguridad
    if (!selectedProduct) return;
    currentProduct = selectedProduct;
    selectedToppings = [];
    selectedSalsas = [];
    currentProductImage =
    document.querySelector(
    `[onclick="openProductModal('${productId}')"] img`
);

    // =========================
    // MODAL
    // =========================

const modal = document.getElementById("product-modal");

const content = document.getElementById("product-modal-content");

content.innerHTML = `

    <div class="modal-close" onclick="closeProductModal()">
        ✕
    </div>

    <div class="modal-top">

        <img 
            src="${selectedProduct.img}" 
            class="product-modal-image"
            loading="lazy"
            decoding="async"
        >

        <div class="modal-product-info">

            <h2 class="product-modal-title">
                ${selectedProduct.name}
            </h2>

            <p class="product-modal-description">
               ${selectedProduct.description || ""}
            </p>

            <p class="product-modal-price">
                $${selectedProduct.price}
            </p>

        </div>

    </div>

    <div class="modal-divider"></div>

    <!-- TOPPINGS -->

    ${selectedProduct.options?.toppings ? `

    <div class="modal-dropdown">

        <div 
            class="sub-header"
            onclick="toggleModalDropdown(this)"
        >

            <span>Toppings</span>

            <span class="material-icons arrow">
                expand_more
            </span>

        </div>

        <div class="sub-products">

            ${OPTIONS.toppings.map(topping => `

<div
    class="option-card"
    onclick="toggleSelectedIngredient(this, 'toppings', '${topping}')"
>

    <img
        src="${TOPPING_IMAGES[topping]}"
        alt="${topping}"
        class="option-card-img"
    >

    <span class="option-card-name">
        ${topping}
    </span>

</div>

`).join("")}

        </div>

    </div>

    ` : ""}

    <!-- SALSAS -->

    ${selectedProduct.options?.salsas ? `

    <div class="modal-dropdown">

        <div 
            class="sub-header"
            onclick="toggleModalDropdown(this)"
        >

            <span>Salsas</span>

            <span class="material-icons arrow">
                expand_more
            </span>

        </div>

        <div class="sub-products">

            ${OPTIONS.salsas.map(salsa => `

                <div
             class="option-card"
              onclick="toggleSelectedIngredient(this, 'salsas', '${salsa}')"
    >

                    <img
        src="${SALSA_IMAGES[salsa]}"
        class="option-card-img"
          >

       <span class="option-card-name">
        ${salsa}
       </span>

                </div>

            `).join("")}

        </div>

    </div>

    ` : ""} 
       
            <!-- BATIDOS -->

   ${selectedProduct.options?.batidos ? `

<div class="modal-dropdown">

    <div 
        class="sub-header"
        onclick="toggleModalDropdown(this)"
    >

        <span>Batidos</span>

        <span class="material-icons arrow">
            expand_more
        </span>

    </div>

    <div class="sub-products">

        ${OPTIONS.refrescantes.map(batido => `

            <div 
                class="option-card batido-item"
                onclick="selectBatidoOption(this, '${batido}')"
            >

                <img
                    src="${getBatidoOptionImage(batido)}"
                    alt="${batido}"
                    class="option-card-img"
                >

                <span class="option-card-name">
                    ${batido}
                </span>

                <span class="check-icon">
                    ✓
                </span>

            </div>

        `).join("")}

    </div>

</div>

` : ""}

 <button class="modal-add-btn" onclick="addConfiguredProduct()">

   <span class="btn-text-left">
    Agregar &nbsp;&nbsp; →
</span>

<img
    src="assets/icons/boton_pagar.svg"
    alt="Agregar"
    class="btn-icon"
>

<span class="btn-text-right">
    ← &nbsp;&nbsp; al carrito
</span>

</button>
`; 

modal.classList.remove("hidden");
setupIngredientScrollHints(content);

}


function closeProductModal() {

    const modal = document.getElementById("product-modal");

    modal.classList.add("hidden");

}

function addConfiguredProduct() {

    if (!currentProduct) return;

    state.cart.push({

        id: currentProduct.id,

        name: currentProduct.name,

        price: currentProduct.price,

        img: currentProduct.img,

        toppings: [...selectedToppings],

        salsas: [...selectedSalsas],

        refresco: selectedRefresco,

        batido: selectedBatido,

        included: currentProduct.included || null
    });

    storage.set("cart", state.cart);

    updateCartCount();

    animateCartCount();

    animateCartBar();

    renderCart();

    animateToCart(currentProductImage);

    closeProductModal();

    console.log("cerrando modal");
}

function toggleModalDropdown(header) {

    const dropdown = header.parentElement;

    const content = dropdown.querySelector(".sub-products");

    const isOpen = content.classList.contains("open");

    // 🔥 cerrar todos
    document
        .querySelectorAll(".modal-dropdown .sub-products")
        .forEach(el => {
            el.classList.remove("open");
        });

    document
        .querySelectorAll(".modal-dropdown .sub-header")
        .forEach(h => {
            h.classList.remove("active");
        });

    // 🔥 abrir actual
    if (!isOpen) {

        content.classList.add("open");

        header.classList.add("active");
    }
}

// =============================
// SECCION: Categorias legacy
// Contexto: comportamiento anterior de acordeones, conservado por compatibilidad.
// =============================
function toggleCategory(categoryElement) {
    const products = categoryElement.querySelector(".products");
    const header = categoryElement.querySelector(".category-header");

    renderProducts(products);

    // 🔥 cerrar las demás
    document.querySelectorAll(".products").forEach(p => {
        if (p !== products) p.classList.remove("open");
    });

    document.querySelectorAll(".category-header").forEach(h => {
        if (h !== header) h.classList.remove("active");
    });

    // 🔥 toggle actual
    products.classList.toggle("open");
    header.classList.toggle("active");
}
// =============================
// CART
// =============================
function addToCart(name, price) {
    state.cart.push({ name, price });

    storage.set("cart", state.cart);

    updateCartCount();
}
function updateCartCount() {

    const el = document.getElementById("cart-count");

    if (!el) return;

    el.innerText = state.cart.length;

    el.classList.remove("bump");

    void el.offsetWidth;

    el.classList.add("bump");
}
function animateCartCount() {

    const badge =
        document.getElementById("cart-count");

    if (!badge) return;

    badge.classList.remove("pop");

    void badge.offsetWidth;

    badge.classList.add("pop");
}
function animateCartBar() {

    const cartBar =
        document.querySelector(".cart-bar");

    if (!cartBar) return;

    cartBar.classList.remove("bounce");

    void cartBar.offsetWidth;

    cartBar.classList.add("bounce");
}

// CARRITO
function renderCart() {

    const estimatedTime =
    document.getElementById("estimated-time");

if (estimatedTime) {

    const totalItems = state.cart.length;

    let minutes = 10;

    if (totalItems >= 3) {
        minutes = 18;
    }

    if (totalItems >= 5) {
        minutes = 28;
    }

    if (totalItems >= 8) {
        minutes = 43;
    }

    estimatedTime.innerText = `${minutes} min`;
}
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("total");

    if (!container || !totalEl) return;

    container.innerHTML = "";

    if (state.cart.length === 0) {

    container.innerHTML = `

    <div class="empty-cart">

        <div class="empty-cart-icon">
            🌭
        </div>

        <h3>
            Tu perrito aún no está listo
        </h3>

        <p>
            Prepáralo a tu gusto y arma el pedido perfecto
        </p>

    </div>

`;

    totalEl.innerText = "0";

    return;
}

    let total = 0;
    const grouped = {};

    state.cart.forEach(item => {
        if (!grouped[item.name]) {
            grouped[item.name] = { ...item, qty: 1 };
        } else {
            grouped[item.name].qty++;
        }
    });

    Object.values(grouped).forEach(item => {

        total += item.price * item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";

div.innerHTML = `

    <div class="cart-item-image">

        <img src="${item.img}" alt="${item.name}">

    </div>

    <div class="cart-item-info">

        <strong>
            ${item.name}
        </strong>

        ${item.toppings?.length ? `

            <small>
                 ${item.toppings.join(", ")}
            </small>

        ` : ""}

        ${item.salsas?.length ? `

            <small>
                 ${item.salsas.join(", ")}
            </small>

        ` : ""}

        ${item.refresco ? `

            <small>
                 ${item.refresco}
            </small>

        ` : ""}

        ${item.batido ? `

            <small>
                 ${item.batido}
            </small>

        ` : ""}

        ${item.included?.bebida ? `

    <small>
        ${item.included.bebida}
    </small>

` : ""}

        <div class="cart-item-price">
    $${item.price * item.qty}
</div>

    </div>

    <div class="cart-actions">

        <button class="minus">-</button>

        <button class="plus">+</button>

        <button class="remove">🗑️</button>

    </div>

`;


div.querySelector(".minus").addEventListener("click", () => {
            changeQty(item.name, -1);
        });

        div.querySelector(".plus").addEventListener("click", () => {
            changeQty(item.name, 1);
        });

        container.appendChild(div);

        div.querySelector(".remove").addEventListener("click", () => {
    state.cart = state.cart.filter(i => i.name !== item.name);

    storage.set("cart", state.cart);

    renderCart();
    updateCartCount();
});
    });

    const checkoutTotal = document.getElementById("checkout-total");
if (checkoutTotal) {
    checkoutTotal.innerText = total;
}

    totalEl.innerText = total;
}

function changeQty(name, delta) {

    const index = state.cart.findIndex(
        item => item.name === name
    );

    if (index === -1) return;

    if (delta === -1) {

        state.cart.splice(index, 1);

    } else {

        const product = {
            ...state.cart[index]
        };

        state.cart.push(product);
    }

    storage.set("cart", state.cart);

    renderCart();

    updateCartCount();
}
function animateToCart(imageElement) {

    const cart = document.getElementById("cart-count");

    if (!cart || !imageElement) return;

    const imgRect = imageElement.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const flying = document.createElement("img");

    flying.src = imageElement.src;

    flying.className = "flying-product";

    flying.style.left = `${imgRect.left}px`;
    flying.style.top = `${imgRect.top}px`;

    flying.style.width = `${imgRect.width}px`;
    flying.style.height = `${imgRect.height}px`;

    document.body.appendChild(flying);

    requestAnimationFrame(() => {

        flying.style.left = `${cartRect.left}px`;
        flying.style.top = `${cartRect.top}px`;

        flying.style.width = "20px";
        flying.style.height = "20px";

        flying.style.opacity = "0";
    });

    setTimeout(() => {

        flying.remove();

    }, 850);
}
// =============================
// INIT
// =============================

let selectedPayment = "";

document
.querySelectorAll(".payment-card")
.forEach(card => {

    card.addEventListener("click", () => {

        document
        .querySelectorAll(".payment-card")
        .forEach(c => c.classList.remove("active"));

        card.classList.add("active");

        selectedPayment =
        card.dataset.payment;
        
        
    });

});
const loader = document.getElementById("loader");

if (loader) {
    window.addEventListener("load", () => {
    setTimeout(() => {
        loader.classList.add("hide");

        setTimeout(() => {
            loader.remove();
        }, 400);
    }, 800);
});
}

// =============================
// SECCION: Inicializacion de pagina
// Contexto: conecta eventos, renderiza carrito, sede, mapas y secciones del menu.
// =============================
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("checkout.html")) {

        const location = getLocation();
        const cart = storage.get("cart");

        if (!location || !cart || cart.length === 0) {
            alert("No hay pedido activo");
            window.location.href = "index.html";
            return;
        }

    }

    renderToppings();

const map = document.getElementById("map");
const location = localStorage.getItem("location");

if (map) {
    if (location === "mayales") {

    map.src =
        "https://www.google.com/maps?q=Calle+31+%236A-134,+Valledupar,+Cesar,+Colombia&output=embed";

} else if (location === "guatapuri") {

    map.src =
        "https://www.google.com/maps?q=Avenida+Hurtado+Diagonal+10+No.+6N-15,+Valledupar,+Cesar,+Colombia&output=embed";
}
}

   state.cart = storage.get("cart") || [];
renderCart();
    // Bloque: seleccion de sede en home.
    const cards = document.querySelectorAll(".card");

    if (cards.length > 0) {
        cards.forEach(card => {
            card.addEventListener("click", () => {
                const location = card.dataset.location;
                selectLocation(location);
            });
        });
    }

   // =========================
// MENÚ
// =========================
// =========================
// EVENTOS MENÚ (SIN onclick)
// =========================

// BACK
const backBtn = document.querySelector(".back-btn");

if (backBtn) {
    backBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        goBack();
    };
}
// CATEGORÍAS
function toggleDropdown(element) {
    const content = element.nextElementSibling;

    const isOpen = content.style.display === "block";

    // cerrar todos
    document.querySelectorAll(".dropdown-content").forEach(el => {
        el.style.display = "none";
    });

    // abrir el actual
    content.style.display = isOpen ? "none" : "block";
}

function toggleCartExpand() {
    const panel = document.getElementById("cart-expand");
    const trigger = document.querySelector(".cart-left");

    panel.classList.toggle("open");
    trigger.classList.toggle("active");

    renderCart(); // siempre renderiza
}

document.querySelector(".cart-left")?.addEventListener("click", toggleCartExpand);
document.querySelector(".close-cart")?.addEventListener("click", toggleCartExpand);

// BOTÓN PAGAR
document.querySelector(".cart-right button")?.addEventListener("click", goToCheckout);
const categories = document.querySelectorAll(".category");

if (categories.length > 0) {

    const location = getLocation();

    if (!location || !data[location]) {
        console.error("Location inválida:", location);
        return;
    }

    state.location = location;
    state.cart = storage.get("cart") || [];

    const locationNameEl = document.getElementById("location-name");

    if (locationNameEl) {
        locationNameEl.innerText = state.location.toUpperCase();
    }

    categories.forEach(category => {
        const categoryName = category.dataset.category;
        const products = category.querySelector(".products");

        if (!data[location][categoryName]) {
            category.style.display = "none";
            return;
        }

        category.style.display = "";
        renderVisibleProducts(products);
        setupProductScrollHints(category);
    });

    updateCartCount();
}

});

// =============================
// SECCION: Envio de pedido
// Contexto: valida datos del checkout y arma el mensaje final del pedido.
// =============================
function sendOrder() {
    const address =
        document.getElementById("address").value.trim();

    const paymentMethod = selectedPayment;

    // VALIDACIONES

    if (state.cart.length === 0) {

        showAlert("Tu carrito está vacío");
        return;
    }

    if (!address) {

        showAlert("Ingresa una dirección");
        return;
    }

    if (!paymentMethod) {

        showAlert("Selecciona un método de pago");
        return;
    }

    // SEDE

    const location = getLocation();

    let branch = "Principal";

    if (location === "mayales") {

        branch = "Mayales Plaza";
    }

    if (location === "guatapuri") {

        branch = "Guatapurí Plaza";
    }

    // TOTAL

    let total = 0;

    // MENSAJE

    let message = "";

    message += "NUEVO PEDIDO\n\n";

    message += `Sede: ${branch}\n`;

    message += `Dirección: ${address}\n`;

    message += `Método de pago: ${paymentMethod}\n\n`;

    message += "DETALLES DEL PEDIDO\n\n";

    // PRODUCTOS

    state.cart.forEach(item => {

        total += item.price;

        message += `${item.name}\n`;

        if (item.toppings?.length) {

            message += `Extras: ${item.toppings.join(", ")}\n`;
        }

        if (item.salsas?.length) {

            message += `Salsas: ${item.salsas.join(", ")}\n`;
        }

        if (item.refresco) {

            message += `Bebida: ${item.refresco}\n`;
        }

        if (item.batido) {

            message += `Batido: ${item.batido}\n`;
        }

        message += `Precio: $${item.price}\n\n`;
    });

    message += `TOTAL: $${total}\n\n`;

    message += "Gracias por tu pedido";

    // WHATSAPP

    const phone = "573044249465";

    const url =
        `https://wa.me/${3155879918}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    // LIMPIAR

    state.cart = [];

    storage.remove("cart");

    setTimeout(() => {

        location.reload();

    }, 500);
}
// Bloque errores//
function showModal(message, onConfirm) {
    const modal = document.getElementById("custom-modal");
    const text = document.getElementById("modal-text");
    const confirmBtn = document.getElementById("modal-confirm");
    const cancelBtn = document.getElementById("modal-cancel");

    text.innerText = message;

    modal.classList.remove("hidden");

    cancelBtn.style.display = "block"; // 🔥 asegurar que aparece

    const clean = () => {
        modal.classList.add("hidden");
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
    };

    confirmBtn.onclick = () => {
        clean();
        if (onConfirm) onConfirm();
    };

    cancelBtn.onclick = clean;
}
function showAlert(message) {
    const modal = document.getElementById("custom-modal");
    const text = document.getElementById("modal-text");
    const confirmBtn = document.getElementById("modal-confirm");
    const cancelBtn = document.getElementById("modal-cancel");

    text.innerText = message;

    modal.classList.remove("hidden");

    cancelBtn.style.display = "none";

    confirmBtn.onclick = () => {
        modal.classList.add("hidden");
        cancelBtn.style.display = "block"; // 🔥 importante restaurarlo
    };
}
function addCombo(comboName, batido, price) {

    const name = comboName.split("$")[0].trim(); // limpia precio del header

    addToCart(`${name} - ${batido}`, price);
}
const orderLabel =
document.querySelector(".order-label");

if(orderLabel){

    setInterval(() => {

        orderLabel.classList.add("vibrate");

        setTimeout(() => {

            orderLabel.classList.remove("vibrate");

        }, 500);

    }, 2000);

}

const payButton = document.querySelector(".confirm-order-btn");

if (payButton) {
    payButton.addEventListener("click", () => {
        hotdog.classList.remove("launch");
        void hotdog.offsetWidth;
        hotdog.classList.add("launch");
    });
}

const footer =
document.querySelector(".checkout-footer");

const cart =
document.getElementById("cart-items");

if(footer && cart){

    window.addEventListener("scroll", () => {

        const cartTop =
        cart.getBoundingClientRect().top;

        const trigger =
        window.innerHeight * 0.65;

        if(cartTop < trigger){

            footer.classList.add("show");

        }else{

            footer.classList.remove("show");

        }

    });

}


