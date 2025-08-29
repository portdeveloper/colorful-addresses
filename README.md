# Emojified

A React component for visually distinguishing Ethereum addresses using emoji patterns.

## Problem

Ethereum addresses like `0x1234567890123456789012345678901234567890` and `0x1234567890123456789012345678901234567891` are nearly impossible to distinguish at a glance. This library solves that by generating consistent, unique emoji patterns for each address.

## Installation

```bash
npm install emojified
```

## Usage

### Basic Usage

```tsx
import { Emojified } from 'emojified';

function App() {
  return (
    <div>
      <Emojified address="0x1234567890123456789012345678901234567890" />
      {/* Renders: 0x1234...7890 🐶🍎⚽ */}
    </div>
  );
}
```

### Show Full Address

```tsx
<Emojified 
  address="0x1234567890123456789012345678901234567890" 
  showFullAddress={true} 
/>
{/* Renders: 0x1234567890123456789012345678901234567890 🐶🍎⚽ */}
```

### Custom Spacing

```tsx
<Emojified 
  address="0x1234567890123456789012345678901234567890" 
  spacing="  " 
/>
{/* Renders: 0x1234...7890  🐶🍎⚽ */}
```

### Custom Styling

```tsx
<Emojified 
  address="0x1234567890123456789012345678901234567890"
  className="my-address-class"
  style={{ fontFamily: 'monospace', fontSize: '14px' }}
/>
```

## Features

- **Consistent**: Same address always generates the same emoji pattern
- **Unique**: Different addresses generate visually distinct patterns
- **Accessible**: Uses a curated set of diverse, easily distinguishable emojis
- **Flexible**: Supports full or truncated address display
- **Validated**: Invalid addresses show error emojis (❌⚠️❓)

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `address` | `string` | required | The Ethereum address to emojify |
| `showFullAddress` | `boolean` | `false` | Show full address instead of truncated |
| `spacing` | `string` | `" "` | Spacing between address and emojis |
| `className` | `string` | `undefined` | CSS class to apply |
| `style` | `React.CSSProperties` | `undefined` | Inline styles to apply |

### Utility Functions

```tsx
import { generateEmojiPattern, isValidEthereumAddress, formatAddress } from 'emojified';

// Generate just the emoji pattern
const emojis = generateEmojiPattern('0x1234567890123456789012345678901234567890');
// Returns: "🐶🍎⚽"

// Validate an address
const isValid = isValidEthereumAddress('0x1234567890123456789012345678901234567890');
// Returns: true

// Format an address
const formatted = formatAddress('0x1234567890123456789012345678901234567890', false);
// Returns: "0x1234...7890"
```

## Examples

```tsx
// Different addresses get different emojis
<Emojified address="0x1111111111111111111111111111111111111111" />
{/* 0x1111...1111 🐱🍊🏀 */}

<Emojified address="0x2222222222222222222222222222222222222222" />
{/* 0x2222...2222 🐭🍋🏈 */}

// Invalid addresses show error pattern
<Emojified address="0xinvalid" />
{/* 0xinvalid ❌⚠️❓ */}
```

## How It Works

1. **Hashing**: The full address is hashed to generate a consistent number
2. **Mapping**: The hash is used to select 3 emojis from a curated set of 100 diverse emojis
3. **Consistency**: Same input always produces same output
4. **Distinction**: Similar addresses produce very different emoji patterns

## License

MIT