// ============ Загрузка JSON ============
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Не удалось загрузить ${path}: ${res.status}`);
  return res.json();
}

// ============ Рендер карточек (metrics) ============
function renderCards(metrics) {
  const row = document.getElementById('cardsRow');
  row.innerHTML = metrics.map(m => `
    <div class="col-12 col-md-6 col-xl-3">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${m.title}</h5>
          <p class="card-text display-6">${m.value}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// ============ Рендер таблицы (rows) ============
function statusBadge(status) {
  const map = {
    'Готово':  'success',
    'В работе': 'warning',
    'Новая':   'secondary'
  };
  return `<span class="badge bg-${map[status] || 'secondary'}">${status}</span>`;
}

function renderActions(rows) {
  const body = document.getElementById('actionsBody');
  body.innerHTML = rows.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.action}</td>
      <td>${statusBadge(r.status)}</td>
    </tr>
  `).join('');
}

// ============ Toast helper ============
function showToast(text) {
  const toastEl = document.getElementById('saveToast');
  document.getElementById('toastBody').textContent = text;
  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

// ============ Валидация формы ============
const form        = document.getElementById('addForm');
const emailInput  = document.getElementById('recordEmail');
const titleInput  = document.getElementById('recordTitle');

function validateField(input) {
  let ok = input.checkValidity();
  if (input.type === 'email' && input.value &&
      !/^\S+@\S+\.\S+$/.test(input.value)) {
    ok = false;
  }
  const filled = input.value.trim() !== '';
  input.classList.toggle('is-valid',   ok && filled);
  input.classList.toggle('is-invalid', !ok && filled);
  return ok;
}

// Собственный обработчик №1 — input
[emailInput, titleInput].forEach(inp => {
  inp.addEventListener('input', () => validateField(inp));
});

// ============ Собственный обработчик №2 — submit ============
let savedCount = 0;
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const emailOk = validateField(emailInput);
  const titleOk = validateField(titleInput);

  if (!emailOk || !titleOk) {
    showToast('Проверьте обязательные поля'); // из notifications.json
    return;
  }

  savedCount++;
  showToast(`Запись «${titleInput.value}» сохранена. Всего: ${savedCount}`);

  // Программно закрываем modal
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById('addModal')
  ).hide();

  form.reset();
  [emailInput, titleInput].forEach(i =>
    i.classList.remove('is-valid', 'is-invalid'));
});

// ============ Собственный обработчик №3 — Ctrl+T (тема) ============
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 't') {
    document.body.classList.toggle('bg-light');
  }
});

// ============ Инициализация ============
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const dashboard     = await loadJSON('data/dashboard.json');
    const notifications = await loadJSON('data/notifications.json');

    renderCards(dashboard.metrics);
    renderActions(dashboard.rows);

    // Показываем первое уведомление из notifications.json
    if (notifications.length) {
      setTimeout(() => showToast(notifications[0].text), 1200);
    }
  } catch (err) {
    console.error(err);
    showToast('Ошибка загрузки данных');
  }
});
