document.addEventListener('DOMContentLoaded', () => {

    const trackBtn = document.getElementById('btnTrack');
    const trackInput = document.getElementById('trackingInput');
    const resultSection = document.getElementById('trackingResult');
    const searchError = document.getElementById('searchError');

    if (trackBtn) {
        trackBtn.addEventListener('click', handleTracking);
        trackInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleTracking();
        });
    }

    function handleTracking() {
        const query = trackInput.value.trim().toUpperCase();

        // Reset UI
        resultSection.classList.add('hidden');
        searchError.style.display = 'none';

        if (!query) return;

        // 1. Fetch Data (Local Storage for now, can be adapted for Supabase)
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const match = appointments.find(app => (app.deviceId && app.deviceId.toUpperCase() === query));

        if (match) {
            renderTrackingResult(match);
        } else {
            // Show Error with animation
            searchError.style.display = 'block';
            searchError.classList.add('shake');
            setTimeout(() => searchError.classList.remove('shake'), 500);
        }
    }

    function renderTrackingResult(data) {
        // Populate Basic Info
        document.getElementById('resDeviceType').innerText = data.deviceDetails || 'Equipo Desconocido';
        document.getElementById('resId').innerText = data.deviceId;
        document.getElementById('resDate').innerText = data.date;
        document.getElementById('resStatusBadge').innerText = data.status;

        // Status Badge Color
        const badge = document.getElementById('resStatusBadge');
        badge.className = 'tracking-badge'; // reset
        if (data.status.includes('Pendiente')) badge.classList.add('status-pending');
        else if (data.status.includes('Diagnóstico')) badge.classList.add('status-diagnostic');
        else if (data.status.includes('Reparación')) badge.classList.add('status-repair');
        else if (data.status.includes('Listo') || data.status.includes('Entregado')) badge.classList.add('status-ready');

        // Timeline Logic
        updateTimeline(data.status);

        // Render Technical Notes
        renderNotes(data.technicalNotes);

        // Show Result
        resultSection.classList.remove('hidden');
        resultSection.classList.add('slide-in-up');
    }

    function updateTimeline(status) {
        const steps = document.querySelectorAll('.timeline-step');
        const fill = document.getElementById('timelineFill');

        // Define Status Mapping to Timeline Steps (0-3)
        // 0: Recibido / Pendiente
        // 1: Diagnóstico
        // 2: Reparación
        // 3: Listo / Entregado

        let activeIndex = 0;

        const s = status.toLowerCase();
        if (s.includes('pendiente') || s.includes('espera') || s.includes('ingreso')) activeIndex = 0;
        else if (s.includes('diagnostico') || s.includes('presupuesto')) activeIndex = 1;
        else if (s.includes('reparación') || s.includes('prueba') || s.includes('pausa')) activeIndex = 2;
        else if (s.includes('listo') || s.includes('entregado')) activeIndex = 3;

        // Update Steps
        steps.forEach((step, index) => {
            if (index <= activeIndex) {
                step.classList.add('active');
                step.querySelector('.step-circle').style.borderColor = 'var(--primary)';
                step.querySelector('.step-circle').style.color = 'var(--bg-dark)';
                step.querySelector('.step-circle').style.background = 'var(--primary)';
                step.querySelector('.step-circle').style.boxShadow = '0 0 15px var(--primary)';
            } else {
                step.classList.remove('active');
                // Reset styles
                step.querySelector('.step-circle').style.borderColor = 'rgba(255,255,255,0.1)';
                step.querySelector('.step-circle').style.color = 'rgba(255,255,255,0.5)';
                step.querySelector('.step-circle').style.background = 'transparent';
                step.querySelector('.step-circle').style.boxShadow = 'none';
            }
        });

        // Update Bar Width
        // 0 -> 0%, 1 -> 33%, 2 -> 66%, 3 -> 100%
        const percentages = ['0%', '33%', '66%', '100%'];
        fill.style.width = percentages[activeIndex];
    }

    function renderNotes(notesData) {
        const list = document.getElementById('techNotesList');
        list.innerHTML = ''; // Clear

        let notes = [];
        try {
            notes = JSON.parse(notesData);
        } catch (e) {
            // Fallback for old string format
            if (notesData && typeof notesData === 'string') {
                notes = [{
                    text: notesData,
                    date: 'Nota Inicial',
                    author: 'Sístema'
                }];
            }
        }

        if (!Array.isArray(notes) || notes.length === 0) {
            list.innerHTML = '<li style="color:var(--text-muted); font-style:italic;">No hay notas registradas por el momento.</li>';
            return;
        }

        // Render in reverse order (newest first)
        notes.slice().reverse().forEach(note => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="note-meta">
                    <span class="note-date">${note.date}</span>
                    <span class="note-author">${note.author || 'Técnico'}</span>
                </div>
                <p class="note-text">${note.text}</p>
            `;
            list.appendChild(li);
        });
    }

});
