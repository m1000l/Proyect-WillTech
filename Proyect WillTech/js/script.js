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
if (false && bookingForm) {
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Dynamic Sections Containers
    // Maps effective category to DOM element
    const sections = {
        torre: document.getElementById('details-torre'),
        aio: document.getElementById('details-aio'),
        minipc: document.getElementById('details-minipc'),
        laptop: document.getElementById('details-laptop'),
        console: document.getElementById('details-console')
    };

    let currentStep = 0;

    // --- Wizard Level 1 Logic (Step 1 Split) ---
    const level1Selection = document.getElementById('level-1-selection');
    const level2Selection = document.getElementById('level-2-selection');
    const subtypePC = document.getElementById('subtype-pc');
    const subtypeConsole = document.getElementById('subtype-console');
    const btnBackLevel = document.getElementById('btnBackLevel');
    const masterCards = document.querySelectorAll('.master-card');

    // Helper to get effective category group
    function getEffectiveCategory(val) {
        if (!val) return null;
        if (val.startsWith('console-')) return 'console';
        return val; // torre, laptop, aio, minipc
    }

    // Level 1 Click Handlers (Zero-Click)
    masterCards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.dataset.target; // 'pc' or 'console'

            // Visual Feedback
            card.classList.add('card-selected');

            // Zero-Click Delay (300ms)
            setTimeout(() => {
                card.classList.remove('card-selected'); // Reset for backnav

                // Animate Out Level 1
                level1Selection.classList.add('slide-out-left');

                setTimeout(() => {
                    level1Selection.style.display = 'none';
                    level1Selection.classList.remove('slide-out-left');

                    // Show Level 2
                    level2Selection.style.display = 'block';
                    level2Selection.classList.add('slide-in-right');

                    // Show correct subtype group
                    if (target === 'pc') {
                        subtypePC.style.display = 'block';
                        subtypeConsole.style.display = 'none';
                    } else {
                        subtypePC.style.display = 'none';
                        subtypeConsole.style.display = 'block';
                    }

                    // Show Back Button
                    const navDiv = document.querySelector('.level-navigation');
                    if (navDiv) navDiv.style.display = 'block';

                }, 400); // Matches animation duration
            }, 300); // Visual delay
        });
    });

    // Level 2 (Subtype) Zero-Click with Advanced Animation
    const subtypeInputs = document.querySelectorAll('#level-2-selection input[name="deviceCategory"]');
    subtypeInputs.forEach(input => {
        input.addEventListener('change', () => {
            const selectedCard = input.closest('.selection-card');
            const group = selectedCard.parentElement;

            // 1. Highlight Selected
            selectedCard.classList.add('active-highlight');
            selectedCard.classList.remove('fade-out');

            // 2. Hide Siblings (Exclusion Logic)
            Array.from(group.children).forEach(sibling => {
                if (sibling !== selectedCard && sibling.classList.contains('selection-card')) {
                    sibling.classList.add('fade-out');
                    setTimeout(() => {
                        sibling.style.display = 'none';
                    }, 400);
                }
            });

            // 3. Auto Advance
            setTimeout(() => {
                // Determine next button: We are in Step 0 (conceptually) but switching to Step 1 (Details)
                // The structure usually has Step 0 container. We trigger its next button.
                // Or we verify currentStep.

                // Trigger Next
                const nextBtn = document.querySelector('.step.active .btn-next') || document.querySelector('.btn-next');
                if (nextBtn && !nextBtn.disabled) {
                    nextBtn.click();
                } else {
                    // Fallback: manually increment if button not found/clickable (should not happen if logic is sound)
                    if (validateStep(currentStep)) { // Assuming validateStep is defined elsewhere
                        currentStep++;
                        updateWizardUI();
                    }
                }
            }, 600); // Wait for animation
        });
    });

    // Back Button Handler
    if (btnBackLevel) {
        btnBackLevel.addEventListener('click', () => {
            // Animate Out Level 2
            level2Selection.classList.remove('slide-in-right');
            level2Selection.classList.add('slide-out-right');

            setTimeout(() => {
                level2Selection.style.display = 'none';
                level2Selection.classList.remove('slide-out-right');

                // Hide Subtypes
                subtypePC.style.display = 'none';
                subtypeConsole.style.display = 'none';

                // Show Level 1
                level1Selection.style.display = 'grid'; // Restore grid
                level1Selection.classList.add('slide-in-left');

                // Hide Back Button logic
                const navDiv = document.querySelector('.level-navigation');
                if (navDiv) navDiv.style.display = 'none';

                // Reset Selection
                const checked = document.querySelector('input[name="deviceCategory"]:checked');
                if (checked) {
                    checked.checked = false;
                    const card = checked.closest('.selection-card');
                    if (card) card.classList.remove('card-selected');
                }

                // Disable Next Button
                const step1Btn = document.querySelector('.form-step[data-step="1"] .btn-next');
                if (step1Btn) step1Btn.disabled = true;

                // Remove animation class after it plays
                setTimeout(() => level1Selection.classList.remove('slide-in-left'), 500);

            }, 400);
        });
    }


    // --- Core Wizard Logic ---

    // Define btnsNext and btnsPrev
    const btnsNext = document.querySelectorAll('.btn-next');
    const btnsPrev = document.querySelectorAll('.btn-prev');

    function updateWizardUI() {
        // Progress Bar
        const progress = ((currentStep) / (steps.length - 1)) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;

        // Steps Indicators
        progressSteps.forEach((indicator, index) => { // Using progressSteps as stepIndicators
            indicator.classList.remove('active', 'completed');
            // Remove checkmark content specific span handling if handled by CSS content replacement

            if (index === currentStep) {
                indicator.classList.add('active');
                indicator.innerHTML = index + 1; // Reset number if active
            } else if (index < currentStep) {
                indicator.classList.add('completed');
                indicator.innerHTML = '<i class="fas fa-check"></i>'; // Add checkmark
            } else {
                indicator.innerHTML = index + 1; // Ensure number if not active/completed
            }
        });

        // Steps Display
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('slide-out-left', 'slide-out-right'); // Clean up
            } else {
                step.classList.remove('active');
            }
        });

        // Handle Dynamic Content in Step 2
        if (currentStep === 1) { // Step 2
            const val = document.querySelector('input[name="deviceCategory"]:checked')?.value;
            const effectiveCat = getEffectiveCategory(val);

            // Hide all sections first
            Object.values(sections).forEach(sec => {
                if (sec) sec.classList.remove('active');
            });

            if (effectiveCat) {
                const sectionToShow = sections[effectiveCat];
                if (sectionToShow) sectionToShow.classList.add('active');
            }
        }
    }

    // Navigation Listeners
    if (btnsNext) {
        btnsNext.forEach(btn => {
            btn.addEventListener('click', () => {
                // Assuming validateStep exists and is handled elsewhere or not needed for this change
                // if (validateStep(currentStep)) {
                // Specific logic for Step 2 transitions (if manual next is used, though auto-click is in place)
                // ... existing logic ...
                currentStep++;
                updateWizardUI();
                // }
            });
        });
    }

    if (btnsPrev) {
        btnsPrev.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateWizardUI();

                    // --- RESET VISUAL FILTERS (Back Logic) ---
                    // Restore all Hidden Cards (Exclusion Logic Reset)
                    document.querySelectorAll('.selection-card').forEach(card => {
                        card.style.display = ''; // Clear inline display:none
                        card.classList.remove('fade-out', 'active-locked', 'active-highlight');
                    });

                    // Reset Handheld View if returning to it
                    const handheldFlow = document.getElementById('handheld-flow');
                    if (handheldFlow && currentStep === 1) {
                        // If we are navigating back TO step 1, we might need to reset Step 2's dynamic content
                        // This means re-rendering service options to its initial state
                        renderServiceOptions(); // Re-render to reset handheld-flow
                    }

                    // If going back to Step 1 (Category), Subtypes are reset by definition of standard DOM, 
                    // but we need to ensure the animation classes are gone.
                }
            });
        });
    }
    // Initial UI update
    updateWizardUI();

    // Enable Next Button on Selection (Restored for subsequent steps)
    // Removed old deviceRadios listener since we handle it in Zero-Click block above

    const serviceRadios = document.querySelectorAll('input[name="serviceType"]');
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', renderServiceOptions);
    });

    // --- NEW: Console Model Dynamic Rendering ---
    const consolePlatformRadios = document.querySelectorAll('input[name="consolePlatform"]');
    const modelContainer = document.getElementById('console-model-container');
    const modelInput = document.getElementById('consoleModelInput');

    if (consolePlatformRadios.length > 0 && modelContainer) {
        // Data for Models
        const modelData = {
            'PlayStation': [
                { name: 'PS5', icon: 'fa-playstation', sub: 'Standard / Digital / Pro', color: '#2d33b1' },
                { name: 'PS4 Pro', icon: 'fa-playstation', sub: '4K Enhanced', color: '#003791' },
                { name: 'PS4', icon: 'fa-playstation', sub: 'Slim / Fat', color: '#003791' }
            ],
            'Xbox': [
                { name: 'Xbox Series X', icon: 'fa-xbox', sub: 'High Performance', color: '#107c10' },
                { name: 'Xbox Series S', icon: 'fa-xbox', sub: 'Digital Edition', color: '#107c10' },
                { name: 'Xbox One', icon: 'fa-xbox', sub: 'X / S / Fat', color: '#107c10' }
            ],
            'Nintendo': [
                { name: 'Switch OLED', icon: 'fa-gamepad', sub: '7-inch Screen', color: '#e60012' },
                { name: 'Switch V1/V2', icon: 'fa-gamepad', sub: 'Standard', color: '#e60012' },
                { name: 'Switch Lite', icon: 'fa-gamepad', sub: 'Handheld Only', color: '#e60012' }
            ]
        };

        function renderConsoleModels(platform) {
            modelContainer.innerHTML = ''; // Clear
            const models = modelData[platform] || [];

            models.forEach(model => {
                const card = document.createElement('div');
                card.className = 'selection-card model-card animate-fade-in';
                // Add click handler for Zero-Click
                card.onclick = () => selectModel(model.name, card);

                card.innerHTML = `
                    <div class="card-content">
                        <i class="fab ${model.icon}" style="color: ${model.color}; font-size: 2rem; margin-bottom: 10px;"></i>
                        <h4>${model.name}</h4>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">${model.sub}</p>
                    </div>
                `;
                modelContainer.appendChild(card);
            });
        }

        function selectModel(name, cardElement) {
            // 1. Set Hidden Input
            if (modelInput) modelInput.value = name;

            // 2. Visual Selection (Exclusion)
            const allCards = modelContainer.querySelectorAll('.selection-card');
            allCards.forEach(c => {
                if (c === cardElement) {
                    c.classList.add('card-selected');
                    c.style.borderColor = 'var(--primary)';
                    c.style.boxShadow = 'var(--glow-primary)';
                } else {
                    c.classList.remove('card-selected');
                    c.style.borderColor = '';
                    c.style.boxShadow = '';
                    c.classList.add('fade-out'); // Optional: fade others
                    setTimeout(() => c.style.display = 'none', 300); // Hide others for cleanup
                }
            });

            // 3. Zero-Click Advance
            setTimeout(() => {
                const nextBtn = document.querySelector('.step.active .btn-next') || document.querySelector('.form-step.active .btn-next');
                if (nextBtn) nextBtn.click();
            }, 500);
        }

        // Attach Listeners
        consolePlatformRadios.forEach(r => {
            r.addEventListener('change', (e) => {
                renderConsoleModels(e.target.value);
            });
        });

        // Initial Render if Checked
        const checked = document.querySelector('input[name="consolePlatform"]:checked');
        if (checked) renderConsoleModels(checked.value);
    }


    // --- Dynamic Rendering Logic ---

    function renderServiceOptions() {
        const container = document.getElementById('service-options-container');
        if (!container) return;

        container.innerHTML = '';

        const val = document.querySelector('input[name="deviceCategory"]:checked')?.value;
        const category = getEffectiveCategory(val);
        const service = document.querySelector('input[name="serviceType"]:checked')?.value;

        // Note: For this strict flow, we might ignore the generic 'serviceType' radio from Step 1 
        // if we want to build a custom flow for Portables. 
        // But to respect the Wizard structure, we will use it as a base or override it.
        // User requirements imply selecting Platform FIRST (Stage 2) then Services.

        if (!category) return;

        let html = '';

        // ============================================================
        //  HANDHELD MASTER FLOW (PORTABLES)
        // ============================================================
        if (val === 'console-portable') {

            // 1. Platform Selection Grid
            html += `
                <div id="handheld-flow" class="animate-fade-in">
                    <h4 class="section-title"><i class="fas fa-gamepad"></i> Selecciona tu Plataforma</h4>
                    <div class="selection-grid model-grid" id="handheld-platforms">
                        
                        <label class="selection-card model-card platform-trigger" data-platform="switch">
                            <input type="radio" name="consoleModel" value="Nintendo Switch">
                            <div class="card-content">
                                <i class="fas fa-gamepad" style="color: #e60012;"></i>
                                <h4>Nintendo</h4>
                                <small>Switch V1/V2/OLED/Lite</small>
                            </div>
                        </label>

                        <label class="selection-card model-card platform-trigger" data-platform="deck">
                            <input type="radio" name="consoleModel" value="Steam Deck">
                            <div class="card-content">
                                <i class="fab fa-steam" style="color: #66c0f4;"></i>
                                <h4>Steam Deck</h4>
                                <small>LCD / OLED</small>
                            </div>
                        </label>

                        <label class="selection-card model-card platform-trigger" data-platform="rog">
                            <input type="radio" name="consoleModel" value="Asus ROG Ally">
                            <div class="card-content">
                                <i class="fas fa-microchip" style="color: #bc1ba9;"></i>
                                <h4>PC Handheld</h4>
                                <small>ROG Ally / Legion / Claw</small>
                            </div>
                        </label>

                    </div>

                    <!-- Services Container (Hidden initially) -->
                    <div id="handheld-services" style="display: none; margin-top: 2rem;">
                         <h4 class="section-title text-neon"><i class="fas fa-tools"></i> Servicios Disponibles</h4>
                         <div id="handheld-dynamic-options"></div>
                    </div>
                </div>
            `;

            container.innerHTML = html;
            attachHandheldListeners(container);
            return; // Exit standard flow
        }

        // ============================================================
        //  STANDARD CONSOLE / PC FLOW
        // ============================================================

        // (Keep existing logic for non-portable consoles and PCs but ensured styling)
        if (category === 'console' && val !== 'console-portable') {
            html += '<div class="dynamic-section active slide-in-right">';
            // ... [Logic for Standard Consoles - kept simple for brevity but matching style]
            let iconClass = val === 'console-ps' ? 'fa-playstation' : 'fa-xbox';
            let platformName = val === 'console-ps' ? 'PlayStation' : 'Xbox';

            html += `<h4 class="section-title"><i class="fab ${iconClass}"></i> Modelos ${platformName}</h4>`;
            html += `<div class="selection-grid model-grid">`;

            if (val === 'console-ps') {
                html += `
                    <label class="selection-card model-card">
                        <input type="radio" name="consoleModel" value="PS5">
                        <div class="card-content"><i class="fab fa-playstation"></i><h4>PS5</h4></div>
                    </label>
                    <label class="selection-card model-card">
                        <input type="radio" name="consoleModel" value="PS4">
                        <div class="card-content"><i class="fab fa-playstation"></i><h4>PS4</h4></div>
                    </label>
                `;
            } else {
                html += `
                    <label class="selection-card model-card">
                        <input type="radio" name="consoleModel" value="Series X/S">
                        <div class="card-content"><i class="fab fa-xbox"></i><h4>Series X/S</h4></div>
                    </label>
                    <label class="selection-card model-card">
                        <input type="radio" name="consoleModel" value="Xbox One">
                        <div class="card-content"><i class="fab fa-xbox"></i><h4>Xbox One</h4></div>
                    </label>
                `;
            }
            html += `</div></div>`;
        }

        // Service Options for Standard Devices (PC/Standard Console)
        // Only show if Service Type is selected from Step 1 (which might be handled differently now)
        // Assuming Step 1 "Service Type" holds.
        if (service && val !== 'console-portable') {
            html += `<div class="dynamic-section active slide-in-up" style="margin-top:2rem;">`;
            html += `<h4>Opciones de ${service}</h4>`;
            // ... [Inject Standard PC/Console Options - Simplified for brevity]
            // Using generic checkboxes for now to ensure functional completeness
            html += `
                <div class="checkbox-list">
                    <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Diagnóstico General"> Diagnóstico General</label>
                    <label class="checkbox-item"><input type="checkbox" name="repairSymptoms" value="Limpieza"> Limpieza / Mantenimiento</label>
                </div>
             `;
            html += `</div>`;
        }

        if (category !== 'console' && category !== 'console-portable') {
            // PC/Laptop fallback
            html = `<h4 class="section-title">Detalles del Equipo</h4><p>Por favor describe el problema en la siguiente sección.</p>`;
        }

        if (container.innerHTML === '') container.innerHTML = html; // render text if empty
    }

    function attachHandheldListeners(container) {
        const platformCards = container.querySelectorAll('.platform-trigger');
        const servicesContainer = document.getElementById('handheld-services');
        const optionsContainer = document.getElementById('handheld-dynamic-options');

        platformCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent creating loop behavior if clicking child input
                // Logic: Exclude siblings, Expand Services

                const platform = card.dataset.platform;

                // 1. Exclusion Logic
                platformCards.forEach(sibling => {
                    if (sibling !== card) {
                        sibling.style.display = 'none'; // Radical Filtering
                    } else {
                        sibling.classList.add('active-locked'); // Permanent Glow
                        sibling.style.width = '100%'; // Full width focus? Or just center?
                        sibling.querySelector('input').checked = true;
                    }
                });

                // 2. Render Specific Services
                servicesContainer.style.display = 'block';
                servicesContainer.classList.add('slide-in-up');

                renderHandheldServices(platform, optionsContainer);
            });
        });
    }

    function renderHandheldServices(platform, container) {
        let optionsHtml = '';

        // Common styles for sections
        const sectionStyle = 'margin-bottom: 1.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);';

        // Mantenimiento
        optionsHtml += `
            <div style="${sectionStyle}">
                <h5 style="color:#00f2ff; margin-bottom:0.5rem;"><i class="fas fa-fan"></i> Mantenimiento Preventivo Especializado</h5>
                <div class="checkbox-list">
                    <label class="checkbox-item">
                        <input type="checkbox" name="handheldService" value="Limpieza Térmica Premium">
                        <span><strong>Limpieza Térmica:</strong> Desmontaje, fan cleaning y Pasta de alto rendimiento.</span>
                    </label>
                     <label class="checkbox-item">
                        <input type="checkbox" name="handheldService" value="Optimización Software">
                        <span><strong>Software:</strong> Optimización de OS y Bios.</span>
                    </label>
                </div>
            </div>
        `;

        // Controles e Inputs
        let driftText = platform === 'switch' ? 'Joy-Con Drift' : 'Thumbstick Drift';
        optionsHtml += `
             <div style="${sectionStyle}">
                <h5 style="color:#ff0055; margin-bottom:0.5rem;"><i class="fas fa-gamepad"></i> Reparación de Controles</h5>
                <div class="checkbox-list">
                    <label class="checkbox-item">
                        <input type="checkbox" name="handheldService" value="Reparación Drift">
                        <span><strong>${driftText}:</strong> Reemplazo de módulos analógicos.</span>
                    </label>
                     <label class="checkbox-item">
                        <input type="checkbox" name="handheldService" value="Reparación Botones">
                        <span><strong>Botones/Gatillos:</strong> Respuesta táctil y pulsadores.</span>
                    </label>
                </div>
            </div>
        `;

        // Energía
        optionsHtml += `
             <div style="${sectionStyle}">
                <h5 style="color:#ffa600; margin-bottom:0.5rem;"><i class="fas fa-bolt"></i> Energía y Pantalla</h5>
                <div class="checkbox-list">
                    <label class="checkbox-item">
                        <input type="checkbox" name="handheldService" value="Cambio Batería">
                        <span><strong>Batería:</strong> Reemplazo de celdas degradadas.</span>
                    </label>
                     <label class="checkbox-item">
                        <input type="checkbox" name="handheldService" value="Reparación Puerto">
                        <span><strong>Puerto USB-C:</strong> Reparación de pines/base.</span>
                    </label>
                     <label class="checkbox-item">
                        <input type="checkbox" name="handheldService" value="Reparación Pantalla">
                        <span><strong>Pantalla:</strong> Panel LCD/OLED o digitalizador.</span>
                    </label>
                </div>
            </div>
        `;

        container.innerHTML = optionsHtml;

        // Re-attach listeners for visual feedback on newly created dynamic cards
        const dynamicCards = container.querySelectorAll('.selection-card input, .checkbox-list input');
        dynamicCards.forEach(input => {
            input.addEventListener('change', () => {
                const card = input.closest('.selection-card');
                const grid = input.closest('.selection-grid');
                if (grid) {
                    grid.querySelectorAll('.selection-card').forEach(c => c.classList.remove('card-selected'));
                }
                if (card) card.classList.add('card-selected');

                // Clear errors on selection
                if (card) card.classList.remove('input-error');
                const servicesContainer = document.getElementById('handheld-services');
                if (servicesContainer) servicesContainer.classList.remove('input-error');
            });
        });
    }

    // Initialize Form
    updateForm();

    // Next Buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                const currentStepEl = steps[currentStep];
                let inputsToValidate = [];

                if (currentStep === 1) { // Step 2 (Dynamic Details)
                    const activeSection = currentStepEl.querySelector('.dynamic-section.active');
                    if (activeSection) {
                        inputsToValidate = activeSection.querySelectorAll('input, select, textarea');
                    }
                } else {
                    inputsToValidate = currentStepEl.querySelectorAll('input, select, textarea');
                }

                let isValid = true;
                const isVisible = (elem) => !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

                inputsToValidate.forEach(input => {
                    // Only validate visible inputs
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
                    // This validation is implicitly handled by Zero-Click, but keep for safety
                    const cat = document.querySelector('input[name="deviceCategory"]:checked');
                    if (!cat) {
                        isValid = false;
                        showModal('Atención', 'Por favor selecciona un tipo de dispositivo.', 'warning');
                    }
                }

                if (currentStep === 1) {
                    const val = document.querySelector('input[name="deviceCategory"]:checked')?.value;
                    const effectiveCat = getEffectiveCategory(val);

                    // --- HANDHELD VALIDATION ---
                    if (effectiveCat === 'console-portable') {
                        const platform = document.querySelector('input[name="consoleModel"]:checked');
                        const services = document.querySelectorAll('input[name="handheldService"]:checked');

                        if (!platform) {
                            isValid = false;
                            showModal('Atención', 'Selecciona tu plataforma (Switch, Deck, etc).', 'warning');
                        } else if (services.length === 0) {
                            isValid = false;
                            showModal('Atención', 'Selecciona al menos un servicio o síntoma.', 'warning');
                            // Visual shake
                            const svcContainer = document.getElementById('handheld-services');
                            if (svcContainer) {
                                svcContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                svcContainer.classList.add('input-error');
                                setTimeout(() => svcContainer.classList.remove('input-error'), 500);
                            }
                        }
                    }
                    // --- STANDARD CONSOLE/PC VALIDATION ---
                    else if (effectiveCat === 'console') {
                        const modelRadios = document.querySelectorAll('input[name="consoleModel"]');
                        if (modelRadios.length > 0) {
                            const modelChecked = document.querySelector('input[name="consoleModel"]:checked');
                            if (!modelChecked) {
                                isValid = false;
                                showModal('Atención', 'Por favor selecciona el M O D E L O de tu consola.', 'warning');
                                document.querySelectorAll('.model-grid .selection-card').forEach(c => c.classList.add('input-error'));
                            }
                        }
                    }

                    // Common Service Type Validation (Skipped for Portables as they have their own service grid)
                    if (effectiveCat && effectiveCat !== 'console-portable') {
                        const serviceRadios = document.querySelectorAll('input[name="serviceType"]');
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
        const effectiveCat = getEffectiveCategory(data.deviceCategory);

        // --- Generate SMART ID ---
        let mainPrefix = 'PC';
        if (effectiveCat === 'console') mainPrefix = 'CONS';
        else mainPrefix = 'PC'; // Covers laptop, AIO, etc. based on user request "Equipos de Computación: PC-XXXX"

        // Random 4 digits
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const deviceId = `${mainPrefix}-${randomNum}`;

        // ... (Supabase insert logic would go here, simplified for this replacement block) ...

        // Construct Details String
        let detailsString = data.serviceType;
        let deviceDetails = "";

        // Collect Symptoms/Upgrades
        const symptoms = [];
        formData.getAll('repairSymptoms').forEach(v => symptoms.push(v));
        const upgrades = [];
        formData.getAll('upgradeComponents').forEach(v => upgrades.push(v));

        // Build Device Details String based on Effective Category
        if (effectiveCat === 'torre') {
            deviceDetails = `Torre: ${data.torreCPU || '?'} / ${data.torreRAM || '?'} / ${data.torreGPU || '?'} - Antigüedad: ${data.torreAge}`;
        } else if (effectiveCat === 'aio') {
            deviceDetails = `AIO ${data.aioBrand}: ${data.aioCPU || '?'} / ${data.aioScreen || '?'} - Antigüedad: ${data.aioAge}`;
        } else if (effectiveCat === 'minipc') {
            deviceDetails = `MiniPC ${data.minipcBrand}: ${data.minipcCPU || '?'} / ${data.minipcRAM || '?'} - Modelo: ${data.minipcModel || 'N/A'}`;
        } else if (effectiveCat === 'laptop') {
            deviceDetails = `Laptop ${data.laptopBrand} (${data.laptopRange})`;
        } else if (effectiveCat === 'console') {
            // Refine for specific console types
            let platform = data.consolePlatform;
            if (data.deviceCategory === 'console-ps') platform = 'PlayStation';
            if (data.deviceCategory === 'console-xbox') platform = 'Xbox';
            if (data.deviceCategory === 'console-portable') platform = 'Portátil';

            deviceDetails = `Consola ${platform}: ${data.consoleModel || 'Modelo N/A'}`;
        }

        if (data.maintenanceLevel) detailsString += ` (${data.maintenanceLevel})`;
        if (symptoms.length > 0) detailsString += ` - Síntomas: ${symptoms.join(', ')}`;
        if (upgrades.length > 0) detailsString += ` - Extras: ${upgrades.join(', ')}`;

        // Save Local Fallback always for demo
        saveLocal(data, effectiveCat, mainPrefix, deviceDetails, detailsString, deviceId);

        function saveLocal(data, cat, prefix, devDet, servType, devId) {
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

            data.deviceId = devId;
            data.id = Date.now();
            data.date = new Date().toLocaleDateString();
            data.created_at = new Date().toISOString();
            data.deviceDetails = devDet;
            data.serviceType = servType;
            data.status = 'Pendiente de Ingreso';
            data.priority = 'Normal';
            data.technicalNotes = data.problemDesc || '';
            data.source = 'local';
            data.deviceType = prefix; // Helper for dashboard

            appointments.push(data);
            localStorage.setItem('appointments', JSON.stringify(appointments));

            showSuccess(devId, data.id, data.userName, servType, devDet);
        }

        function showSuccess(deviceId, trackId, name, service, details) {
            // New Receipt UI
            bookingForm.innerHTML = `
                <div style="text-align: center; padding: 1rem;">
                    
                    <div style="margin-bottom: 2rem;">
                         <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem;"></i>
                         <h2>¡Solicitud Enviada!</h2>
                         <p>Gracias ${name}. Tu lugar ha sido reservado.</p>
                    </div>

                    <!-- Digital Receipt -->
                    <div class="digital-receipt" id="receiptToCapture">
                        <div class="receipt-header">
                            <h3>WilTech Solutions</h3>
                            <span style="font-size: 0.8rem; color: #888;">Orden de Servicio 2025</span>
                        </div>
                        <div class="smart-id-display">${deviceId}</div>
                        <div class="receipt-body">
                            <div class="receipt-row"><span>Cliente:</span> <span>${name}</span></div>
                            <div class="receipt-row"><span>Fecha:</span> <span>${new Date().toLocaleDateString()}</span></div>
                            <div class="receipt-row"><span>Equipo:</span> <span>${details.split(':')[0]}</span></div>
                            <div class="receipt-row"><span>Servicio:</span> <span>${service.split('(')[0]}</span></div>
                        </div>
                        <div class="receipt-footer">
                            <p>Presenta este ticket al entregar tu equipo.</p>
                            <p style="font-size: 0.7rem; margin-top: 5px;">ID Tracking System: #${trackId}</p>
                        </div>
                    </div>

                     <!-- Actions & Warnings -->
                    <div style="max-width: 500px; margin: 0 auto;">
                        <button onclick="downloadReceipt()" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                            <i class="fas fa-download"></i> Descargar Comprobante
                        </button>
                        
                        <div class="warning-box">
                            <i class="fas fa-exclamation-triangle"></i>
                            <div>
                                <strong>¡Importante!</strong>
                                <p style="font-size: 0.9rem; margin: 0;">Guarda tu <strong>ID ${deviceId}</strong>. Lo necesitarás para el seguimiento.</p>
                            </div>
                        </div>

                        <p class="privacy-text">
                            <i class="fas fa-lock"></i> TUS DATOS ESTÁN SEGUROS. Solo los usamos para gestionar tu reparación. Sin spam.
                        </p>

                        <a href="index.html" class="btn btn-outline" style="margin-top: 2rem;">Volver al Inicio</a>
                    </div>
                </div>
            `;

            // Attach function globally so onclick works
            window.downloadReceipt = function () {
                const element = document.getElementById('receiptToCapture');
                html2canvas(element, {
                    backgroundColor: "#0f0f16",
                    scale: 2
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `WilTech_Ticket_${deviceId}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                });
            };
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
