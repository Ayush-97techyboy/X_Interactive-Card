// ── Inputs
const nameInput = document.querySelector('.name-input');
const numInput  = document.querySelector('.number-input');
const mmInput   = document.querySelectorAll('.date-input')[0];
const yyInput   = document.querySelectorAll('.date-input')[1];
const cvcInput  = document.querySelector('.cvc-input');

// ── Outputs
const nameOut   = document.querySelector('.name-output');
const numOut    = document.querySelector('.number-output');
const monthOut  = document.querySelector('.month-output');
const yearOut   = document.querySelector('.year-output');
const cvcOut    = document.querySelector('.cvc-output');

// ── UI
const form       = document.getElementById('card-form');
const completed  = document.getElementById('completed');
const btnContinue = document.getElementById('btn-continue');

// ── Real-time updates + inline validation ──

nameInput.addEventListener('input', () => {
  const val = nameInput.value;
  nameOut.textContent = val.trim() || 'Jane Appleseed';
  // Only show invalid-format error while typing (not blank error)
  if (val.trim() && !/^[a-zA-Z\s'-]+$/.test(val.trim())) {
    showInvalid(nameInput, 'Wrong format, letters only');
  } else {
    clearError(nameInput);
  }
});

numInput.addEventListener('input', () => {
  const raw = numInput.value.replace(/\D/g, '').slice(0, 16);
  // Auto-format with spaces every 4 digits
  numInput.value = raw.replace(/(.{4})/g, '$1 ').trim();
  const padded = raw.padEnd(16, '0').match(/.{1,4}/g);
  numOut.textContent = padded ? padded.join(' ') : '0000 0000 0000 0000';
  // Only flag non-digit characters while typing
  if (numInput.value.trim() && /[^\d\s]/.test(numInput.value)) {
    showInvalid(numInput, 'Wrong format, numbers only');
  } else {
    clearError(numInput);
  }
});

mmInput.addEventListener('input', () => {
  // Allow only digits, max 2 chars
  mmInput.value = mmInput.value.replace(/\D/g, '').slice(0, 2);
  const val = mmInput.value;
  monthOut.textContent = val.padStart(2, '0') || '00';
  if (val && (+val < 1 || +val > 12)) {
    showInvalid(mmInput, 'Enter the correct month');
  } else {
    clearError(mmInput);
  }
});

yyInput.addEventListener('input', () => {
  const val = yyInput.value;
  const digits = val.replace(/\D/g, '');
  yearOut.textContent = digits.padStart(2, '0') || '00';
  // Flag non-digits while typing
  if (val.trim() && !/^\d+$/.test(val.trim())) {
    showInvalid(yyInput, 'Wrong format, numbers only');
  } else {
    clearError(yyInput);
  }
});

cvcInput.addEventListener('input', () => {
  const val = cvcInput.value;
  const digits = val.replace(/\D/g, '');
  cvcOut.textContent = digits || '000';
  // Flag non-digits while typing
  if (val.trim() && !/^\d+$/.test(val.trim())) {
    showInvalid(cvcInput, 'Wrong format, numbers only');
  } else {
    clearError(cvcInput);
  }
});

// ── Error helpers ──

// Get the .error.empty and .error.invalid siblings after a given input
function getErrors(input) {
  // For date-input, errors live in .date-container; for others, direct siblings
  const parent = input.closest('.field');
  return {
    empty:   parent.querySelector('.error.empty'),
    invalid: parent.querySelector('.error.invalid')
  };
}

function clearError(input) {
  const { empty, invalid } = getErrors(input);
  empty.classList.remove('show');
  invalid.classList.remove('show');
  input.classList.remove('error-input');
}

function showEmpty(input, msg) {
  const { empty, invalid } = getErrors(input);
  empty.textContent = msg;
  empty.classList.add('show');
  invalid.classList.remove('show');
  input.classList.add('error-input');
}

function showInvalid(input, msg) {
  const { empty, invalid } = getErrors(input);
  invalid.textContent = msg;
  invalid.classList.add('show');
  empty.classList.remove('show');
  input.classList.add('error-input');
}

// ── Validation ──

function validate() {
  let valid = true;

  // Name — must be non-empty and letters/spaces only
  if (!nameInput.value.trim()) {
    showEmpty(nameInput, "Can't be blank");
    valid = false;
  } else if (!/^[a-zA-Z\s'-]+$/.test(nameInput.value.trim())) {
    showInvalid(nameInput, 'Wrong format, letters only');
    valid = false;
  } else {
    clearError(nameInput);
  }

  // Card number — must be exactly 16 digits (spaces allowed between groups)
  const rawNum = numInput.value.replace(/\s/g, '');
  if (!numInput.value.trim()) {
    showEmpty(numInput, "Can't be blank");
    valid = false;
  } else if (!/^\d{16}$/.test(rawNum)) {
    showInvalid(numInput, 'Wrong format, numbers only');
    valid = false;
  } else {
    clearError(numInput);
  }

  // Expiry MM — must be 1-2 digits, 01-12
  const mm = mmInput.value.trim(), yy = yyInput.value.trim();
  if (!mm) {
    showEmpty(mmInput, "Can't be blank");
    valid = false;
  } else if (!/^\d{1,2}$/.test(mm) || +mm < 1 || +mm > 12) {
    showInvalid(mmInput, 'Enter the correct month');
    valid = false;
  } else {
    clearError(mmInput);
  }

  // Expiry YY — must be exactly 2 digits
  if (!yy) {
    showEmpty(yyInput, "Can't be blank");
    valid = false;
  } else if (!/^\d{2}$/.test(yy)) {
    showInvalid(yyInput, 'Wrong format, numbers only');
    valid = false;
  } else {
    clearError(yyInput);
  }

  // CVC — must be exactly 3 digits
  const cvc = cvcInput.value.trim();
  if (!cvc) {
    showEmpty(cvcInput, "Can't be blank");
    valid = false;
  } else if (!/^\d{3}$/.test(cvc)) {
    showInvalid(cvcInput, 'Wrong format, numbers only');
    valid = false;
  } else {
    clearError(cvcInput);
  }

  return valid;
}

// ── Submit ──

form.addEventListener('submit', e => {
  e.preventDefault();
  if (validate()) {
    form.style.display = 'none';
    completed.classList.add('visible');
  }
});

// ── Reset ──

btnContinue.addEventListener('click', () => {
  form.reset();
  completed.classList.remove('visible');
  form.style.display = '';
  nameOut.textContent  = 'Jane Appleseed';
  numOut.textContent   = '0000 0000 0000 0000';
  monthOut.textContent = '00';
  yearOut.textContent  = '00';
  cvcOut.textContent   = '000';
  [nameInput, numInput, mmInput, yyInput, cvcInput].forEach(clearError);
});
