/**
 * password-generator-js
 * Zero-dependency, cryptographically secure password generator.
 * Uses the Web Crypto API — works in any modern browser, Deno, or Node 19+.
 *
 * @license MIT
 * @author Andrea Roversi <https://roversia.it/index-en.html>
 */

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Generate a single cryptographically secure random password.
 *
 * @param {Object} [options]
 * @param {number} [options.length=16] - Password length (min 4, max 128).
 * @param {boolean} [options.upper=true] - Include uppercase letters.
 * @param {boolean} [options.lower=true] - Include lowercase letters.
 * @param {boolean} [options.numbers=true] - Include digits.
 * @param {boolean} [options.symbols=true] - Include symbols.
 * @returns {string} The generated password.
 * @throws {Error} If no character set is enabled, or length is out of range.
 *
 * @example
 * generatePassword(); // 16-char password, all character types
 * generatePassword({ length: 24, symbols: false }); // no symbols
 */
function generatePassword(options = {}) {
  const {
    length = 16,
    upper = true,
    lower = true,
    numbers = true,
    symbols = true,
  } = options;

  if (length < 4 || length > 128) {
    throw new Error('length must be between 4 and 128');
  }

  let charset = '';
  if (upper) charset += CHARSETS.upper;
  if (lower) charset += CHARSETS.lower;
  if (numbers) charset += CHARSETS.numbers;
  if (symbols) charset += CHARSETS.symbols;

  if (!charset) {
    throw new Error('At least one character set must be enabled');
  }

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
}

/**
 * Generate multiple passwords at once.
 *
 * @param {number} [count=10] - How many passwords to generate.
 * @param {Object} [options] - Same options as generatePassword().
 * @returns {string[]} Array of generated passwords.
 */
function generateMultiple(count = 10, options = {}) {
  return Array.from({ length: count }, () => generatePassword(options));
}

/**
 * Estimate password strength on a 0–4 scale (very weak → very strong).
 * Heuristic, not a substitute for entropy calculation — good enough for UI feedback.
 *
 * @param {string} password
 * @returns {{ score: number, label: string }}
 */
function estimateStrength(password) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;
  if (password.length >= 16) score++;
  if (password.length >= 24) score++;

  const labels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  const clamped = Math.min(score, 4);

  return { score: clamped, label: labels[clamped] };
}

// Universal export: works with ESM, CommonJS, and plain <script> tags
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generatePassword, generateMultiple, estimateStrength };
}
if (typeof window !== 'undefined') {
  window.PasswordGenerator = { generatePassword, generateMultiple, estimateStrength };
}

export { generatePassword, generateMultiple, estimateStrength };
