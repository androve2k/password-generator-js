import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generatePassword, generateMultiple, estimateStrength } from '../src/password-generator.js';

test('generates a password of the requested length', () => {
  const pwd = generatePassword({ length: 20 });
  assert.equal(pwd.length, 20);
});

test('defaults to length 16', () => {
  assert.equal(generatePassword().length, 16);
});

test('respects character set toggles', () => {
  const pwd = generatePassword({ length: 50, upper: false, symbols: false, numbers: false, lower: true });
  assert.match(pwd, /^[a-z]+$/);
});

test('throws when no character set is enabled', () => {
  assert.throws(() => generatePassword({ upper: false, lower: false, numbers: false, symbols: false }));
});

test('throws on out-of-range length', () => {
  assert.throws(() => generatePassword({ length: 1 }));
  assert.throws(() => generatePassword({ length: 999 }));
});

test('generateMultiple returns the requested count', () => {
  const passwords = generateMultiple(5, { length: 12 });
  assert.equal(passwords.length, 5);
  passwords.forEach(p => assert.equal(p.length, 12));
});

test('two generated passwords are (almost certainly) different', () => {
  const a = generatePassword();
  const b = generatePassword();
  assert.notEqual(a, b);
});

test('estimateStrength scores a long mixed password highly', () => {
  const { score, label } = estimateStrength('Xk9$mQ2!vL8@nR4pZw7&');
  assert.equal(score, 4);
  assert.equal(label, 'Very strong');
});

test('estimateStrength scores a short simple password low', () => {
  const { score } = estimateStrength('abc');
  assert.equal(score, 0);
});
