// const BASE_URL = 'http://localhost:3000/api';
// const AUTH_KEY = 'authToken';

// // --- Global State Variables ---
// let currentView = 'usuarios';
// let currentEditingId = null;
// let selectedRestaurantId = null;
// let confirmCallback = null;
// let allRestaurantes = []; // Para poblar el selector de menú

// // Definiciones de esquemas y URLs de los endpoints
// const VIEWS_CONFIG = {
//     usuarios: {
//         title: 'Administración de Usuarios',
//         subtitle: 'Gestión completa de los usuarios de Green Bite.',
//         url: `${BASE_URL}/usuarios`,
//         fields: [
//             { name: 'nombre', label: 'Nombre', type: 'text', required: true },
//             { name: 'apellido', label: 'Apellido', type: 'text', required: false },
//             { name: 'email', label: 'Email', type: 'email', required: true },
//             { name: 'telefono', label: 'Teléfono', type: 'tel', required: false },
//             { name: 'tipo', label: 'Tipo', type: 'select', options: ['cliente', 'repartidor', 'admin', 'restaurante_manager'], required: true },
//             { name: 'estado', label: 'Estado', type: 'select', options: ['activo', 'inactivo'], required: true },
//             { name: 'password_hash', label: 'Contraseña (Solo Creación)', type: 'password', required: true, onlyCreate: true },
//         ],
//         tableColumns: ['ID', 'Nombre', 'Email', 'Tipo', 'Estado', 'Fecha'],
//         rowMapper: (item) => [item.id, `${item.nombre} ${item.apellido || ''}`, item.email, item.tipo, item.estado, formatShortDate(item.fecha_registro)],
//     },
//     restaurantes: {
//         title: 'Administración de Restaurantes',
//         subtitle: 'Gestión de los establecimientos de comida saludable.',
//         url: `${BASE_URL}/restaurantes`,
//         fields: [
//             { name: 'nombre', label: 'Nombre', type: 'text', required: true },
//             { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
//             { name: 'direccion', label: 'Dirección', type: 'text', required: true },
//             { name: 'telefono', label: 'Teléfono', type: 'tel', required: false },
//             { name: 'email', label: 'Email', type: 'email', required: false },
//             { name: 'estado', label: 'Estado', type: 'select', options: ['abierto', 'cerrado'], required: true },
//         ],
//         tableColumns: ['ID', 'Nombre', 'Teléfono', 'Dirección', 'Estado'],
//         rowMapper: (item) => [item.id, item.nombre, item.telefono, item.direccion, item.estado],
//     },
//     menu: {
//         title: 'Administración de Menú',
//         subtitle: 'Gestión de platos para el restaurante seleccionado.',
//         url: `${BASE_URL}/menu`,
//         fields: [
//             { name: 'id_restaurante', label: 'Restaurante', type: 'select', required: true, dynamicOptions: true },
//             { name: 'nombre', label: 'Nombre del Plato', type: 'text', required: true },
//             { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
//             { name: 'precio', label: 'Precio', type: 'number', required: true, step: '0.01' },
//             { name: 'calorias', label: 'Calorías', type: 'number', required: false },
//             { name: 'proteinas', label: 'Proteínas (g)', type: 'number', required: false, step: '0.1' },
//             { name: 'es_saludable', label: 'Es Saludable', type: 'checkbox', required: false },
//             { name: 'disponible', label: 'Disponible', type: 'checkbox', required: false },
//         ],
//         tableColumns: ['ID', 'Plato', 'Precio', 'Calorías', 'Saludable', 'Disponible'],
//         rowMapper: (item) => [item.id, item.nombre, `$${item.precio}`, item.calorias || 'N/A', item.es_saludable ? 'Sí' : 'No', item.disponible ? 'Sí' : 'No'],
//     }
// };

// // --- Funciones de Utilidad ---

// function formatShortDate(dateValue) {
//     if (!dateValue) return 'N/A';
//     try {
//         const date = new Date(dateValue);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     } catch (e) {
//         return 'N/A';
//     }
// }

// function showMessage(message, type = 'info') {
//     const box = document.getElementById('message-box');
//     let color;
//     if (type === 'success') color = 'bg-green-500';
//     else if (type === 'error') color = 'bg-red-500';
//     else color = 'bg-blue-500';

//     const alert = document.createElement('div');
//     alert.className = `${color} text-white px-4 py-3 rounded-lg shadow-xl mb-3 transition transform duration-300 ease-out-in`;
//     alert.textContent = message;

//     box.appendChild(alert);

//     setTimeout(() => {
//         alert.classList.add('opacity-0', 'translate-x-full');
//         alert.addEventListener('transitionend', () => alert.remove());
//     }, 5000);
// }

// // --- Funciones de Modales ---

// function hideCrudModal() {
//     document.getElementById('crud-modal').classList.add('hidden');
// }

// function showConfirmModal(message, callback) {
//     document.getElementById('confirm-message').textContent = message;
//     document.getElementById('confirm-modal').classList.remove('hidden');
//     confirmCallback = callback;
// }

// function hideConfirmModal() {
//     document.getElementById('confirm-modal').classList.add('hidden');
//     confirmCallback = null;
// }

// window.handleConfirmAction = function() {
//     hideConfirmModal();
//     if (confirmCallback) {
//         confirmCallback();
//     }
// };

// // --- Funciones de Autenticación y Vistas ---

// /**
//  * Muestra el Login con transición (y funciona como Logout)
//  */
// function showLogin() {
//     const loginView = document.getElementById('login-view');
//     const adminView = document.getElementById('admin-view');
//     const appContainer = document.getElementById('app-container');

//     localStorage.removeItem(AUTH_KEY);
//     const loginForm = document.getElementById('login-form');
//     if (loginForm) loginForm.reset();
//     const errorMessage = document.getElementById('error-message');
//     if (errorMessage) errorMessage.classList.add('hidden');

//     adminView.classList.replace('scale-100', 'scale-90');
//     adminView.classList.replace('opacity-100', 'opacity-0');

//     setTimeout(() => {
//         adminView.classList.add('hidden');
//         loginView.classList.remove('hidden');

//         appContainer.classList.remove('items-start', 'min-h-full', 'p-0');
//         appContainer.classList.add('justify-center', 'items-center', 'min-h-screen', 'p-4');

//         loginView.classList.replace('scale-90', 'scale-100');
//         loginView.classList.replace('opacity-0', 'opacity-100');
//     }, 300);
// }
// window.handleLogout = showLogin; 

// /**
//  * Muestra la Vista de Administración con transición
//  */
// function showAdminView() {
//     const loginView = document.getElementById('login-view');
//     const adminView = document.getElementById('admin-view');
//     const appContainer = document.getElementById('app-container');

//     loginView.classList.replace('scale-100', 'scale-90');
//     loginView.classList.replace('opacity-100', 'opacity-0');

//     setTimeout(() => {
//         loginView.classList.add('hidden');
//         adminView.classList.remove('hidden');

//         appContainer.classList.remove('justify-center', 'items-center', 'min-h-screen', 'p-4');
//         appContainer.classList.add('items-start', 'min-h-full', 'p-0');

//         adminView.classList.replace('opacity-0', 'opacity-100');
//         adminView.classList.replace('scale-0', 'scale-100');

//         loadData('usuarios'); 
//     }, 300);
// }


// /**
//  * Manejador del envío del formulario de login.
//  */
// window.handleLogin = async function(event) {
//     event.preventDefault();

//     const loginButton = document.getElementById('login-button');
//     const errorMessage = document.getElementById('error-message');
//     const errorText = document.getElementById('error-text');
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     const LOGIN_URL = `${BASE_URL}/auth/login`; // RUTA CORREGIDA

//     errorMessage.classList.add('hidden');
//     loginButton.disabled = true;
//     loginButton.innerHTML = 'Verificando...';

//     try {
//         const response = await fetch(LOGIN_URL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             localStorage.setItem(AUTH_KEY, data.token || 'true');
//             window.AUTH_TOKEN = data.token; 
//             showAdminView(); 
//         } else {
//             errorText.textContent = data.message || 'Credenciales incorrectas o error del servidor.';
//             errorMessage.classList.remove('hidden');
//         }

//     } catch (error) {
//         console.error("Error de autenticación:", error);
//         errorText.textContent = 'Error de conexión con el servidor. Verifica que Express esté funcionando.';
//         errorMessage.classList.remove('hidden');

//     } finally {
//         loginButton.disabled = false;
//         loginButton.textContent = 'Ingresar a Administración';
//     }
// };

// /**
//  * Realiza una petición GET/POST/PUT/DELETE autenticada.
//  */
// async function authenticatedFetch(url, method = 'GET', data = null) {
//     const token = localStorage.getItem(AUTH_KEY);
//     if (!token) {
//         showLogin();
//         throw new Error("Token de autenticación faltante.");
//     }

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//     };

//     const options = {
//         method: method,
//         headers: headers,
//         body: data ? JSON.stringify(data) : null
//     };

//     const response = await fetch(url, options);

//     if (response.status === 401 || response.status === 403) {
//         showMessage('Sesión expirada o no autorizada.', 'error');
//         showLogin();
//         return null;
//     }

//     if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
//         throw new Error(errorData.message || `Error en la petición: ${response.status}`);
//     }

//     return response;
// }


// // --- Funciones de Lógica de Administración (CRUD) ---

// window.loadData = async function(view) {
//     const container = document.getElementById('data-container');
//     currentView = view;
//     const config = VIEWS_CONFIG[view];

//     document.getElementById('main-title').textContent = config.title;
//     document.getElementById('main-subtitle').textContent = config.subtitle;

//     const addButton = document.getElementById('add-button');
//     if (view === 'menu' && !selectedRestaurantId) {
//         addButton.classList.add('hidden');
//     } else {
//          addButton.classList.remove('hidden');
//     }

//     container.innerHTML = '<p class="text-center text-green-dark">Cargando datos...</p>';

//     if (view === 'menu') {
//         await loadRestaurantSelector();
//         if (!selectedRestaurantId) {
//             container.innerHTML = '<p class="text-center text-gray-500 p-8">Por favor, selecciona un restaurante para gestionar su menú.</p>';
//             return;
//         }
//     }

//     const url = view === 'menu'
//         ? `${config.url}/restaurante/${selectedRestaurantId}`
//         : config.url;

//     try {
//         const response = await authenticatedFetch(url, 'GET');
//         if (!response) return; 

//         const data = await response.json();
//         renderTable(data, config);

//     } catch (error) {
//         console.error(`Error al obtener datos para ${view}:`, error);
//         container.innerHTML = `<p class="text-center text-red-500 p-8">No se pudieron cargar los datos. Error: ${error.message}</p>`;
//     }
// };

// /**
//  * Renderiza el selector de restaurantes (solo para la vista de menú).
//  */
// async function loadRestaurantSelector() {
//     let selectorContainer = document.getElementById('restaurant-selector-area');
//     if (!selectorContainer) {
//         selectorContainer = document.createElement('div');
//         selectorContainer.id = 'restaurant-selector-area';
//         const dataContainer = document.getElementById('data-container');
//         if (dataContainer) {
//             dataContainer.prepend(selectorContainer);
//         } else {
//             return;
//         }
//     }

//     selectorContainer.innerHTML = '<p class="text-center text-green-dark">Cargando lista de restaurantes...</p>';

//     try {
//         const response = await authenticatedFetch(VIEWS_CONFIG.restaurantes.url, 'GET');
//         if (!response) return;

//         const restaurantes = await response.json();

//         allRestaurantes = restaurantes; // GUARDAR LA LISTA GLOBALMENTE

//         if (restaurantes.length === 0) {
//             selectedRestaurantId = null;
//             document.getElementById('add-button').classList.add('hidden'); 
//             selectorContainer.innerHTML = '<p class="text-center text-red-500 p-4">No hay restaurantes registrados. Crea uno primero para gestionar el menú.</p>';
//             document.getElementById('menu-table-area').innerHTML = '';
//             return;
//         }

//         if (!selectedRestaurantId) {
//             selectedRestaurantId = restaurantes[0].id; // Seleccionar el primero por defecto
//         }

//         const currentRestaurantName = restaurantes.find(r => r.id == selectedRestaurantId)?.nombre || '';

//         const selectorHTML = `
//             <div class="mb-6 p-4 bg-green-50 rounded-lg border border-green-bite/20 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
//                 <label for="restaurant-select" class="font-semibold text-gray-700 w-full md:w-auto whitespace-nowrap">Selecciona Restaurante:</label>
//                 <select id="restaurant-select" class="p-2 border border-gray-300 rounded-lg focus:ring-green-bite focus:border-green-bite w-full md:flex-grow">
//                     ${restaurantes.map(r =>
//                         `<option value="${r.id}" ${r.id == selectedRestaurantId ? 'selected' : ''}>${r.nombre} (ID: ${r.id})</option>`
//                     ).join('')}
//                 </select>
//                 <h3 class="font-bold text-lg text-green-dark mt-4 md:mt-0 whitespace-nowrap">${currentRestaurantName}</h3>
//             </div>
//         `;
//         selectorContainer.innerHTML = selectorHTML;

//         const selectElement = document.getElementById('restaurant-select');
//         selectElement.removeEventListener('change', handleRestaurantSelectChange);
//         selectElement.addEventListener('change', handleRestaurantSelectChange);

//     } catch (error) {
//         console.error("Error cargando selector de restaurantes:", error);
//         selectorContainer.innerHTML = `<p class="text-center text-red-500 p-8">Error al cargar la lista de restaurantes.</p>`;
//     }
// }

// /**
//  * Handler para el cambio en el selector de restaurantes.
//  */
// function handleRestaurantSelectChange(e) {
//     selectedRestaurantId = e.target.value || null;
//     loadData('menu'); // Recargar la vista de menú
// }


// /**
//  * Renderiza la tabla de datos.
//  */
// function renderTable(data, config) {
//     const targetContainer = currentView === 'menu'
//         ? document.getElementById('menu-table-area')
//         : document.getElementById('data-container');

//     if (!targetContainer) return;

//     if (data.length === 0) {
//         targetContainer.innerHTML = `<p class="text-center text-gray-500 p-8">No hay registros de ${currentView} disponibles.</p>`;
//         return;
//     }

//     const tableHTML = `
//         <table class="min-w-full divide-y divide-gray-200">
//             <thead class="bg-gray-50">
//                 <tr>
//                     ${config.tableColumns.map(col => `<th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">${col}</th>`).join('')}
//                     <th class="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Acciones</th>
//                 </tr>
//             </thead>
//             <tbody class="bg-white divide-y divide-gray-200">
//                 ${data.map(item => {
//                     const itemJsonSafe = JSON.stringify(item).replace(/"/g, '&quot;');

//                     let menuButton = '';
//                     if (currentView === 'restaurantes') {
//                         menuButton = `<button onclick="selectRestaurantForMenu(${item.id})" class="text-blue-600 hover:text-blue-800 font-medium mr-2">Menú</button>`;
//                     }

//                     return `
//                         <tr class="hover:bg-gray-50 transition duration-150">
//                             ${config.rowMapper(item).map(val => `<td class="py-3 px-4 whitespace-nowrap text-sm text-gray-700">${val}</td>`).join('')}
//                             <td class="py-3 px-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                                 ${menuButton}
//                                 <button onclick="openModal(${item.id}, '${itemJsonSafe}')" class="text-green-bite hover:text-green-dark">Editar</button>
//                                 <button onclick="triggerDelete(${item.id})" class="text-red-600 hover:text-red-800">Eliminar</button>
//                             </td>
//                         </tr>
//                     `;
//                 }).join('')}
//             </tbody>
//         </table>
//     `;
//     targetContainer.innerHTML = tableHTML;
// }

// /**
//  * Carga la vista de menú al seleccionar un restaurante desde la tabla de Restaurantes
//  */
// window.selectRestaurantForMenu = function(id) {
//     selectedRestaurantId = id;
//     loadData('menu');

//     document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active-link'));
//     document.querySelector('[data-view="menu"]').classList.add('active-link');
// }


// /**
//  * Abre el modal de creación/edición.
//  */
// window.openModal = function(id = null, item = null) {
//     currentEditingId = id;
//     const config = VIEWS_CONFIG[currentView];
//     const modal = document.getElementById('crud-modal');
//     const form = document.getElementById('crud-form');

//     document.getElementById('modal-title').textContent = id ? `Editar ${config.title.split(' ')[2]}` : `Crear Nuevo ${config.title.split(' ')[2]}`;

//     let formHTML = '';

//     const itemData = typeof item === 'string' ? JSON.parse(item.replace(/&quot;/g, '"')) : item;

//     config.fields.forEach(field => {
//         if (id && field.onlyCreate) return;

//         const currentValue = itemData && itemData[field.name] !== undefined ? itemData[field.name] : '';

//         formHTML += `
//             <div class="mb-4">
//                 <label for="${field.name}" class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
//         `;

//         if (field.type === 'select' && field.dynamicOptions) {
//             const optionsList = allRestaurantes;

//             formHTML += `
//                 <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-bite focus:border-green-bite">
//                     <option value="">-- Seleccione Restaurante --</option>
//                     ${optionsList.map(opt => {
//                         const isSelected = (currentValue === opt.id || currentValue == opt.id) ? 'selected' : '';
//                         return `<option value="${opt.id}" ${isSelected}>${opt.nombre} (ID: ${opt.id})</option>`;
//                     }).join('')}
//                 </select>
//             `;
//         } else if (field.type === 'select') {
//             formHTML += `
//                 <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-bite focus:border-green-bite">
//                     ${field.options.map(option => {
//                         const isSelected = currentValue === option ? 'selected' : '';
//                         return `<option value="${option}" ${isSelected}>${option.charAt(0).toUpperCase() + option.slice(1)}</option>`;
//                     }).join('')}
//                 </select>
//             `;
//         } else if (field.type === 'textarea') {
//             formHTML += `
//                 <textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} rows="3" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-bite focus:border-green-bite">${currentValue}</textarea>
//             `;
//         } else if (field.type === 'checkbox') {
//             const isChecked = id ? (itemData[field.name] == 1 || itemData[field.name] === true) : (field.name === 'es_saludable' || field.name === 'disponible');
//             formHTML += `
//                 <div class="flex items-center mt-2">
//                     <input type="checkbox" id="${field.name}" name="${field.name}" ${isChecked ? 'checked' : ''} class="h-4 w-4 text-green-bite border-gray-300 rounded">
//                     <span class="ml-2 text-sm text-gray-600">${field.label}</span>
//                 </div>
//             `;
//         } else {
//             formHTML += `
//                 <input type="${field.type}" id="${field.name}" name="${field.name}" value="${currentValue}" ${field.required ? 'required' : ''} ${field.step ? `step="${field.step}"` : ''} class="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-bite focus:border-green-bite">
//             `;
//         }

//         formHTML += `</div>`;
//     });

//     form.innerHTML = formHTML;
//     modal.classList.remove('hidden');
// }

// /**
//  * Maneja el envío del formulario (Creación o Edición).
//  */
// window.handleSubmit = async function(e) {
//     e.preventDefault();

//     const config = VIEWS_CONFIG[currentView];
//     const form = document.getElementById('crud-form');
//     const data = {};

//     const AUTH_TOKEN = localStorage.getItem(AUTH_KEY);
//     if (!AUTH_TOKEN) {
//         showMessage('Sesión no activa. Redirigiendo al login.', 'error');
//         setTimeout(() => window.handleLogout(), 1500);
//         return;
//     }

//     // Recolectar datos del formulario
//     config.fields.forEach(field => {
//         const input = form.elements[field.name];
//         if (!input) return;

//         if (field.type === 'checkbox') {
//             data[field.name] = input.checked ? 1 : 0;
//         } else if (field.type === 'number') {
//             if (input.value) data[field.name] = parseFloat(input.value);
//         } else if (field.type === 'password' && currentEditingId) {
//             if (!input.value) return;
//             data[field.name] = input.value;
//         } else {
//             data[field.name] = input.value;
//         }
//     });

//     // Lógica de valores por defecto para Menú
//     if (!currentEditingId && currentView === 'menu') {
//         if (data.es_saludable === undefined) data.es_saludable = 1;
//         if (data.disponible === undefined) data.disponible = 1;
//     }

//     // Determinar método y URL
//     let method, url;
//     if (currentEditingId) {
//         method = 'PUT';
//         url = `${config.url}/${currentEditingId}`;
//     } else {
//         method = 'POST';
//         url = config.url;
//     }

//     try {
//         const response = await authenticatedFetch(url, method, data);
//         if (!response) return;

//         document.getElementById('crud-modal').classList.add('hidden');
//         showMessage(`Registro ${currentEditingId ? 'actualizado' : 'creado'} con éxito.`, 'success');
//         loadData(currentView);

//     } catch (error) {
//         console.error("Error al guardar:", error);
//         showMessage(`Fallo al guardar: ${error.message}`, 'error');
//     }
// };


// // --- Código de Inicialización de la Aplicación (Exportado para el HTML) ---

// window.initAdminApp = function() {
//     // Referencias a elementos del DOM
//     const loginView = document.getElementById('login-view');
//     const adminView = document.getElementById('admin-view');
//     const appContainer = document.getElementById('app-container');

//     const authToken = localStorage.getItem(AUTH_KEY);

//     // Inicialización de la aplicación
//     if (authToken) {
//         // Si hay token, iniciar directamente en la vista de administración
//         loginView.classList.add('hidden');
//         adminView.classList.remove('hidden');

//         appContainer.classList.remove('justify-center', 'items-center', 'min-h-screen', 'p-4');
//         appContainer.classList.add('items-start', 'min-h-full', 'p-0');

//         adminView.classList.remove('scale-0', 'opacity-0');
        
//         loadData('usuarios'); // Inicia la carga de datos
//     } else {
//         // Si no hay token, iniciar en el login
//         adminView.classList.add('hidden');
//         loginView.classList.remove('hidden');

//         appContainer.classList.remove('items-start', 'min-h-full', 'p-0');
//         appContainer.classList.add('justify-center', 'items-center', 'min-h-screen', 'p-4');

//         loginView.classList.remove('scale-0', 'opacity-0');
//     }
    
//     // Asignar listeners de navegación
//     document.querySelectorAll('.nav-button').forEach(button => {
//         button.addEventListener('click', (e) => {
//             const newView = e.currentTarget.getAttribute('data-view');
//             if (newView !== currentView) {
//                 if (currentView === 'menu' && newView !== 'menu') {
//                     selectedRestaurantId = null;
//                 }
//                 loadData(newView);
//                 document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active-link'));
//                 e.currentTarget.classList.add('active-link');
//             }
//         });
//     });

//     // Listeners de acción
//     document.getElementById('add-button').addEventListener('click', () => {
//         openModal(null, null);
//     });
//     document.getElementById('menu-toggle').addEventListener('click', () => {
//         document.getElementById('sidebar').classList.toggle('-translate-x-full');
//     });
    
//     // Asignar listeners a los botones del modal (no se pueden usar onclick directamente en HTML)
//     document.getElementById('submit-modal').addEventListener('click', handleSubmit);
//     document.getElementById('cancel-modal').addEventListener('click', hideCrudModal);
//     document.getElementById('confirm-cancel').addEventListener('click', hideConfirmModal);
//     document.getElementById('confirm-action').addEventListener('click', window.handleConfirmAction);
    
//     // Asignar listener de Login
//     const loginForm = document.getElementById('login-form');
//     if (loginForm) {
//         loginForm.addEventListener('submit', handleLogin);
//     }
// };

// // Se llama a initAdminApp cuando el DOM esté listo
// document.addEventListener('DOMContentLoaded', window.initAdminApp);