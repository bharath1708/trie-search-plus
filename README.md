# Trie-Search-Plus

![npm](https://img.shields.io/npm/v/trie-search-plus)
![License](https://img.shields.io/npm/l/trie-search-plus)
![Downloads](https://img.shields.io/npm/dw/trie-search-plus)
A powerful, lightweight Trie-based search and autocomplete library for JavaScript applications, now with **Web Worker (browser) and Worker Thread (Node.js) support** for large datasets.

## Table of Contents

* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)

  * [Basic Usage](#basic-usage)
  * [Worker-Based Usage](#worker-based-usage)
  * [Advanced Features](#advanced-features)
* [Generating Visualizations](#generating-visualizations)
* [API Reference](#api-reference)
* [Browser Compatibility](#browser-compatibility)
* [Contributing](#contributing)
* [License](#license)
* [Author](#author)

## Features

* **Exact Word Search**: Fast lookup for complete words
* **Prefix Matching**: Find words that start with a specific prefix
* **Autocomplete**: Get suggestions based on a partial input
* **Fuzzy Search**: Find words with spelling errors (Levenshtein distance)
* **Wildcard Search**: Use "." or "\*" as wildcard characters
* **Word Deletion**: Remove words from the trie
* **Word Counting**: Count total words in the trie
* **Word Listing**: List all words stored in the trie
* **Worker Thread Support**: Offload heavy trie operations to a separate thread
* **Unified API**: Consistent interface for both synchronous and asynchronous implementations
* **Factory Pattern**: Simple creation of trie implementations based on needs

![Architecture Diagram](./images/trie-architecture.png)
*Architecture diagram showing the relationship between Trie, TrieFactory, and TrieWorkerManager*

---

## Installation

### npm

```bash
npm install trie-search-plus
```

### Yarn

```bash
yarn add trie-search-plus
```

### CDN

```html
<!-- UMD build -->
<script src="https://unpkg.com/trie-search-plus/dist/trie-search-plus.umd.js"></script>

<!-- ES Module build -->
<script type="module">
  import { Trie, TrieFactory } from 'https://unpkg.com/trie-search-plus/dist/trie-search-plus.esm.js';
</script>
```

> Note: Worker-based trie requires Node.js ≥10.5 or modern browsers with Web Worker support.

---

## Usage

### Basic Usage

```javascript
import { Trie } from 'trie-search-plus';

const trie = new Trie();
trie.insert('apple');
trie.insert('application');
trie.insert('banana');

console.log(trie.search('apple')); // true
console.log(trie.startsWith('app')); // true
console.log(trie.autocomplete('app')); // ['apple', 'application']
```

---

### Worker-Based Usage

**Benefits:** non-blocking operations, parallel processing, memory isolation, responsive UI, and scalable performance.

#### Quick Example

```javascript
import { TrieFactory } from 'trie-search-plus';

// Create a worker-based trie
const trie = TrieFactory.create({ useWorker: true });

// Load data asynchronously
await trie.loadData(['apple', 'banana', 'orange']);

// Async search
const exists = await trie.search('apple'); // true
```

#### Using `TrieWorkerManager` Directly

```javascript
import { TrieWorkerManager } from 'trie-search-plus';

const trie = new TrieWorkerManager();
await trie.initialize();
await trie.loadData(['apple', 'application', 'banana']);

const result = await trie.autocomplete('app'); // ['apple', 'application']
trie.terminate();
```

**When to Use Workers:**

* Large datasets (tens of thousands of words or more)
* UI responsiveness is critical
* Performing fuzzy or wildcard searches

![Performance Comparison Chart](./images/performance-comparison.png)
*Performance comparison between synchronous and worker-based implementations with increasing dataset sizes*

---

### Advanced Features

#### Fuzzy Search

```javascript
console.log(trie.fuzzySearch('aple', 1)); // ['apple']
console.log(trie.fuzzySearch('aplication', 2)); // ['application']
```

#### Wildcard Search

```javascript
console.log(trie.wildcardSearch('app.e')); // ['apple']
console.log(trie.wildcardSearch('*berry')); // ['blueberry', 'strawberry']
```

#### Word Management

```javascript
trie.delete('apple');
console.log(trie.search('apple')); // false

console.log(trie.countWords());
console.log(trie.listWords());
```

---

## Generating Visualizations

Interactive HTML visualizations help understand trie operations:

* `generate-trie-visualization.html`
* `generate-architecture-diagram.html`
* `generate-fuzzy-search.html`
* `generate-wildcard-search.html`

Open in a browser → Render automatically → Download PNG.

---

## API Reference

### `Trie`

* `insert(word)`
* `search(word)`
* `startsWith(prefix)`
* `autocomplete(prefix)`
* `fuzzySearch(word, maxDistance = 1)`
* `wildcardSearch(pattern)`
* `delete(word)`
* `countWords()`
* `listWords()`
* `loadData(words)`

### `TrieFactory`

* `create(options = {})`

  * `useWorker` (boolean): default `false`
  * Returns `Trie` or `TrieWorkerManager`

### `TrieWorkerManager`

All methods are **async**:

* `initialize()`
* `loadData(words)`
* `insert(word)`
* `search(word)`
* `delete(word)`
* `startsWith(prefix)`
* `autocomplete(prefix)`
* `fuzzySearch(word, maxDistance)`
* `wildcardSearch(pattern)`
* `terminate()`

---

## Browser Compatibility

| Environment | Support         |
| ----------- | --------------- |
| Chrome      | ✅ 55+           |
| Firefox     | ✅ 52+           |
| Safari      | ✅ 10+           |
| Edge        | ✅ 79+           |
| Node.js     | ✅ 10.5+         |
| IE          | ❌ Not supported |

---

## Contributing

1. Fork → Clone → Create branch
2. Make changes → Add tests
3. Run tests: `npm test`
4. Submit PR

---

## License

MIT License - see [LICENSE](./LICENSE)

## Author

Bharath Kumar
