/* Client-side validation for form.html */

const form = document.getElementById('signupForm');

const fields = {
  name: document.getElementById('name'),
  age: document.getElementById('age'),
  mobile: document.getElementById('mobile'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  confirmPassword: document.getElementById('confirmPassword'),
};

const errors = {
  name: document.getElementById('nameError'),
  age: document.getElementById('ageError'),
  mobile: document.getElementById('mobileError'),
  email: document.getElementById('emailError'),
  password: document.getElementById('passwordError'),
  confirmPassword: document.getElementById('confirmPasswordError'),
};

const statusEl = document.getElementById('formStatus');

const ruleLen = document.getElementById('ruleLen');
const ruleNum = document.getElementById('ruleNum');
const ruleSpec = document.getElementById('ruleSpec');

const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmBtn = document.getElementById('toggleConfirmPassword');

function setFieldState(input, message) {
  const wrapper = input.closest('.field');
  const errorEl = errors[input.name];

  if (message) {
    wrapper?.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = message;
  } else {
    wrapper?.classList.remove('invalid');
    input.setAttribute('aria-invalid', 'false');
    if (errorEl) errorEl.textContent = '';
  }
}

function isValidName(value) {
  // Letters + spaces, 2-40 chars (simple rule)
  return /^[A-Za-z][A-Za-z ]{1,39}$/.test(value.trim());
}

function isValidAge(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 120;
}

function isValidMobile(value) {
  // 10 digits (India-style). Accepts only digits.
  return /^[0-9]{10}$/.test(value.trim());
}

function isValidEmail(value) {
  // Basic email check; HTML type=email also helps.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function passwordRules(value) {
  const v = value || '';
  const minLen = v.length >= 8;
  const hasNumber = /[0-9]/.test(v);
  const hasSpecial = /[^A-Za-z0-9]/.test(v);
  return { minLen, hasNumber, hasSpecial };
}

function updatePasswordRuleUI() {
  const { minLen, hasNumber, hasSpecial } = passwordRules(fields.password.value);
  ruleLen.classList.toggle('ok', minLen);
  ruleNum.classList.toggle('ok', hasNumber);
  ruleSpec.classList.toggle('ok', hasSpecial);
}

function validateName() {
  const v = fields.name.value.trim();
  if (!v) return 'Name is required.';
  if (!isValidName(v)) return 'Enter a valid name (letters & spaces, min 2 characters).';
  return '';
}

function validateAge() {
  const v = fields.age.value.trim();
  if (!v) return 'Age is required.';
  if (!isValidAge(v)) return 'Enter a valid age (1 to 120).';
  return '';
}

function validateMobile() {
  const v = fields.mobile.value.trim();
  if (!v) return 'Mobile number is required.';
  if (!isValidMobile(v)) return 'Enter a 10-digit mobile number.';
  return '';
}

function validateEmail() {
  const v = fields.email.value.trim();
  if (!v) return 'Email is required.';
  if (!isValidEmail(v)) return 'Enter a valid email address.';
  return '';
}

function validatePassword() {
  const v = fields.password.value;
  if (!v) return 'Password is required.';
  const { minLen, hasNumber, hasSpecial } = passwordRules(v);
  if (!minLen || !hasNumber || !hasSpecial) {
    return 'Password must be 8+ characters and include 1 number and 1 special character.';
  }
  return '';
}

function validateConfirmPassword() {
  const v = fields.confirmPassword.value;
  if (!v) return 'Please confirm your password.';
  if (v !== fields.password.value) return 'Passwords do not match.';
  return '';
}

function validateAll() {
  const nameMsg = validateName();
  const ageMsg = validateAge();
  const mobileMsg = validateMobile();
  const emailMsg = validateEmail();
  const passMsg = validatePassword();
  const confirmMsg = validateConfirmPassword();

  setFieldState(fields.name, nameMsg);
  setFieldState(fields.age, ageMsg);
  setFieldState(fields.mobile, mobileMsg);
  setFieldState(fields.email, emailMsg);
  setFieldState(fields.password, passMsg);
  setFieldState(fields.confirmPassword, confirmMsg);

  const firstInvalid = [fields.name, fields.age, fields.mobile, fields.email, fields.password, fields.confirmPassword]
    .find((el) => el.getAttribute('aria-invalid') === 'true');

  const ok = !nameMsg && !ageMsg && !mobileMsg && !emailMsg && !passMsg && !confirmMsg;
  return { ok, firstInvalid };
}

function setStatus(kind, text) {
  statusEl.classList.remove('good', 'bad');
  if (kind === 'good') statusEl.classList.add('good');
  if (kind === 'bad') statusEl.classList.add('bad');
  statusEl.textContent = text || '';
}

function togglePasswordVisibility(input, button) {
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  button.textContent = isPassword ? 'Hide' : 'Show';
  button.setAttribute('aria-pressed', String(isPassword));
}

// Live validation events
fields.name.addEventListener('input', () => setFieldState(fields.name, validateName()));
fields.age.addEventListener('input', () => setFieldState(fields.age, validateAge()));
fields.mobile.addEventListener('input', () => setFieldState(fields.mobile, validateMobile()));
fields.email.addEventListener('input', () => setFieldState(fields.email, validateEmail()));

fields.password.addEventListener('input', () => {
  updatePasswordRuleUI();
  setFieldState(fields.password, validatePassword());
  // re-check confirm if user changes password
  if (fields.confirmPassword.value) setFieldState(fields.confirmPassword, validateConfirmPassword());
});

fields.confirmPassword.addEventListener('input', () => setFieldState(fields.confirmPassword, validateConfirmPassword()));

togglePasswordBtn.addEventListener('click', () => togglePasswordVisibility(fields.password, togglePasswordBtn));
toggleConfirmBtn.addEventListener('click', () => togglePasswordVisibility(fields.confirmPassword, toggleConfirmBtn));

form.addEventListener('reset', () => {
  // clear errors + status
  Object.values(fields).forEach((el) => setFieldState(el, ''));
  setStatus('', '');
  // reset rule UI after reset event settles
  setTimeout(updatePasswordRuleUI, 0);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  updatePasswordRuleUI();
  const { ok, firstInvalid } = validateAll();

  if (!ok) {
    setStatus('bad', 'Please fix the highlighted fields and try again.');
    firstInvalid?.focus();
    return;
  }

  setStatus('good', 'Form submitted successfully (demo).');
  // Demo-only: reset the form after a moment (no backend)
  setTimeout(() => form.reset(), 800);
});

// Initial rule UI
updatePasswordRuleUI();

