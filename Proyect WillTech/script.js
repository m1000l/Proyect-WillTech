// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_ANON_KEY';

let supabase = null;
try {
    if (window.supabase && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
        console.warn('Supabase not configured yet. Using mock/local mode or waiting for keys.');
    }
} catch (e) {
    console.error('Error initializing Supabase:', e);
}

// Mobile Navigation Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Change icon
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/* --- Components Data & Logic --- */

const componentsData = [
    {
        id: 1,
        name: "AMD Ryzen 5 7600",
        type: "cpu",
        price: "Calidad/Precio",
        desc: "El rey del gaming en gama media. 6 núcleos muy potentes y bajo consumo.",
        link: "#"
    },
    {
        id: 2,
        name: "Intel Core i5-13600K",
        type: "cpu",
        price: "Alto Rendimiento",
        desc: "Bestia para gaming y productividad. Multitarea sin problemas.",
        link: "#"
    },
    {
        id: 3,
        name: "NVIDIA RTX 4060",
        type: "gpu",
        price: "Entry Level",
        desc: "DLSS 3.0 y Ray Tracing a un precio accesible para 1080p.",
        link: "#"
    },
    {
        id: 4,
        name: "AMD Radeon RX 7800 XT",
        type: "gpu",
        price: "Best Seller",
        desc: "La mejor opción para 1440p sin gastar una fortuna. VRAM de sobra.",
        link: "#"
    },
    {
        id: 5,
        name: "Kingston Fury Beast 32GB",
        type: "ram",
        price: "DDR5",
        desc: "Velocidad y estabilidad. 32GB es el nuevo estándar para gaming.",
        link: "#"
    },
    {
        id: 6,
        name: "Samsung 980 Pro 1TB",
        type: "storage",
        price: "NVMe Gen4",
        desc: "Velocidades de lectura/escritura increíbles. Ideal para OS y juegos.",
        link: "#"
    }
];

const componentsContainer = document.getElementById('componentsContainer');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderComponents(filter = 'all') {
    if (!componentsContainer) return;

    componentsContainer.innerHTML = '';

    const filteredData = filter === 'all'
        ? componentsData
        : componentsData.filter(item => item.type === filter);

    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'component-card';
        card.innerHTML = `
            <div class="component-header">
                <span class="component-type">${item.type}</span>
                <h3>${item.name}</h3>
            </div>
            <div class="component-body">
                <span class="component-price-tag">${item.price}</span>
                <p class="component-desc">${item.desc}</p>
                <a href="${item.link}" class="buy-btn" target="_blank">Ver en Tienda <i class="fas fa-external-link-alt"></i></a>
            </div>
        `;
        componentsContainer.appendChild(card);
    });
}

// Initialize Components if on the page
if (componentsContainer) {
    renderComponents();

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            // Filter
            renderComponents(btn.dataset.filter);
        });
    });
}

/* --- Multi-step Form Logic --- */

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {

    // Elements
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Dynamic Sections Containers
    const sections = {
        torre: document.getElementById('details-torre'),
        aio: document.getElementById('details-aio'),
        minipc: document.getElementById('details-minipc'),
        laptop: document.getElementById('details-laptop'),
        console: document.getElementById('details-console')
    };

    let currentStep = 0;

    // Event Listeners for Dynamic Content
    const serviceRadios = document.querySelectorAll('input[name="serviceType"]');
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', renderServiceOptions);
    });

    const deviceRadios = document.querySelectorAll('input[name="deviceCategory"]');
    deviceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            renderServiceOptions(); // Re-render if category changes (though usually happens in step 1)
        });
    });

    function renderServiceOptions() {
        const container = document.getElementById('service-options-container');
        if (!container) return;

        container.innerHTML = ''; // Clear

        const category = document.querySelector('input[name="deviceCategory"]:checked')?.value;
        const service = document.querySelector('input[name="serviceType"]:checked')?.value;

        if (!category || !service) return;

        let html = '';

        if (service === 'Mantenimiento') {
            html = `
                <div class="sub-options active">
                    <h4>Nivel de Mantenimiento</h4>
                    <select name="maintenanceLevel" class="tech-select">
                        <option value="Básico">Básico (Limpieza superficial)</option>
                        <option value="Completo" selected>Completo (Limpieza profunda + Pasta Térmica)</option>
                    </select>
                </div>
            `;

            if (category === 'console') {
                html += `
                    <div class="sub-options active" style="margin-top: 1rem;">
                        <h4>Servicios Específicos</h4>
                        <div class="checkbox-list">
                            <label class="checkbox-item"><input type="checkbox" name="upgradeComponents" value="Metal Líquido"> Cambio Metal Líquido (PS5)</label>
                            <label class="checkbox-item"><input type="checkbox" name="upgradeComponents" value="Thermal Pads"> Cambio Thermal Pads</label>
                        </div>
                    </div>
                 `;
            } else {
                html += `
                    <div class="sub-options active" style="margin-top: 1rem;">
                        <h4>Mejoras Opcionales</h4>
                        <div class="checkbox-list">
                            <label class="checkbox-item"><input type="checkbox" name="upgradeComponents" value="Pasta Térmica Premium"> Pasta Térmica Premium</label>
                            <label class="checkbox-item"><input type="checkbox" name="upgradeComponents" value="Limpieza Software"> Optimización Software</label>
                        </div>
                    </div>
                 `;
            }

        } else if (service === 'Reparación' || service === 'Diagnóstico') {
            // Console Specifics
            if (category === 'console') {
                html = `
                    <div class="sub-options active">
                        <h4>Problemas Comunes</h4>
                        <div class="checkbox-list">
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="HDMI"> Puerto HDMI</label>
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="No da video"> No da video</label>
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Se apaga"> Se apaga sola</label>
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Lector Discos"> Lector de Discos</label>
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Ruido Ventilador"> Ruido Excesivo</label>
                        </div>
                    </div>
                 `;
            } else {
                // PC/Laptop
                html = `
                    <div class="sub-options active">
                        <h4>Síntomas Principales</h4>
                        <div class="checkbox-list">
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="No enciende"> No enciende</label>
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Lentitud"> Lentitud</label>
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Pantalla Azul"> Pantalla Azul / Error</label>
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Ruido Extraño"> Ruido Extraño</label>
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Sobrecalentamiento"> Sobrecalentamiento</label>
                            <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Virus"> Virus / Publicidad</label>
                        </div>
                    </div>
                `;

                if (category === 'laptop') {
                    html += `
                        <div class="sub-options active" style="margin-top: 1rem;">
                            <h4>Fallas Físicas</h4>
                            <div class="checkbox-list">
                                <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Pantalla Rota"> Pantalla Rota</label>
                                <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Bisagra"> Bisagra Dañada</label>
                                <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Teclado"> Teclado / Touchpad</label>
                                <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Batería"> Batería / Carga</label>
                            </div>
                        </div>
                     `;
                }
            }
        }

        container.innerHTML = html;
    }

    function updateForm() {
        // Show/Hide Steps
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update Progress Bar
        progressSteps.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }

            if (index < currentStep) {
                step.classList.add('completed');
                step.innerHTML = '<i class="fas fa-check"></i>';
            } else {
                step.classList.remove('completed');
                step.innerHTML = index + 1;
            }
        });

        // Handle Dynamic Content in Step 2
        if (currentStep === 1) { // Step 2
            const selectedCategory = document.querySelector('input[name="deviceCategory"]:checked');

            // Hide all sections first
            Object.values(sections).forEach(sec => {
                if (sec) sec.classList.remove('active');
            });

            if (selectedCategory) {
                const sectionToShow = sections[selectedCategory.value];
                if (sectionToShow) sectionToShow.classList.add('active');
            }
        }
    }

    // Initialize Form
    updateForm();

    // Next Buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                const currentStepEl = steps[currentStep];
                let inputsToValidate = [];

                if (currentStep === 1) { // Step 2
                    const activeSection = currentStepEl.querySelector('.dynamic-section.active');
                    if (activeSection) {
                        inputsToValidate = activeSection.querySelectorAll('input, select, textarea');
                    }
                    // Also validate the common service selection
                    const serviceInputs = currentStepEl.querySelectorAll('input[name="serviceType"]');
                    // We handle service validation separately below
                } else {
                    inputsToValidate = currentStepEl.querySelectorAll('input, select, textarea');
                }

                let isValid = true;
                const isVisible = (elem) => !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

                inputsToValidate.forEach(input => {
                    // Only validate visible inputs inside the active section
                    if (isVisible(input) && input.hasAttribute('required') && !input.value) {
                        isValid = false;
                        input.style.borderColor = '#ff4d4d';
                        input.classList.add('shake');
                        setTimeout(() => input.classList.remove('shake'), 500);
                    } else {
                        input.style.borderColor = 'var(--border)';
                    }
                });

                if (currentStep === 0) {
                    const cat = document.querySelector('input[name="deviceCategory"]:checked');
                    if (!cat) {
                        isValid = false;
                        showModal('Atención', 'Por favor selecciona un tipo de dispositivo.', 'warning');
                    }
                }

                if (currentStep === 1) {
                    const activeSection = currentStepEl.querySelector('.dynamic-section.active');
                    if (activeSection) {
                        const serviceRadios = activeSection.querySelectorAll('input[name="serviceType"]');
                        let serviceChecked = false;
                        serviceRadios.forEach(r => { if (r.checked) serviceChecked = true; });

                        if (!serviceChecked) {
                            isValid = false;
                            showModal('Atención', 'Por favor selecciona un servicio principal.', 'warning');
                        }
                    }
                }

                if (isValid) {
                    currentStep++;
                    updateForm();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } catch (e) {
                console.error('CLICK ERROR:', e);
                alert('Error: ' + e.message);
            }
        });
    });

    // Previous Buttons
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateForm();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);

        // --- SUPABASE PATH ---
        if (supabase) {
            try {
                // 1. Check/Create Client
                let clientId;
                const { data: existingClients } = await supabase
                    .from('clients')
                    .select('id')
                    .eq('phone', data.userPhone)
                    .single();

                if (existingClients) {
                    clientId = existingClients.id;
                } else {
                    const { data: newClient, error: createError } = await supabase
                        .from('clients')
                        .insert([{
                            name: data.userName,
                            phone: data.userPhone,
                            email: data.userEmail
                        }])
                        .select()
                        .single();

                    if (createError) throw createError;
                    clientId = newClient.id;
                }

                // 2. Prepare Ticket Data
                let prefix = 'PC';
                if (data.deviceCategory === 'laptop') prefix = 'LAP';
                else if (data.deviceCategory === 'console') prefix = 'CON';
                else if (data.deviceCategory === 'aio') prefix = 'AIO';
                else if (data.deviceCategory === 'minipc') prefix = 'MIN';

                const { count } = await supabase
                    .from('tickets')
                    .select('*', { count: 'exact', head: true })
                    .eq('device_type', prefix);

                const deviceId = `${prefix}-${String((count || 0) + 1).padStart(3, '0')}`;

                // Construct Details String
                let detailsString = data.serviceType;
                let deviceDetails = "";

                // Collect Symptoms/Upgrades from dynamic fields
                const symptoms = [];
                if (data.repairSymptoms) {
                    if (Array.isArray(data.repairSymptoms)) symptoms.push(...data.repairSymptoms);
                    else symptoms.push(data.repairSymptoms);
                }

                const upgrades = [];
                if (data.upgradeComponents) {
                    if (Array.isArray(data.upgradeComponents)) upgrades.push(...data.upgradeComponents);
                    else upgrades.push(data.upgradeComponents);
                }

                // Build Device Details String based on Category
                if (data.deviceCategory === 'torre') {
                    deviceDetails = `Torre: ${data.torreCPU || '?'} / ${data.torreRAM || '?'} / ${data.torreGPU || '?'} - Antigüedad: ${data.torreAge}`;
                } else if (data.deviceCategory === 'aio') {
                    deviceDetails = `AIO ${data.aioBrand}: ${data.aioCPU || '?'} / ${data.aioScreen || '?'} - Antigüedad: ${data.aioAge}`;
                } else if (data.deviceCategory === 'minipc') {
                    deviceDetails = `MiniPC ${data.minipcBrand}: ${data.minipcCPU || '?'} / ${data.minipcRAM || '?'} - Modelo: ${data.minipcModel || 'N/A'}`;
                } else if (data.deviceCategory === 'laptop') {
                    deviceDetails = `Laptop ${data.laptopBrand} (${data.laptopRange}) - Mant: ${data.laptopMaintenanceHistory}`;
                } else if (data.deviceCategory === 'console') {
                    deviceDetails = `Consola ${data.consolePlatform}: ${data.consoleModel} - Mant: ${data.consoleMaintenanceHistory}`;
                }

                // Append info to Service Type
                if (data.maintenanceLevel) detailsString += ` (${data.maintenanceLevel})`;
                if (symptoms.length > 0) detailsString += ` - Síntomas: ${symptoms.join(', ')}`;
                if (upgrades.length > 0) detailsString += ` - Extras: ${upgrades.join(', ')}`;

                const { data: newTicket, error: ticketError } = await supabase
                    .from('tickets')
                    .insert([{
                        client_id: clientId,
                        device_type: prefix,
                        device_id: deviceId,
                        service_type: detailsString,
                        device_details: deviceDetails,
                        status: 'Pendiente de Ingreso',
                        priority: 'Normal',
                        technical_notes: data.problemDesc || ''
                    }])
                    .select()
                    .single();

                if (ticketError) throw ticketError;

                showSuccess(deviceId, newTicket.id, data.userName);

            } catch (error) {
                console.error('Error submitting to Supabase:', error);
                showModal('Error', 'Error al enviar la solicitud. Intentando guardar localmente...', 'error');
                saveLocal(data);
            }
        }
        // --- LOCALSTORAGE FALLBACK ---
        else {
            saveLocal(data);
        }

        function saveLocal(data) {
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            const count = appointments.length + 1;

            let prefix = 'PC';
            if (data.deviceCategory === 'laptop') prefix = 'LAP';
            else if (data.deviceCategory === 'console') prefix = 'CON';
            else if (data.deviceCategory === 'aio') prefix = 'AIO';
            else if (data.deviceCategory === 'minipc') prefix = 'MIN';

            const deviceId = `${prefix}-${String(count).padStart(3, '0')}`;

            data.deviceId = deviceId;
            data.id = Date.now();
            data.date = new Date().toLocaleDateString();
            data.created_at = new Date().toISOString();

            // Construct Details (Same logic as above)
            let detailsString = data.serviceType;
            let deviceDetails = "";

            const symptoms = [];
            // Handle FormData array behavior for checkboxes
            const formDataObj = new FormData(bookingForm);
            formDataObj.getAll('repairSymptoms').forEach(v => symptoms.push(v));

            const upgrades = [];
            formDataObj.getAll('upgradeComponents').forEach(v => upgrades.push(v));

            if (data.deviceCategory === 'torre') {
                deviceDetails = `Torre: ${data.torreCPU || '?'} / ${data.torreRAM || '?'} / ${data.torreGPU || '?'} - Antigüedad: ${data.torreAge}`;
            } else if (data.deviceCategory === 'aio') {
                deviceDetails = `AIO ${data.aioBrand}: ${data.aioCPU || '?'} / ${data.aioScreen || '?'} - Antigüedad: ${data.aioAge}`;
            } else if (data.deviceCategory === 'minipc') {
                deviceDetails = `MiniPC ${data.minipcBrand}: ${data.minipcCPU || '?'} / ${data.minipcRAM || '?'} - Modelo: ${data.minipcModel || 'N/A'}`;
            } else if (data.deviceCategory === 'laptop') {
                deviceDetails = `Laptop ${data.laptopBrand} (${data.laptopRange}) - Mant: ${data.laptopMaintenanceHistory}`;
            } else if (data.deviceCategory === 'console') {
                deviceDetails = `Consola ${data.consolePlatform}: ${data.consoleModel} - Mant: ${data.consoleMaintenanceHistory}`;
            }

            if (data.maintenanceLevel) detailsString += ` (${data.maintenanceLevel})`;
            if (symptoms.length > 0) detailsString += ` - Síntomas: ${symptoms.join(', ')}`;
            if (upgrades.length > 0) detailsString += ` - Extras: ${upgrades.join(', ')}`;

            data.deviceDetails = deviceDetails;
            data.serviceType = detailsString;
            data.status = 'Pendiente de Ingreso';
            data.priority = 'Normal';
            data.technicalNotes = data.problemDesc || '';
            data.source = 'local';

            appointments.push(data);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            showSuccess(deviceId, data.id, data.userName);
        }

        function showSuccess(deviceId, trackId, name) {
            bookingForm.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem;"></i>
                    <h2>¡Solicitud Enviada!</h2>
                    <p>Gracias ${name}. Hemos recibido tu solicitud.</p>
                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin: 1.5rem 0; display: inline-block; text-align: left;">
                        <p style="color: var(--primary); margin-bottom: 0.5rem;"><strong>ID Dispositivo:</strong> ${deviceId}</p>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">ID Seguimiento: #${trackId}</p>
                    </div>
                    <br>
                    <a href="index.html" class="btn btn-outline" style="margin-top: 1rem;">Volver al Inicio</a>
                </div>
            `;
        }
    });
}

/* --- ADMIN PANEL LOGIC --- */

// Check if we are on the admin page
if (document.getElementById('loginScreen')) {
    // Global Filter State
    let currentFilterType = 'all';
    let currentFilterService = 'all';
    let currentFilterStatus = 'all';
    let currentTicketId = null; // For the detail view
    let allAppointments = []; // Store fetched data
    let initialStatus = null; // Track initial state
    let initialPriority = null; // Track initial state

    // Check Login
    window.checkLogin = function () {
        const user = document.getElementById('adminUser').value;
        const pass = document.getElementById('adminPassword').value;

        if (user === 'admin' && pass === 'admin123') {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboard').style.display = 'flex';
            loadAppointments();
        } else {
            showModal('Error', 'Usuario o contraseña incorrectos', 'error');
        }
    };

    // Logout
    window.logout = function () {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminUser').value = '';
        document.getElementById('adminPassword').value = '';
    };

    // Load Appointments & Stats
    window.loadAppointments = async function () {
        allAppointments = []; // Clear previous data

        // 1. Try Supabase
        if (supabase) {
            try {
                // Fetch Tickets with Client Data
                const { data, error } = await supabase
                    .from('tickets')
                    .select(`
                        *,
                        clients (name, phone, email)
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Map to existing structure for compatibility
                const supabaseAppointments = data.map(t => ({
                    id: t.id,
                    deviceId: t.device_id,
                    deviceType: t.device_type, // 'PC', 'LAP', 'CON'
                    deviceDetails: t.device_details,
                    serviceType: t.service_type,
                    status: t.status,
                    priority: t.priority,
                    technicalNotes: t.technical_notes,
                    date: new Date(t.created_at).toLocaleDateString(),
                    created_at: t.created_at, // keep original for time calc
                    userName: t.clients.name,
                    userPhone: t.clients.phone,
                    userEmail: t.clients.email,
                    source: 'supabase' // Mark source
                }));
                allAppointments.push(...supabaseAppointments);

            } catch (error) {
                console.error('Supabase load error:', error);
                // If Supabase fails, we still proceed to load local data
                console.warn('Error cargando datos de Supabase. Mostrando datos locales si existen.');
            }
        }

        // 2. Load LocalStorage (Merge or Fallback)
        const localData = JSON.parse(localStorage.getItem('appointments')) || [];
        const localMapped = localData.map(a => ({
            ...a,
            source: 'local',
            // Ensure fields match for display and filtering
            created_at: a.created_at || new Date(a.id).toISOString(), // Use stored created_at or derive from id
            deviceType: a.deviceCategory === 'laptop' ? 'LAP' : (a.deviceCategory === 'console' ? 'CON' : 'PC') // Derive if missing
        }));

        // Combine (local data is appended, assuming it's a fallback/supplement)
        allAppointments.push(...localMapped);

        // Calculate Stats
        const total = allAppointments.length;
        const pending = allAppointments.filter(a => ['Pendiente de Ingreso', 'En Espera', 'Pendiente de Presupuesto', 'Presupuesto Aprobado', 'En Pausa'].includes(a.status)).length;
        const working = allAppointments.filter(a => ['En Diagnóstico', 'En Reparación', 'En Prueba'].includes(a.status)).length;
        const done = allAppointments.filter(a => ['Listo para Retirar', 'Entregado'].includes(a.status)).length;

        document.getElementById('statTotal').innerText = total;
        document.getElementById('statPending').innerText = pending;
        document.getElementById('statWorking').innerText = working;
        document.getElementById('statDone').innerText = done;

        filterAppointments(); // Render table with current filters
    };

    // Filter by Type (Sidebar)
    window.filterByType = function (type, service = 'all') {
        currentFilterType = type;
        currentFilterService = service;

        closeTicketView(); // Ensure we are on the dashboard
        filterAppointments();
    };

    // Filter by Status (Cards)
    window.filterByStatus = function (status, cardElement) {
        currentFilterStatus = status;

        // Update Active Card UI
        document.querySelectorAll('.stat-card').forEach(card => card.classList.remove('active'));
        if (cardElement) cardElement.classList.add('active');

        filterAppointments();
    };

    // Main Filter Function
    window.filterAppointments = function () {
        const filtered = allAppointments.filter(app => {
            // Type Filter
            if (currentFilterType !== 'all') {
                if (currentFilterType === 'PC' && !app.deviceId.startsWith('PC')) return false;
                if (currentFilterType === 'Laptop' && !app.deviceId.startsWith('LAP')) return false;
                if (currentFilterType === 'Consola' && !app.deviceId.startsWith('CON')) return false;
            }

            // Service/Subtype Filter (Sub-menu)
            if (currentFilterService !== 'all') {
                const keyword = currentFilterService.toLowerCase();
                const matchService = app.serviceType.toLowerCase().includes(keyword);
                const matchDevice = (app.deviceDetails || '').toLowerCase().includes(keyword);

                if (!matchService && !matchDevice) return false;
            }

            // Status Filter (Cards)
            if (currentFilterStatus !== 'all') {
                if (currentFilterStatus === 'Pendiente') {
                    if (!['Pendiente de Ingreso', 'En Espera', 'Pendiente de Presupuesto', 'Presupuesto Aprobado', 'En Pausa'].includes(app.status)) return false;
                } else if (currentFilterStatus === 'En Proceso') {
                    if (!['En Diagnóstico', 'En Reparación', 'En Prueba'].includes(app.status)) return false;
                } else if (currentFilterStatus === 'Finalizado') {
                    if (!['Listo para Retirar', 'Entregado'].includes(app.status)) return false;
                } else {
                    if (app.status !== currentFilterStatus) return false;
                }
            }

            return true;
        });

        renderTable(filtered);
    };

    // Render Table Helper
    function renderTable(data) {
        const tbody = document.getElementById('appointmentsTableBody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">No se encontraron citas.</td></tr>';
            return;
        }

        data.forEach((app) => {
            // Calculate Time Elapsed
            const entryDate = new Date(app.created_at || app.date); // Use created_at from DB or date for local
            const now = new Date();
            const diffTime = Math.abs(now - entryDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const timeString = diffDays === 0 ? 'Hoy' : `${diffDays} días`;

            // Status Class
            let statusClass = '';
            if (app.status === 'Pendiente de Ingreso') statusClass = 'status-pending-ingreso';
            else if (app.status === 'En Espera') statusClass = 'status-waiting';
            else if (app.status === 'En Diagnóstico') statusClass = 'status-diagnostic';
            else if (app.status === 'Pendiente de Presupuesto') statusClass = 'status-budget';
            else if (app.status === 'Presupuesto Aprobado') statusClass = 'status-approved';
            else if (app.status === 'En Reparación') statusClass = 'status-repair';
            else if (app.status === 'En Prueba') statusClass = 'status-testing';
            else if (app.status === 'Listo para Retirar') statusClass = 'status-ready';
            else if (app.status === 'Entregado') statusClass = 'status-delivered';
            else if (app.status === 'En Pausa') statusClass = 'status-paused';
            else statusClass = 'status-pending'; // Fallback

            // Priority Badge
            const priority = app.priority || 'Normal';
            let priorityColor = '#888';
            if (priority === 'Alta') priorityColor = '#ff0055';
            if (priority === 'Baja') priorityColor = '#00ff88';

            const row = `
                <tr onclick="viewDetails(${app.source === 'supabase' ? app.id : `'${app.id}'`})">
                    <td>
                        <div style="font-weight: 600; color: white;">${app.deviceId || 'N/A'}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${app.date}</div>
                    </td>
                    <td>
                        <div style="color: white;">${app.deviceDetails || 'N/A'}</div>
                        <div style="font-size: 0.75rem; color: ${priorityColor}; text-transform:uppercase; margin-top:2px;">${priority}</div>
                    </td>
                    <td>
                        <div style="font-size: 0.9rem;">${app.serviceType}</div>
                    </td>
                    <td>
                        <div style="font-weight: 500;">${app.userName}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${app.userPhone}</div>
                    </td>
                    <td>
                        <span style="font-weight: 600; color: var(--primary);">${timeString}</span>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">${app.status}</span>
                    </td>
                    <td>
                        <i class="fas fa-chevron-right" style="color: var(--text-muted);"></i>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    // --- TICKET DETAIL VIEW LOGIC ---

    window.viewDetails = function (id) {
        // Handle ID types (int for Supabase, string/timestamp for local)
        // Use loose comparison to find the item regardless of ID type (number vs string)
        const app = allAppointments.find(a => a.id == id);

        if (app) {
            currentTicketId = app.id; // Store the original ID (can be number or string)

            // Populate Fields
            document.getElementById('ticketTitle').innerText = `Ticket #${app.deviceId}`;
            document.getElementById('ticketClientName').innerText = app.userName;
            document.getElementById('ticketClientPhone').innerText = app.userPhone;
            document.getElementById('ticketClientEmail').innerText = app.userEmail || 'No registrado';

            document.getElementById('ticketDeviceId').innerText = app.deviceId;
            document.getElementById('ticketDeviceType').innerText = app.deviceCategory === 'pc' ? 'PC / Torre' : 'Consola';
            document.getElementById('ticketDeviceSpecs').innerText = app.deviceDetails;

            document.getElementById('ticketServiceType').innerText = app.serviceType;
            document.getElementById('ticketDate').innerText = app.date;
            document.getElementById('ticketDesc').innerText = app.problemDesc || 'Sin descripción adicional.';

            // Technical Notes History
            const historyContainer = document.getElementById('notesHistoryContainer');
            historyContainer.innerHTML = ''; // Clear

            let notes = [];
            try {
                notes = JSON.parse(app.technicalNotes || '[]');
                if (!Array.isArray(notes)) throw new Error('Not an array');
            } catch (e) {
                // Backward compatibility: Treat as single string note if not JSON
                if (app.technicalNotes) {
                    notes = [{
                        text: app.technicalNotes,
                        date: app.date || 'Fecha desconocida',
                        author: 'Nota Original',
                        stage: 'Migración'
                    }];
                }
            }

            if (notes.length === 0) {
                historyContainer.innerHTML = '<div class="note-empty">No hay notas registradas.</div>';
            } else {
                notes.forEach(note => {
                    const noteDiv = document.createElement('div');
                    noteDiv.className = 'note-entry';
                    noteDiv.innerHTML = `
                        <div class="note-header">
                            <span><i class="fas fa-user-circle"></i> ${note.author || 'Admin'} &bull; ${note.stage || 'General'}</span>
                            <span>${note.date}</span>
                        </div>
                        <div class="note-content">${note.text}</div>
                    `;
                    historyContainer.appendChild(noteDiv);
                });
                // Scroll to bottom
                setTimeout(() => { historyContainer.scrollTop = historyContainer.scrollHeight; }, 100);
            }

            // Priority
            document.getElementById('ticketPrioritySelect').value = app.priority || 'Normal';

            // WhatsApp Link
            const waBtn = document.getElementById('btnWhatsapp');
            const waLink = generateWhatsAppLink(app.userPhone, app.userName, app.deviceId, app.status);
            waBtn.href = waLink;

            // Status Badge & Header Color
            const badge = document.getElementById('ticketStatusBadge');
            const header = document.getElementById('ticketHeader');

            badge.className = 'status-badge'; // reset
            header.className = 'ticket-header'; // reset

            badge.innerText = app.status;
            document.getElementById('ticketStatusSelect').value = app.status;

            // Capture initial state for change detection
            initialStatus = app.status;
            initialPriority = app.priority || 'Normal';

            if (app.status === 'Pendiente de Ingreso') { badge.classList.add('status-pending-ingreso'); header.classList.add('header-ingreso'); }
            else if (app.status === 'En Espera') { badge.classList.add('status-waiting'); header.classList.add('header-ingreso'); }
            else if (app.status === 'En Diagnóstico') { badge.classList.add('status-diagnostic'); header.classList.add('header-diagnostic'); }
            else if (app.status === 'Pendiente de Presupuesto') { badge.classList.add('status-budget'); header.classList.add('header-diagnostic'); }
            else if (app.status === 'Presupuesto Aprobado') { badge.classList.add('status-approved'); header.classList.add('header-diagnostic'); }
            else if (app.status === 'En Reparación') { badge.classList.add('status-repair'); header.classList.add('header-execution'); }
            else if (app.status === 'En Prueba') { badge.classList.add('status-testing'); header.classList.add('header-execution'); }
            else if (app.status === 'Listo para Retirar') { badge.classList.add('status-ready'); header.classList.add('header-finished'); }
            else if (app.status === 'Entregado') { badge.classList.add('status-delivered'); header.classList.add('header-finished'); }
            else if (app.status === 'En Pausa') { badge.classList.add('status-paused'); header.classList.add('header-ingreso'); }

            // Show Modal
            document.getElementById('ticketDetailModal').style.display = 'flex';
        }
    };

    window.closeTicketView = function () {
        document.getElementById('ticketDetailModal').style.display = 'none';
        currentTicketId = null;
    };

    // Save Changes (Status/Priority/Notes)
    window.saveTicketChanges = async function () {
        if (!currentTicketId) return;

        const newStatus = document.getElementById('ticketStatusSelect').value;
        const newPriority = document.getElementById('ticketPrioritySelect').value;
        const newNoteText = document.getElementById('newNoteInput').value.trim();

        // Check if anything changed
        if (newStatus === initialStatus && newPriority === initialPriority && newNoteText === '') {
            showModal('Información', 'No hay cambios para guardar.', 'info');
            return;
        }

        // Find current app data
        const appIndex = allAppointments.findIndex(a => a.id == currentTicketId);
        if (appIndex === -1) return;
        const app = allAppointments[appIndex];

        // Prepare Updates
        const updates = {};
        if (newStatus !== initialStatus) updates.status = newStatus;
        if (newPriority !== initialPriority) updates.priority = newPriority;

        // Handle Notes
        let currentNotes = [];
        try {
            currentNotes = JSON.parse(app.technicalNotes || '[]');
        } catch (e) {
            if (app.technicalNotes) currentNotes = [{ text: app.technicalNotes, date: app.date, author: 'Nota Original', stage: 'Migración' }];
        }

        if (newNoteText) {
            const noteObj = {
                text: newNoteText,
                date: new Date().toLocaleString(),
                author: 'Admin', // Hardcoded for now
                stage: newStatus // Context of the note
            };
            currentNotes.push(noteObj);
            updates.technical_notes = JSON.stringify(currentNotes); // DB field name
            updates.technicalNotes = JSON.stringify(currentNotes); // Local field name
        }

        // Update Supabase
        if (app.source === 'supabase' && supabase) {
            try {
                const { error } = await supabase
                    .from('tickets')
                    .update(updates) // updates uses DB column names (technical_notes)
                    .eq('id', currentTicketId);

                if (error) throw error;
                showModal('Éxito', 'Ticket actualizado correctamente.', 'success');
            } catch (err) {
                console.error('Error updating Supabase:', err);
                showModal('Error', 'No se pudo actualizar en la base de datos.', 'error');
                return;
            }
        }
        // Update Local
        else {
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            const localIndex = appointments.findIndex(a => a.id == currentTicketId);
            if (localIndex !== -1) {
                if (updates.status) appointments[localIndex].status = updates.status;
                if (updates.priority) appointments[localIndex].priority = updates.priority;
                if (updates.technicalNotes) appointments[localIndex].technicalNotes = updates.technicalNotes;
                localStorage.setItem('appointments', JSON.stringify(appointments));
                showModal('Éxito', 'Ticket actualizado localmente.', 'success');
            }
        }

        // Refresh UI
        document.getElementById('newNoteInput').value = ''; // Clear note input
        await loadAppointments(); // Reload list
        viewDetails(currentTicketId); // Re-open detail view to show changes
    };

    // Helper: WhatsApp Link Generator
    function generateWhatsAppLink(phone, name, deviceId, status) {
        // Clean phone number
        let cleanPhone = phone.replace(/\D/g, '');
        if (!cleanPhone.startsWith('57')) cleanPhone = '57' + cleanPhone; // Default Colombia

        const message = `Hola ${name}, te contactamos de WilTech Solutions respecto a tu equipo ${deviceId}. Estado actual: ${status}.`;
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    }
}

// Global Helper: Show Modal (Available for both Admin and Booking)
window.showModal = function (title, message, type = 'info') {
    // Check if custom modal exists (from admin.html)
    const modal = document.getElementById('customModal');
    if (modal) {
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalMessage').innerText = message;

        // Icon and Color based on type
        const icon = document.getElementById('modalIcon');
        const header = document.querySelector('.modal-header');

        // Reset classes
        header.className = 'modal-header';

        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
            header.classList.add('success');
        } else if (type === 'error') {
            icon.className = 'fas fa-times-circle';
            header.classList.add('error');
        } else if (type === 'warning') {
            icon.className = 'fas fa-exclamation-triangle';
            header.classList.add('warning');
        } else {
            icon.className = 'fas fa-info-circle';
            header.classList.add('info');
        }

        modal.style.display = 'flex';

        // Close button logic
        const closeBtn = document.querySelector('.btn-modal');
        closeBtn.onclick = function () {
            modal.style.display = 'none';
        };
    } else {
        // Fallback for contact.html (or if modal DOM is missing)
        alert(`${title}: ${message}`);
    }
};
