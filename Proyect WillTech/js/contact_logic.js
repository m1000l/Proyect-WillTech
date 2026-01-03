/* 
   Logic for Dynamic Booking Form V2 (Split Layout)
   Handles multi-step navigation, live summary updates, and service restrictions.
*/

// State Management
const bookingState = {
    category: '',       // 'PC', 'Console', 'Handheld'
    brand: '',          // 'PlayStation', 'Xbox', 'Nintendo', 'PC', 'Handheld'
    model: '',          // Specific model
    service: '',        // 'Mantenimiento', 'Reparación'
    details: {},
    trackingId: '---'
};

const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
let currentStepIdx = 0;

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
    updateSummary();
    showStep(0);
});

/* --- Navigation --- */
function showStep(index) {
    // Hide all steps
    steps.forEach(id => {
        document.getElementById(id).classList.remove('active');
        document.getElementById(id).style.display = 'none';
    });

    // Show current
    const currentId = steps[index];
    const el = document.getElementById(currentId);
    el.style.display = 'block';
    // Small delay to allow display:block to apply before adding active class for animation (optional)
    setTimeout(() => el.classList.add('active'), 10);

    // Update Dots
    document.querySelectorAll('.step-dot').forEach((dot, idx) => {
        if (idx <= index) dot.classList.add('active');
        else dot.classList.remove('active');
    });

    currentStepIdx = index;
}

function nextStep() {
    if (currentStepIdx < steps.length - 1) {
        showStep(currentStepIdx + 1);
    }
}

function prevStep() {
    if (currentStepIdx > 0) {
        showStep(currentStepIdx - 1);

        // Reset state for forward steps to ensure clean path if changed
        if (currentStepIdx === 0) {
            bookingState.brand = '';
            bookingState.model = '';
            bookingState.service = '';
        } else if (currentStepIdx === 1) {
            bookingState.model = '';
            bookingState.service = '';
        }
        updateSummary();
    }
}

/* --- Action Handlers --- */

// Step 1: Device/Brand Selection
function selectDevice(brandType) {
    bookingState.brand = brandType;

    // Auto-categorize
    if (['PlayStation', 'Xbox', 'Nintendo'].includes(brandType)) bookingState.category = 'Console';
    else if (brandType === 'PC') bookingState.category = 'PC';
    else bookingState.category = 'Handheld';

    updateSummary();

    // Prepare Step 2
    renderModels(brandType);

    // Auto-advance
    setTimeout(nextStep, 300);
}

// Step 2: Model Selection
function selectModel(modelName) {
    bookingState.model = modelName;
    updateSummary();

    // Prepare Step 3
    renderServices();

    // Auto-advance
    setTimeout(nextStep, 300);
}

// Step 3: Service Selection
function selectService(serviceName) {
    bookingState.service = serviceName;
    updateSummary();

    // Auto-advance
    setTimeout(nextStep, 300);
}

// Final: Booking Submission
function finishBooking() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;

    if (!name || !phone) {
        alert("Por favor completa tu nombre y teléfono.");
        return;
    }

    // Generate ID
    const prefix = bookingState.brand.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    bookingState.trackingId = `${prefix}-${random}`;

    // Update DOM
    document.getElementById('final-tracking-id').innerText = bookingState.trackingId;

    // Switch View
    document.getElementById('wizard-form').style.display = 'none'; // Hide Form
    document.querySelector('.summary-panel').style.opacity = '0.5'; // Dim summary
    document.getElementById('success-view').style.display = 'block'; // Show success

    // Confetti or sound could go here
    console.log("Booking Confirmed:", bookingState);
}


/* --- Rendering Logic --- */

function renderModels(brand) {
    const container = document.getElementById('models-grid');
    container.innerHTML = ''; // Clear

    let models = [];
    let iconClass = 'fa-gamepad';

    switch (brand) {
        case 'PC':
            models = ['Torre Gamer', 'Laptop Gamer', 'PC Oficina', 'All-in-One'];
            iconClass = 'fa-desktop';
            break;
        case 'PlayStation':
            models = ['PlayStation 5', 'PS4 Pro', 'PS4 Slim/Fat', 'PS3 (Legacy)'];
            iconClass = 'fab fa-playstation';
            break;
        case 'Xbox':
            models = ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One S'];
            iconClass = 'fab fa-xbox';
            break;
        case 'Nintendo':
            models = ['Switch OLED', 'Switch V2 (2019)', 'Switch Lite'];
            iconClass = 'fas fa-gamepad';
            break;
        case 'Handheld':
            models = ['Valve Steam Deck', 'Asus ROG Ally', 'Lenovo Legion Go', 'MSI Claw'];
            iconClass = 'fas fa-mobile-alt';
            break;
    }

    models.forEach(m => {
        const card = document.createElement('div');
        card.className = 'brand-card animate-fade-in';
        card.onclick = () => selectModel(m);
        card.innerHTML = `
            <div class="brand-icon"><i class="${iconClass}"></i></div>
            <h4>${m}</h4>
        `;
        container.appendChild(card);
    });
}

function renderServices() {
    const container = document.getElementById('services-grid');
    const msgContainer = document.getElementById('service-restrictions-msg');

    container.innerHTML = '';
    msgContainer.innerHTML = '';

    // Restrictions Logic
    const isDesktopConsole = ['PlayStation', 'Xbox'].includes(bookingState.brand);

    /* 
       Services DB 
    */
    const allServices = [
        { id: 'Mantenimiento', name: 'Mantenimiento Preventivo', icon: 'fa-broom', desc: 'Limpieza profunda + Pasta térmica' },
        { id: 'Reparación', name: 'Reparación Electrónica', icon: 'fa-microchip', desc: 'Diagnóstico de fallas y reparación' },
        { id: 'Software', name: 'Optimización Software', icon: 'fa-rocket', desc: 'Formateo, Drivers, Windows' }
    ];

    let allowed = [];

    if (isDesktopConsole) {
        // Restriction for Sony/Xbox
        allowed = allServices.filter(s => s.id === 'Mantenimiento');
        msgContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <span>Para <strong>${bookingState.brand}</strong>, las reparaciones de placa requieren consulta previa. Por ahora solo puedes agendar <strong>Mantenimiento</strong> directamente.</span>
            </div>
        `;
    } else {
        allowed = allServices;
    }

    allowed.forEach(s => {
        const card = document.createElement('div');
        card.className = 'brand-card animate-fade-in';
        card.onclick = () => selectService(s.name);
        card.innerHTML = `
            <div class="brand-icon"><i class="fas ${s.icon}"></i></div>
            <h4>${s.name}</h4>
            <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 5px;">${s.desc}</p>
        `;
        container.appendChild(card);
    });
}

/* --- Live Summary Updater --- */
function updateSummary() {
    // Helper to update a single item
    const updateItem = (stepId, value, iconClass, filled) => {
        const el = document.getElementById(stepId);
        const iconBox = el.querySelector('.icon-box');
        const valSpan = el.querySelector('.value');

        if (filled) {
            el.classList.add('filled');
            valSpan.innerText = value;
            iconBox.innerHTML = `<i class="${iconClass}"></i>`;
            iconBox.classList.remove('empty');
        } else {
            el.classList.remove('filled');
            valSpan.innerText = '---';
            iconBox.innerHTML = `<i class="fas fa-question"></i>`;
            iconBox.classList.add('empty');
        }
    };

    // Step 1: Device
    let icon1 = 'fas fa-question';
    if (bookingState.brand === 'PC') icon1 = 'fas fa-desktop';
    if (bookingState.brand === 'PlayStation') icon1 = 'fab fa-playstation';
    if (bookingState.brand === 'Xbox') icon1 = 'fab fa-xbox';
    if (bookingState.brand === 'Nintendo') icon1 = 'fas fa-gamepad';
    if (bookingState.brand === 'Handheld') icon1 = 'fas fa-mobile-alt';

    updateItem('sum-step-1', bookingState.brand, icon1, !!bookingState.brand);

    // Step 2: Model
    updateItem('sum-step-2', bookingState.model, 'fas fa-check', !!bookingState.model);

    // Step 3: Service
    updateItem('sum-step-3', bookingState.service, 'fas fa-tools', !!bookingState.service);

    // ID Preview
    const idEl = document.querySelector('.id-preview');
    if (bookingState.brand) {
        idEl.innerText = `${bookingState.brand.substring(0, 3).toUpperCase()}-????`;
        idEl.style.color = '#fff';
    } else {
        idEl.innerText = '----';
        idEl.style.color = 'var(--text-muted)';
    }
}
