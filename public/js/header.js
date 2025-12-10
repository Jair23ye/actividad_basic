// --- CONFIGURACIÓN Y UTILIDADES GLOBALES ---
const BASE_URL = 'http://localhost:3000/api';

// NUEVO: Obtener el token de autenticación
const AUTH_TOKEN = localStorage.getItem('authToken');

// // 1. COMPROBACIÓN DE TOKEN
if (!AUTH_TOKEN) {
    // Si no hay token, redirigir al login
    alert("Sesión expirada o no iniciada. Por favor, inicia sesión.");
    window.location.href = 'login.html'; // Asegúrate que el nombre del archivo sea correcto
}

// ...

// --- CONFIGURACIÓN Y UTILIDADES GLOBALES ---
let ID_USUARIO_LOGUEADO = null; 
let carritoDePedidoo = [];
let currentView = 'usuarios';
let currentEditingId = null;
let selectedRestaurantId = null; // Usado solo para la vista de Menú
let confirmCallback = null; // Para manejar la acción del modal de confirmación
let allRestaurantes = [];

// Definiciones de esquemas y URLs de los endpoints
const VIEWS_CONFIG = {
    usuarios: {
        title: 'Administración de Usuarios',
        subtitle: 'Gestión completa de los usuarios de Green Bite.',
        url: `${BASE_URL}/usuarios`,
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'apellido', label: 'Apellido', type: 'text', required: false },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'telefono', label: 'Teléfono', type: 'tel', required: false },
            { name: 'tipo', label: 'Tipo', type: 'select', options: ['cliente', 'repartidor', 'admin', 'restaurante_manager'], required: true },
            { name: 'estado', label: 'Estado', type: 'select', options: ['activo', 'inactivo'], required: true },
            // En edición, no se pide la contraseña, solo en creación
            { name: 'password_hash', label: 'Contraseña (Solo Creación)', type: 'password', required: true, onlyCreate: true },
        ],
        tableColumns: ['ID', 'Nombre', 'Email', 'Tipo', 'Estado', 'Fecha'],
        rowMapper: (item) => [item.id, `${item.nombre} ${item.apellido || ''}`, item.email, item.tipo, item.estado, formatShortDate(item.fecha_registro)],
    },
    restaurantes: {
        title: 'Administración de Restaurantes',
        subtitle: 'Gestión de los establecimientos de comida saludable.',
        url: `${BASE_URL}/restaurantes`,
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'direccion', label: 'Dirección', type: 'text', required: true },
            { name: 'telefono', label: 'Teléfono', type: 'tel', required: false },
            { name: 'email', label: 'Email', type: 'email', required: false },
            { name: 'estado', label: 'Estado', type: 'select', options: ['abierto', 'cerrado'], required: true },
        ],
        tableColumns: ['ID', 'Nombre', 'Teléfono', 'Dirección', 'Estado'],
        rowMapper: (item) => [item.id, item.nombre, item.telefono, item.direccion, item.estado],
    },
    menu: {
        title: 'Administración de Menú',
        subtitle: 'Gestión de platos para el restaurante seleccionado.',
        url: `${BASE_URL}/menu`,
        // Campos específicos del menú (se adaptan al restaurante_id seleccionado)
        fields: [
            { name: 'id_restaurante', label: 'Restaurante', type: 'select', required: true, dynamicOptions: true },
            { name: 'nombre', label: 'Nombre del Plato', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'precio', label: 'Precio', type: 'number', required: true, step: '0.01' },
            { name: 'calorias', label: 'Calorías', type: 'number', required: false },
            { name: 'proteinas', label: 'Proteínas (g)', type: 'number', required: false, step: '0.1' },
            { name: 'es_saludable', label: 'Es Saludable', type: 'checkbox', required: false },
            { name: 'disponible', label: 'Disponible', type: 'checkbox', required: false },
        ],
        tableColumns: ['ID', 'Plato', 'Precio', 'Calorías', 'Saludable', 'Disponible'],
        rowMapper: (item) => [item.id, item.nombre, `$${item.precio}`, item.calorias || 'N/A', item.es_saludable ? 'Sí' : 'No', item.disponible ? 'Sí' : 'No'],
    }
};
/**
 * Muestra una notificación temporal.
 * @param {string} message Mensaje a mostrar.
 * @param {string} type Tipo de mensaje ('success', 'error', 'info').
 */
function showMessage(message, type = 'info') {
    const box = document.getElementById('message-box');
    let color;
    if (type === 'success') color = 'bg-green-500';
    else if (type === 'error') color = 'bg-red-500';
    else color = 'bg-blue-500';

    const alert = document.createElement('div');
    alert.className = `${color} text-white px-4 py-3 rounded-lg shadow-xl mb-3 transition transform duration-300 ease-out-in`;
    alert.textContent = message;

    box.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('opacity-0', 'translate-x-full');
        alert.addEventListener('transitionend', () => alert.remove());
    }, 5000);
}

// --- MANEJO DE MODALES PERSONALIZADOS ---

/**
 * Muestra el modal de confirmación.
 * @param {string} message Mensaje de confirmación.
 * @param {Function} callback Función a ejecutar si el usuario confirma.
 */
function showConfirmModal(message, callback) {
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-modal').classList.remove('hidden');
    confirmCallback = callback;
}

function cambiarTexto() {
    const btnchange = document.getElementById('ListaDeBotones');
    btnchange.addEventListener('click', function (evento) {

        const botonclick = evento.target.closest('button');
        const value = botonclick.dataset.view;
        console.log(value)

        if (value === 'restaurantes') {

            let encabezado = document.getElementById("main-title");
            let encabeza = document.getElementById("main-subtitle")
            encabezado.textContent = "Administración de restaurantes";
            encabeza.textContent = "Gestion de restaurantes de Green Bite."
        }
        if (value === 'usuarios') {

            let encabezado = document.getElementById("main-title");
            let encabeza = document.getElementById("main-subtitle")
            encabezado.textContent = "Administración de usuarios";
            encabeza.textContent = "Gestión de usuarios de Green Bite."
        }
        if (value === 'menu') {

            let encabezado = document.getElementById("main-title");
            let encabeza = document.getElementById("main-subtitle")
            encabezado.textContent = "Seleccion de menu";
            encabeza.textContent = "Gestión de menu de Green Bite."
        }
    })

}
/**
 * Oculta el modal de confirmación.
 */
function hideConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
    confirmCallback = null;
}

function formatShortDate(dateValue) {
    if (!dateValue) return 'N/A';

    try {
        const date = new Date(dateValue);
        // Usamos toLocaleDateString para el formato local si lo prefieres,
        // pero para consistencia (YYYY-MM-DD):
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
        const day = String(date.getDate()).padStart(2, '0');

        // Formato AAAA-MM-DD
        return `${year}-${month}-${day}`;

        // Si prefieres formato DD/MM/AAAA usa:
        // return date.toLocaleDateString('es-ES'); 

    } catch (e) {
        console.error("Error al formatear la fecha:", e);
        return 'N/A';
    }
}
// --- MANEJO DE VISTAS Y DATOS (CRUD) ---

/**
 * Carga los datos y renderiza la tabla para la vista actual.
 */
/**
 * Carga los datos y renderiza la tabla para la vista actual.
 */
async function loadData(view) {
    currentView = view;
    const config = VIEWS_CONFIG[view];
    const container = document.getElementById('data-container');

    // Actualizar títulos (usando tu lógica existente)
    document.getElementById('main-title').textContent = config.title;
    document.getElementById('main-subtitle').textContent = config.subtitle;

    // Determinar la URL. Si es 'menu', usamos la URL base sin filtro.
    // Si es otra vista, usamos la URL base de esa vista.
    const url = config.url;

    // **IMPORTANTE**: Limpiamos el contenedor y nos aseguramos de no tener áreas de selector antiguas.
    container.innerHTML = `<p class="text-center text-gray-500 p-8" id="loading-message">Cargando datos de ${view}...</p>`;


    // 🔑 Obtener el token de autenticación
    const AUTH_TOKEN = localStorage.getItem('authToken');

    if (!AUTH_TOKEN) {
        container.innerHTML = `<p class="text-center text-red-500 p-8">Error: No hay sesión activa.</p>`;
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            console.error("Acceso no autorizado o token inválido/expirado.");
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) throw new Error('Error al cargar los datos.');

        const data = await response.json();

        // El contenedor objetivo siempre es 'data-container' ahora
        container.innerHTML = '';
        renderTable(data, config);

    } catch (error) {
        console.error(`Error al obtener datos para ${view}:`, error);
        container.innerHTML = `<p class="text-center text-red-500 p-8">No se pudieron cargar los datos. Asegúrate de que el backend esté ejecutándose.</p>`;
    }
}

/**
 * Renderiza la tabla de datos.
 * @param {Array<Object>} data Datos a mostrar.
 * @param {Object} config Configuración de la vista.
 */
function renderTable(data, config) {
    const targetContainer = document.getElementById('data-container');
    if (!targetContainer) return;

    if (data.length === 0) {
        targetContainer.innerHTML = `<p class="text-center text-gray-500 p-8">No hay registros de ${currentView} disponibles.</p>`;
        return;
    }

    const tableHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    ${config.tableColumns.map(col => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${col}</th>`).join('')}
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${data.map(item => {
        const itemJsonSafe = JSON.stringify(item).replace(/"/g, '&quot;');

        // --- DETERMINAR QUÉ BOTONES MOSTRAR ---
        let accionesBotones = "";

        if (currentView === 'menu') {
            // Vista de menú: Solo botón Agregar
            accionesBotones = `
                            <button 
                                onclick="agregarAlCarritoDirecto(${item.id}, '${item.nombre.replace(/'/g, "\\'")}', ${item.precio})" 
                                class="text-sm bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded transition duration-150">
                                Agregar
                            </button>
                        `;
        } else {
            // Otras vistas (usuarios, restaurantes): Editar y Eliminar
            accionesBotones = `
                            <button onclick="openModal(${item.id}, '${itemJsonSafe}')" class="text-green-bite hover:text-green-dark">Editar</button>
                            <button onclick="triggerDelete(${item.id})" class="text-red-600 hover:text-red-800">Eliminar</button>
                        `;
        }

        return `
                        <tr class="hover:bg-green-50 transition duration-150">
                            ${config.rowMapper(item).map(val => `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${val}</td>`).join('')}
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                ${accionesBotones}
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;

    targetContainer.innerHTML = tableHTML;
}
/**
 * Abre el modal de creación/edición.
 * @param {number|null} id ID del ítem a editar o null si es nuevo.
 * @param {Object|null} item Datos del ítem si se está editando.
 */
function openModal(id = null, item = null, estado = null) {
    currentEditingId = id;
    const config = VIEWS_CONFIG[currentView];
    const modal = document.getElementById('crud-modal');
    const form = document.getElementById('crud-form');

    document.getElementById('modal-title').textContent = id ? `Editar ${config.title.split(' ')[2]}` : `Crear Nuevo ${config.title.split(' ')[2]}`;

    let formHTML = '';

    // Si estamos en el menú, añadimos el campo oculto del restaurante
    if (currentView === 'menu') {
        formHTML += `<input type="hidden" name="restaurante_id" value="${selectedRestaurantId}">`;
    }

    config.fields.forEach(field => {
        // Omitir campos que solo son para creación si estamos editando
        if (id && field.onlyCreate) return;

        // Deserializar item JSON si viene de `onclick`
        const itemData = typeof item === 'string' ? JSON.parse(item.replace(/&quot;/g, '"')) : item;
        const currentValue = itemData && itemData[field.name] !== undefined ? itemData[field.name] : '';

        formHTML += `
                    <div class="mb-4">
                        <label for="${field.name}" class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                `;

        if (field.type === 'select') {
            formHTML += `
                        <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-bite focus:border-green-bite">
                            ${field.options.map(option => `
                                <option value="${option}" ${currentValue === option ? 'selected' : ''}>${option.charAt(0).toUpperCase() + option.slice(1)}</option>
                            `).join('')}
                        </select>
                    `;
        } else if (field.type === 'textarea') {
            formHTML += `
                        <textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} rows="3" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-bite focus:border-green-bite">${currentValue}</textarea>
                    `;
        } else if (field.type === 'checkbox') {
            // Checkbox necesita un tratamiento especial para el valor booleano
            // En edición, el valor viene como 0 o 1 de la DB. En creación, usar valor por defecto.
            const isChecked = id ? (itemData[field.name] == 1 || itemData[field.name] === true) : (field.name === 'es_saludable' || field.name === 'disponible');
            formHTML += `
                        <div class="flex items-center mt-2">
                            <input type="checkbox" id="${field.name}" name="${field.name}" ${isChecked ? 'checked' : ''} class="h-4 w-4 text-green-bite border-gray-300 rounded">
                            <span class="ml-2 text-sm text-gray-600">${field.label}</span>
                        </div>
                    `;
        } else {
            formHTML += `
                        <input type="${field.type}" id="${field.name}" name="${field.name}" value="${currentValue}" ${field.required ? 'required' : ''} ${field.step ? `step="${field.step}"` : ''} class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-bite focus:border-green-bite">
                    `;
        }

        formHTML += `</div>`;
    });

    form.innerHTML = formHTML;
    modal.classList.remove('hidden');
}

/**
 * Maneja el envío del formulario (Creación o Edición).
 * @param {Event} e Evento de envío del formulario.
 */
async function handleSubmit(e) {
    e.preventDefault();

    const config = VIEWS_CONFIG[currentView];
    const form = document.getElementById('crud-form');
    const data = {};

    const AUTH_TOKEN = localStorage.getItem('authToken');

    if (!AUTH_TOKEN) {
        showMessage('Sesión no activa. Redirigiendo al login.', 'error');
        // Asumiendo que 'login.html' es tu página de inicio de sesión
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    // Recolectar datos del formulario
    config.fields.forEach(field => {
        const input = form.elements[field.name];
        if (!input) return;

        if (field.type === 'checkbox') {
            data[field.name] = input.checked ? 1 : 0;
        } else if (field.type === 'number') {
            if (input.value) data[field.name] = parseFloat(input.value);
        } else if (field.type === 'password' && currentEditingId) {
            if (!input.value) return;
            data[field.name] = input.value;
        } else {
            data[field.name] = input.value;
        }
    });

    // ... (Lógica de valores por defecto para Menú) ...

    if (!currentEditingId) {
        if (currentView === 'menu' && data.es_saludable === undefined) data.es_saludable = 1;
        if (currentView === 'menu' && data.disponible === undefined) data.disponible = 1;
        if (currentView === 'menu' && !data.restaurante_id) data.restaurante_id = selectedRestaurantId;
    }

    // Determinar método y URL
    let method, url;
    if (currentEditingId) {
        method = 'PUT';
        url = `${config.url}/${currentEditingId}`;
    } else {
        method = 'POST';
        url = config.url;
    }

    // Paso 2: Crear el objeto de headers con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}` // ¡Añadir el token aquí!
    };

    try {

        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(data),
        });

        if (response.status === 401 || response.status === 403) {
            showMessage('Sesión no autorizada o expirada. Por favor, vuelve a iniciar sesión.', 'error');
            localStorage.removeItem('authToken');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error en la operación de ${method}`);
        }

        document.getElementById('crud-modal').classList.add('hidden');
        showMessage(`Registro ${currentEditingId ? 'actualizado' : 'creado'} con éxito.`, 'success');
        loadData(currentView); // Recargar datos

    } catch (error) {
        console.error("Error al guardar:", error);
        showMessage(`Fallo al guardar: ${error.message || 'Verifica la consola para más detalles.'}`, 'error');
    }
}

function mostrarVentanaResumen() {
    const modalResumen = document.getElementById('resumen-modal');
    const listaResumen = document.getElementById('carrito-lista-resumen');
    const totalPago = document.getElementById('carrito-total-pago');

    listaResumen.innerHTML = ""; // Limpiar antes de llenar
    let total = 0;

    if (carritoDePedidoo.length === 0) {
        listaResumen.innerHTML = "<p class='text-gray-500 text-center py-4'>Tu carrito está vacío.</p>";
    } else {
        carritoDePedidoo.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const row = document.createElement('div');
            row.className = "flex justify-between items-center py-2";
            row.innerHTML = `
                <div>
                    <p class="font-semibold text-gray-800">${item.nombre}</p>
                    <p class="text-xs text-gray-500">$${item.precio.toFixed(2)} x ${item.cantidad}</p>
                </div>
                <div class="text-right font-bold text-green-dark">
                    $${subtotal.toFixed(2)}
                </div>
            `;
            listaResumen.appendChild(row);
        });
    }

    totalPago.textContent = `$${total.toFixed(2)}`;
    modalResumen.classList.remove('hidden'); // Mostrar la ventana
}


function agregarAlCarritoDirecto(id, nombre, precio) {
    const itemIndex = carritoDePedidoo.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        carritoDePedidoo[itemIndex].cantidad += 1;
    } else {
        carritoDePedidoo.push({ id, nombre, precio: parseFloat(precio), cantidad: 1 });
    }

    // ACTUALIZACIÓN: Abrir el modal de resumen automáticamente al agregar
    mostrarVentanaResumen();
}



/**
 * Lanza el modal de confirmación antes de intentar eliminar.
 * @param {number} id ID del ítem a eliminar.
 */
function triggerDelete(id) {
    showConfirmModal('¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.', () => {
        // Función de callback que ejecuta la eliminación real
        deleteItem(id);
    });
}


/**
 * Elimina un ítem (función real después de la confirmación).
 * @param {number} id ID del ítem a eliminar.
 */
async function deleteItem(id) {
    // Ocultar modal de confirmación antes de la operación
    hideConfirmModal();

    const config = VIEWS_CONFIG[currentView];
    const url = `${config.url}/${id}`;

    // 🔑 Paso 1: Obtener el token de autenticación
    const AUTH_TOKEN = localStorage.getItem('authToken');

    // ⚠️ Validación de Token (opcional, ya se valida al inicio del script)
    if (!AUTH_TOKEN) {
        showMessage('Sesión no activa. Redirigiendo al login.', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    try {
        // 🔑 Paso 2: Incluir el token en los headers de la solicitud DELETE
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // La clave: añadir el token Bearer
                'Authorization': `Bearer ${AUTH_TOKEN}`
            },
        });

        // ⚠️ Manejo de error de autorización (401 o 403)
        if (response.status === 401 || response.status === 403) {
            showMessage('Sesión no autorizada o expirada. Por favor, vuelve a iniciar sesión.', 'error');
            localStorage.removeItem('authToken'); // Limpiar token inválido
            setTimeout(() => window.location.href = 'login.html', 1500);
            return; // Detener la ejecución
        }

        if (!response.ok) {
            // Si la respuesta no es 2xx, intentamos obtener el mensaje de error del backend
            const errorData = await response.json();
            throw new Error(errorData.message || `Error al eliminar.`);
        }

        showMessage('Registro eliminado con éxito.', 'success');
        loadData(currentView); // Recargar datos

    } catch (error) {
        console.error("Error al eliminar:", error);
        showMessage(`Fallo al eliminar: ${error.message || 'Verifica la consola.'}`, 'error');
    }
}

// --- INICIALIZACIÓN Y LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la primera vista
    loadData(currentView);

    // Listeners para los botones de navegación
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const newView = e.currentTarget.getAttribute('data-view');
            if (newView !== currentView) {
                // Limpiar el estado del menú si cambiamos de vista
                if (currentView === 'menu' && newView !== 'menu') {
                    selectedRestaurantId = null;
                }

                loadData(newView);

                // Actualizar la clase 'active-link'
                document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active-link'));
                e.currentTarget.classList.add('active-link');
            }
        });
    });

    // Listener para el botón de 'Crear Nuevo'
    document.getElementById('add-button').addEventListener('click', () => {
        openModal(null, null);
    });

    // Listeners para el modal CRUD
    document.getElementById('cancel-modal').addEventListener('click', () => {
        document.getElementById('crud-modal').classList.add('hidden');
    });
    document.getElementById('submit-modal').addEventListener('click', handleSubmit);

    // Listener para el botón de toggle en móvil
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('-translate-x-full');
    });

    // Cerrar modal CRUD al hacer clic en el overlay
    document.getElementById('crud-modal').addEventListener('click', (e) => {
        if (e.target.id === 'crud-modal') {
            document.getElementById('crud-modal').classList.add('hidden');
        }
    });

    // Listeners para el NUEVO modal de Confirmación
    document.getElementById('confirm-cancel').addEventListener('click', hideConfirmModal);

    document.getElementById('confirm-action').addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback(); // Ejecutar la función de eliminación
        }
        // hideConfirmModal se llama dentro de deleteItem, pero por si acaso:
        // hideConfirmModal(); 
    });

    // Cerrar modal de confirmación al hacer clic en el overlay
    document.getElementById('confirm-modal').addEventListener('click', (e) => {
        if (e.target.id === 'confirm-modal') {
            hideConfirmModal();
        }
    });

    // Hacer la función triggerDelete globalmente accesible para el onclick de la tabla
    window.triggerDelete = triggerDelete;
    window.openModal = openModal; // Asegurar que openModal también sea global


    const btnCerrarSafe = document.getElementById('cerrar-resumen');
    if (btnCerrarSafe) {
        btnCerrarSafe.addEventListener('click', () => {
            const m = document.getElementById('resumen-modal');
            if (m) m.classList.add('hidden');
        });
    }

    const storedUserId = localStorage.getItem('user_id');

    if (storedUserId) {
        ID_USUARIO_LOGUEADO = parseInt(storedUserId);
    } else {
        // Si no hay usuario logueado, podríamos usar un valor por defecto para pruebas
        ID_USUARIO_LOGUEADO = 1;
    }



});

// =======================================================
// === NUEVAS VARIABLES GLOBALES PARA EL CARRITO ===
// =======================================================

// Array para almacenar los productos seleccionados para el pedido
let carritoDePedido = [];

// SIMULACIÓN DE DATOS DEL MENÚ (Normalmente, esto vendría de tu API)
const MENU_ITEMS_SIMULADOS = [
    { id: 101, nombre: "Ensalada César con Pollo", descripcion: "Lechuga fresca, crutones y aderezo.", precio: 8.50 },
    { id: 102, nombre: "Smoothie de Bayas Detox", descripcion: "Fresa, arándano, espinaca y jengibre.", precio: 5.00 },
    { id: 103, nombre: "Wrap Vegano de Falafel", descripcion: "Falafel, humus y vegetales en tortilla.", precio: 7.25 },
    { id: 104, nombre: "Sopa del Día", descripcion: "Crema de vegetales de temporada.", precio: 4.50 },
    { id: 105, nombre: "Tostada de Aguacate", descripcion: "Pan artesanal con aguacate y huevo.", precio: 6.00 },
];

// --- REFERENCIAS DEL DOM DEL MODAL DE MENÚ (Asumiendo que lo agregaste al HTML) ---
const menuModal = document.getElementById('menu-modal');
const abrirMenuModalBtn = document.getElementById('abrir-menu-modal');
const cerrarMenuModalBtn = document.getElementById('cerrar-menu-modal');
const listaProductosModal = document.getElementById('productos-lista');
const agregarACarritoBtn = document.getElementById('agregar-a-carrito-btn');
const itemsSeleccionadosCount = document.getElementById('items-seleccionados-count');

// =======================================================
// === MANEJO DEL MODAL DE SELECCIÓN DE PRODUCTOS ===
// =======================================================

/**
 * Genera la lista de productos dentro del modal para su selección.
 */
function cargarMenuEnModal() {
    listaProductosModal.innerHTML = ''; // Limpiar lista
    let itemsSeleccionados = 0;

    MENU_ITEMS_SIMULADOS.forEach(item => {
        // Buscar si el ítem ya está en el carrito para pre-cargar la cantidad
        const itemExistente = carritoDePedido.find(cartItem => cartItem.id === item.id);
        const cantidadActual = itemExistente ? itemExistente.cantidad : 0;

        // Si ya está en el carrito, debe contarse en el total inicial
        itemsSeleccionados += cantidadActual;

        // Card del producto usando Tailwind
        const itemCard = document.createElement('div');
        itemCard.className = 'flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150';
        itemCard.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-gray-800 text-lg">${item.nombre}</h4>
                <span class="text-green-dark font-extrabold text-xl">$${item.precio.toFixed(2)}</span>
            </div>
            <p class="text-sm text-gray-500 mb-4">${item.descripcion}</p>
            
            <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                <label for="cantidad-${item.id}" class="text-gray-700">Cantidad:</label>
                <input
                    type="number"
                    id="cantidad-${item.id}"
                    data-id="${item.id}"
                    data-nombre="${item.nombre}"
                    data-precio="${item.precio}"
                    value="${cantidadActual}"
                    min="0"
                    class="cantidad-input w-20 p-1 border border-gray-300 rounded-lg text-center focus:ring-green-bite focus:border-green-bite"
                    onchange="actualizarContadorItems()"
                />
            </div>
        `;
        listaProductosModal.appendChild(itemCard);
    });

    // Inicializar el contador visual
    itemsSeleccionadosCount.textContent = itemsSeleccionados;
}

/**
 * Actualiza el contador de items totales seleccionados en el modal.
 */
function actualizarContadorItems() {
    const inputs = listaProductosModal.querySelectorAll('.cantidad-input');
    let totalItems = 0;

    inputs.forEach(input => {
        const cantidad = parseInt(input.value) || 0;
        totalItems += cantidad;
    });

    itemsSeleccionadosCount.textContent = totalItems;
}


// =======================================================
// === LÓGICA DE AGREGAR AL CARRITO ===
// =======================================================

/**
 * Procesa los inputs del modal y actualiza el array del carrito.
 */
agregarACarritoBtn.addEventListener('click', () => {
    const inputs = listaProductosModal.querySelectorAll('.cantidad-input');

    // Limpiamos el carrito antes de llenarlo con las nuevas selecciones del modal
    carritoDePedido = [];
    let totalItemsAgregados = 0;

    inputs.forEach(input => {
        const id = parseInt(input.getAttribute('data-id'));
        const nombre = input.getAttribute('data-nombre');
        const precio = parseFloat(input.getAttribute('data-precio'));
        const cantidad = parseInt(input.value) || 0;

        if (cantidad > 0) {
            carritoDePedido.push({ id, nombre, precio, cantidad });
            totalItemsAgregados += cantidad;
        }
    });

    // Cierra el modal y muestra un mensaje
    menuModal.classList.add('hidden');
    showMessage(`Se agregaron ${totalItemsAgregados} items al carrito.`, 'success');

    // Opcional: Mostrar el contenido del carrito en consola
    console.log("Contenido del Carrito:", carritoDePedido);
    console.log("Total a Pagar:", carritoDePedido.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2));

    // Si tu aplicación tuviera una vista de Carrito, aquí la actualizarías
    // actualizarVisualizacionCarritoDOM(); 
});

// Variable Global (Define o carga este valor real desde tu sesión) // <--- Carga el ID real de la sesión o del formulario

/**
 * Envía el array de carrito temporal al backend para guardar el pedido.
 */
async function finalizarPedido() {
    // ⚠️ Uso de doble 'o'
    if (carritoDePedidoo.length === 0) {
        showMessage('El carrito está vacío. Agrega productos antes de finalizar.', 'error');
        return;
    }

    const AUTH_TOKEN = localStorage.getItem('authToken');

    try {
        document.getElementById('resumen-modal').classList.add('hidden');

        // Datos a enviar: Ítems y el ID del usuario que está creando el pedido.
        const payload = {
            items: carritoDePedidoo,
            id_usuario: ID_USUARIO_LOGUEADO // Aquí se pasa el ID para el encabezado
        };

        const response = await fetch(`${BASE_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al guardar el pedido.');
        }

        // Éxito: Limpiar carrito y avisar.
        const resultado = await response.json();

        // ⚠️ Uso de doble 'o'
        carritoDePedidoo = [];

        showMessage(`¡Carrito #${resultado.id_carrito} registrado con éxito en la BD!`, 'success');

    } catch (error) {
        console.error('Error al finalizar pedido:', error);
        showMessage(`Fallo al finalizar pedido: ${error.message}`, 'error');
    }
}



// =======================================================
// === INTEGRACIÓN CON LA NAVEGACIÓN Y LISTENERS ===
// =======================================================

// --- MANEJO DE MODAL (Abrir/Cerrar) ---

// Abrir Modal
if (abrirMenuModalBtn) {
    abrirMenuModalBtn.addEventListener('click', () => {
        cargarMenuEnModal(); // Cargar la lista antes de mostrar
        menuModal.classList.remove('hidden');
    });
}

// Cerrar Modal (Botón 'X')
if (cerrarMenuModalBtn) {
    cerrarMenuModalBtn.addEventListener('click', () => {
        menuModal.classList.add('hidden');
    });
}

// Cerrar al hacer clic fuera
if (menuModal) {
    menuModal.addEventListener('click', (e) => {
        if (e.target === menuModal) {
            menuModal.classList.add('hidden');
        }
    });
}

// Asegurar que el botón "Agregar Productos" solo sea visible en la vista de "Menu"
const dataContainer = document.getElementById('data-container');
if (dataContainer) {
    // Escuchar el DOM para detectar si la vista de menú está activa
    new MutationObserver(() => {
        // Adaptar el texto del botón de CRUD a la vista actual
        const addButton = document.getElementById('add-button');
        const abrirMenuButton = document.getElementById('abrir-menu-modal');

        if (currentView === 'menu') {
            if (addButton) addButton.classList.add('hidden');
            if (abrirMenuButton) abrirMenuButton.classList.remove('hidden');

            // Opcional: Esconder el botón de "Agregar Productos" si no hay restaurante seleccionado
            if (abrirMenuButton && !selectedRestaurantId) {
                abrirMenuButton.classList.add('hidden');
            }

        } else {
            if (addButton) addButton.classList.remove('hidden');
            if (abrirMenuButton) abrirMenuButton.classList.add('hidden');
        }
    }).observe(dataContainer, { childList: true, subtree: true, attributes: true });
}


