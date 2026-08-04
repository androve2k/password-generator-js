# password-generator-js

A tiny, zero-dependency, cryptographically secure password generator for JavaScript. Runs in any modern browser using the native [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) — no Math.random(), no external libraries, no build step required.

**[Live demo →](https://androve2k.github.io/password-generator-js/)** · **[Full-featured version on roversia.it →](https://roversia.it/utility/password-sicura-en)**

## Why

Most “password generator” snippets floating around use `Math.random()`, which is **not** cryptographically secure and shouldn’t be used to generate anything security-sensitive. This library uses `crypto.getRandomValues()` instead, generates entirely client-side, and never transmits or stores the output anywhere.

## Features

- 🔐 Cryptographically secure (Web Crypto API)
- 📦 Zero dependencies, ~2KB unminified
- 🌐 Works as ESM, CommonJS, or plain `<script>` tag
- 🎚️ Configurable length and character sets
- 📊 Built-in strength estimation
- 🧪 No build step needed

## Install

Copy `src/password-generator.js` into your project, or clone this repo. No npm package yet — [let me know](https://github.com/androve2k/password-generator-js/issues) if you’d find one useful.

## Usage

### As an ES module

```js
import { generatePassword, generateMultiple, estimateStrength } from './password-generator.js';

const pwd = generatePassword(); // 16 chars, all character types
console.log(pwd); // e.g. "kX9$mQ2!vL8@nR4p"
```

### With options

```js
const pwd = generatePassword({
  length: 24,
  upper: true,
  lower: true,
  numbers: true,
  symbols: false, // no symbols this time
});
```

### Generate multiple at once

```js
const passwords = generateMultiple(10, { length: 20 });
// ['aB3$...', 'xY9!...', ...] — array of 10 passwords
```

### Estimate strength

```js
const { score, label } = estimateStrength(pwd);
// score: 0-4, label: "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong"
```

### Plain `<script>` tag (no bundler)

```html
<script src="password-generator.js"></script>
<script>
  const pwd = window.PasswordGenerator.generatePassword({ length: 20 });
</script>
```

## API

### `generatePassword(options?)`

|Option   |Type   |Default|Description                    |
|---------|-------|-------|-------------------------------|
|`length` |number |`16`   |Password length (4–128)        |
|`upper`  |boolean|`true` |Include A–Z                    |
|`lower`  |boolean|`true` |Include a–z                    |
|`numbers`|boolean|`true` |Include 0–9                    |
|`symbols`|boolean|`true` |Include `!@#$%^&*()_+-=[]{}...`|

Returns a `string`. Throws if all character sets are disabled, or if `length` is out of range.

### `generateMultiple(count?, options?)`

Returns an array of `count` passwords (default `10`), each generated with `options`.

### `estimateStrength(password)`

Returns `{ score: 0-4, label: string }`. Heuristic based on length and character diversity — useful for UI feedback, not a substitute for real entropy calculation.

## FAQ

**Is this safe to use for real passwords?**
Yes — it uses the same `crypto.getRandomValues()` API that password managers rely on for secure randomness. That said, always store passwords in a proper password manager, not in plain text.

**Does it work in Node.js?**
Yes, in Node 19+ where `crypto.getRandomValues()` is available on the global object. For older Node versions, use the native `crypto` module instead.

**Why no npm package?**
Keeping this dependency-free and copy-pasteable on purpose. If there’s demand, I’ll publish `@roversia/password-generator` — [open an issue](https://github.com/androve2k/password-generator-js/issues) if you want it.

## Related

This is one of [39+ free browser-based tools](https://roversia.it/utility-en.html) I maintain at roversia.it. The [full-featured version](https://roversia.it/utility/password-sicura-en) includes a live UI with strength meter and bulk generation.

## License

MIT © [Andrea Roversi](https://roversia.it/index-en.html)
