// GlowHaven — Booking Page Logic

renderNavbar('booking');
renderFooter();

// ---- State ----
let selServiceId = null;
let selBarberId = null;
let selDate = null;
let selTime = null;
let calYear, calMonth;

const now = new Date();
calYear = now.getFullYear();
calMonth = now.getMonth();

// Pre-select service from URL
const urlParams = new URLSearchParams(window.location.search);
const urlSvc = urlParams.get('service');

// ---- Render Services ----
const svcGrid = document.getElementById('svc-grid');

GH_SERVICES.forEach(s => {
  const card = document.createElement('div');
  card.className = 'svc-card' + (s.id === urlSvc ? ' selected' : '');
  card.dataset.id = s.id;
  card.innerHTML = `
    <div class="svc-card-info">
      <p class="svc-card-name">${s.name}</p>
      <p class="svc-card-meta">${s.duration} &bull; ${fmt(s.price)}</p>
    </div>
    <div class="svc-radio"></div>`;
  card.addEventListener('click', () => {
    document.querySelectorAll('.svc-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selServiceId = s.id;
    updateProgress();
    updateSummary();
  });
  svcGrid.appendChild(card);
  if (s.id === urlSvc) selServiceId = s.id;
});

// ---- Render Barbers ----
const barberGrid = document.getElementById('barber-grid');
const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

// "Anyone" option
const anyCard = document.createElement('div');
anyCard.className = 'barber-card';
anyCard.dataset.id = '';
anyCard.innerHTML = `
  <div class="barber-avatar any"><i class="fa-solid fa-shuffle"></i></div>
  <p class="barber-name">Anyone</p>
  <p class="barber-role">First Available</p>`;
anyCard.addEventListener('click', () => selectBarber('', anyCard));
barberGrid.appendChild(anyCard);

GH_STYLISTS.forEach(st => {
  const card = document.createElement('div');
  card.className = 'barber-card';
  card.dataset.id = st.id;
  card.innerHTML = `
    <div class="barber-avatar">${initials(st.name)}</div>
    <p class="barber-name">${st.name}</p>
    <p class="barber-role">${st.specialty.split('&')[0].trim()}</p>`;
  card.addEventListener('click', () => selectBarber(st.id, card));
  barberGrid.appendChild(card);
});

function selectBarber(id, card) {
  document.querySelectorAll('.barber-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selBarberId = id;
  updateProgress();
  updateSummary();
}

// ---- Calendar ----
const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function renderCalendar() {
  document.getElementById('cal-month-label').textContent = `${MONTHS[calMonth]} ${calYear}`;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = DAYS.map(d => `<div class="cal-day-header">${d}</div>`).join('');

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const todayStr = now.toISOString().split('T')[0];

  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += `<div class="cal-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isPast = dateStr < todayStr;
    const classes = [
      'cal-day',
      isPast ? 'past' : '',
      dateStr === todayStr ? 'today' : '',
      dateStr === selDate ? 'selected' : ''
    ].filter(Boolean).join(' ');
    grid.innerHTML += `<div class="${classes}" onclick="selectDate('${dateStr}', ${isPast})">${d}</div>`;
  }
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
}

function selectDate(date, isPast) {
  if (isPast) return;
  selDate = date;
  selTime = null;
  renderCalendar();
  renderTimeSlots();
  updateProgress();
  updateSummary();
}

// ---- Time Slots ----
function renderTimeSlots() {
  const container = document.getElementById('time-slots');
  const msg = document.getElementById('no-date-msg');
  if (!selDate) {
    container.innerHTML = '';
    msg.style.display = 'block';
    return;
  }
  msg.style.display = 'none';
  container.innerHTML = GH_TIME_SLOTS.map(t => `
    <div class="time-pill ${t === selTime ? 'selected' : ''}" onclick="selectTime(this, '${t}')">${t}</div>`
  ).join('');
}

function selectTime(el, time) {
  selTime = time;
  document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  updateProgress();
  updateSummary();
}

// ---- Progress Steps ----
function updateProgress() {
  const s1 = document.getElementById('step-1');
  const s2 = document.getElementById('step-2');
  const s3 = document.getElementById('step-3');
  const l1 = document.getElementById('line-1');
  const l2 = document.getElementById('line-2');

  // Reset
  [s1, s2, s3].forEach(s => s.classList.remove('active', 'done'));
  [l1, l2].forEach(l => l.classList.remove('done'));

  if (!selServiceId) {
    s1.classList.add('active');
  } else if (selBarberId === null) {
    s1.classList.add('done');
    l1.classList.add('done');
    s2.classList.add('active');
  } else if (!selDate || !selTime) {
    s1.classList.add('done');
    s2.classList.add('done');
    l1.classList.add('done');
    l2.classList.add('done');
    s3.classList.add('active');
  } else {
    s1.classList.add('done');
    s2.classList.add('done');
    s3.classList.add('done');
    l1.classList.add('done');
    l2.classList.add('done');
  }
}

// ---- Summary ----
function updateSummary() {
  const svc = GH_SERVICES.find(s => s.id === selServiceId);
  const barber = GH_STYLISTS.find(s => s.id === selBarberId);

  const svcEl = document.getElementById('sum-service');
  svcEl.textContent = svc ? `${svc.name} (${svc.duration})` : 'Not selected yet';
  svcEl.className = svc ? 'bk-sum-val' : 'bk-sum-val muted';

  const barberEl = document.getElementById('sum-barber');
  if (selBarberId === null) {
    barberEl.textContent = 'Not selected yet';
    barberEl.className = 'bk-sum-val muted';
  } else {
    barberEl.textContent = selBarberId === '' ? 'First Available' : barber.name;
    barberEl.className = 'bk-sum-val';
  }

  const whenEl = document.getElementById('sum-when');
  if (selDate && selTime) {
    const d = new Date(selDate + 'T00:00:00');
    whenEl.textContent = `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${selTime}`;
    whenEl.className = 'bk-sum-val';
  } else {
    whenEl.textContent = 'Not selected yet';
    whenEl.className = 'bk-sum-val muted';
  }

  document.getElementById('sum-price').textContent = svc ? fmt(svc.price) : '—';
}

// ---- Submit Booking ----
function submitBooking() {
  if (!Auth.isLoggedIn()) {
    showToast('<i class="fa-solid fa-lock"></i> Please login to confirm your booking.');
    setTimeout(() => {
      window.location.href = 'auth.html?next=' + encodeURIComponent(window.location.pathname + window.location.search);
    }, 1500);
    return;
  }

  if (!selServiceId) { showToast('<i class="fa-solid fa-circle-exclamation"></i> Please select a service.'); return; }
  if (!selDate) { showToast('<i class="fa-solid fa-circle-exclamation"></i> Please select a date.'); return; }
  if (!selTime) { showToast('<i class="fa-solid fa-circle-exclamation"></i> Please select a time slot.'); return; }

  const user = Auth.getUser();
  const svc = GH_SERVICES.find(s => s.id === selServiceId);
  const barber = GH_STYLISTS.find(s => s.id === selBarberId);

  const booking = {
    bookingId: genId('BK'),
    userId: user.id,
    customerName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    service: svc.name,
    serviceId: svc.id,
    stylist: barber ? barber.name : 'Any Available',
    date: selDate,
    time: selTime,
    price: svc.price,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  Bookings.add(booking);
  document.getElementById('modal-bk-id').textContent = booking.bookingId;
  document.getElementById('booking-modal').classList.add('show');
}

// ---- Init ----
renderCalendar();
renderTimeSlots();
updateSummary();
if (urlSvc) updateProgress();
