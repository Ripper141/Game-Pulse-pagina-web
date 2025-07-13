

const contadorCarrito = document.createElement('div');
contadorCarrito.id = 'contador-carrito';


const header = document.querySelector('header');
if (header) {
    header.appendChild(contadorCarrito);
} else {
    console.error('No se encontró el elemento <header>. El contador del carrito no se pudo añadir.');
}


let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


function actualizarContador() {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = `Carrito: ${total}`;
    contadorCarrito.setAttribute('aria-live', 'polite');
    contadorCarrito.setAttribute('tabindex', '0');
}


function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}


function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    actualizarContador();
    alert(`"${producto.nombre}" agregado al carrito`);
}


function eliminarDelCarrito(id) {
    carrito = carrito.filter(prod => prod.id !== id);
    guardarCarrito();
    actualizarContador();
    mostrarCarrito();
}


function cambiarCantidad(id, cantidad) {
    const prod = carrito.find(p => p.id === id);
    if (prod) {
        prod.cantidad = cantidad < 1 ? 1 : cantidad;
        guardarCarrito();
        actualizarContador();
        mostrarCarrito();
    }
}


function mostrarCarrito() {
    let carritoSection = document.querySelector('#carrito-section');
    if (!carritoSection) {
        carritoSection = document.createElement('section');
        carritoSection.id = 'carrito-section';
        carritoSection.setAttribute('aria-modal', 'true');
        carritoSection.setAttribute('role', 'dialog');
        carritoSection.innerHTML = `
            <h2>Tu Carrito</h2>
            <div id="carrito-items"></div>
            <p id="carrito-total"></p>
            <button id="cerrar-carrito" tabindex="0">Cerrar Carrito</button>
        `;
        document.body.appendChild(carritoSection);


        document.getElementById('cerrar-carrito').addEventListener('click', () => {
            carritoSection.style.display = 'none';
        });
    }

    carritoSection.style.display = 'block';
    carritoSection.focus();

    const carritoItems = document.getElementById('carrito-items');
    carritoItems.innerHTML = '';

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p>El carrito está vacío.</p>';
        document.getElementById('carrito-total').textContent = '';
        return;
    }

    carrito.forEach(prod => {
        const item = document.createElement('div');
        item.classList.add('carrito-item');
        item.innerHTML = `
            <h3>${prod.nombre}</h3>
            <p>Precio unitario: $${prod.precio.toLocaleString()}</p>
            <label for="quantity-${prod.id}">Cantidad: </label><input type="number" id="quantity-${prod.id}" min="1" value="${prod.cantidad}" data-id="${prod.id}" aria-label="Cantidad de ${prod.nombre}" tabindex="0"/>
            <p>Subtotal: $${(prod.precio * prod.cantidad).toLocaleString()}</p>
            <button class="btn-eliminar" data-id="${prod.id}" aria-label="Eliminar ${prod.nombre} del carrito" tabindex="0">Eliminar</button>
        `;
        carritoItems.appendChild(item);
    });


    const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    document.getElementById('carrito-total').textContent = `Total: $${total.toLocaleString()}`;

    carritoItems.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const cantidad = parseInt(e.target.value);
            if (isNaN(cantidad) || cantidad < 1) {
                e.target.value = 1;
                return;
            }
            cambiarCantidad(id, cantidad);
        });
    });


    carritoItems.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            eliminarDelCarrito(id);
        });
    });
}

const formContacto = document.querySelector('#contacto form');

formContacto.addEventListener('submit', (e) => {
    const nombre = formContacto.nombre.value.trim();
    const email = formContacto.email.value.trim();
    const mensaje = formContacto.mensaje.value.trim();

    if (!nombre || !email || !mensaje) {
        e.preventDefault();
        alert('Por favor, completa todos los campos.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        e.preventDefault();
        alert('Por favor, ingresa un correo electrónico válido.');
    }
});


async function fetchProducts() {

    const productsData = [
        {
            id: 1,
            nombre: "VE MAD R Major Wireless Mouse",
            precio: 105999,
            img: "./assets/img/mouse.jpg",
            descripcion: "El VXE MAD R Major es un mouse gaming inalámbrico ultraligero.",
            alt: "Mouse Gamer Inalámbrico ultraligero VXE MAD R Major"
        },
        {
            id: 2,
            nombre: "TECLADO GAMER RAZER BLACKWIDOW V3",
            precio: 172000,
            img: "./assets/img/teclado.jpg",
            descripcion: "Teclado retroiluminado con switches rojos.",
            alt: "Teclado Gamer Razer Blackwidow V3 retroiluminado"
        },
        {
            id: 3,
            nombre: "Auriculares gamer inalámbricos HyperX Cloud III Wireless Black/Red",
            precio: 9999,
            img: "./assets/img/Auricular.jpg",
            descripcion: "Auricular con micrófono y sonido envolvente.",
            alt: "Auriculares gamer inalámbricos HyperX Cloud III Black/Red con micrófono y sonido envolvente"
        }
    ];

    const productsContainer = document.querySelector('.cards-container');
    if (!productsContainer) {
        console.error('El elemento .cards-container no se encontró en el DOM. Los productos no se pueden cargar.');
        return;
    }
    productsContainer.innerHTML = '';

    try {

        const products = productsData;

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-id', product.id);
            card.innerHTML = `
                <h3>${product.nombre}</h3>
                <img src="${product.img}" alt="${product.alt}" />
                <p>${product.descripcion}</p>
                <p>Precio $${product.precio.toLocaleString()}</p>
                <button class="add-to-cart-btn" tabindex="0">Añadir al Carrito</button>
            `;
            productsContainer.appendChild(card);

            const btn = card.querySelector('.add-to-cart-btn');
            btn.addEventListener('click', () => {
                agregarAlCarrito(product);
            });
        });

    } catch (error) {
        console.error('Error al obtener productos:', error);
        productsContainer.innerHTML = '<p>Lo sentimos, no pudimos cargar los productos en este momento.</p>';
    }
}



document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    fetchProducts();


    let btnMostrarCarrito = document.getElementById('btn-mostrar-carrito');
    if (!btnMostrarCarrito) {
        btnMostrarCarrito = document.createElement('button');
        btnMostrarCarrito.id = 'btn-mostrar-carrito';
        btnMostrarCarrito.textContent = 'Ver Carrito';
        btnMostrarCarrito.setAttribute('aria-label', 'Ver los productos en tu carrito de compras');
        btnMostrarCarrito.setAttribute('tabindex', '0');
        document.body.appendChild(btnMostrarCarrito);
    }
    btnMostrarCarrito.addEventListener('click', mostrarCarrito);
});