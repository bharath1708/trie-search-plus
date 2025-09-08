import { createTrieWorker, attachWorkerMessageHandler } from './trieWorkerFactory.js';
import { AbstractTrie } from './AbstractTrie.js';

export class TrieWorkerManager extends AbstractTrie {
  constructor() {
    super();
    this.worker = null;
    this.callbacks = {};
    this.isInitialized = false;
  }

  async initialize() {
    if (this.worker) return;
    this.worker = await createTrieWorker();
    attachWorkerMessageHandler(this.worker, this.callbacks);
    this.isInitialized = true;
  }

  async loadData(words) {
    if (!this.isInitialized) await this.initialize();
    return new Promise((resolve) => {
      this.callbacks['loaded'] = resolve;
      this.worker.postMessage({ action: 'load', data: words });
    });
  }

  async search(word) {
    if (!this.isInitialized) await this.initialize();

    return new Promise((resolve) => {
      this.callbacks['search-complete'] = (data) => resolve(data.found);
      this.worker.postMessage({ action: 'search', data: word });
    });
  }

  async autocomplete(prefix) {
    if (!this.isInitialized) await this.initialize();

    return new Promise((resolve) => {
      this.callbacks['autocomplete-complete'] = (data) => resolve(data.suggestions);
      this.worker.postMessage({ action: 'autocomplete', data: prefix });
    });
  }

  async fuzzySearch(word, maxDistance = 1) {
    if (!this.isInitialized) await this.initialize();

    return new Promise((resolve) => {
      this.callbacks['fuzzy-complete'] = (data) => resolve(data.results);
      this.worker.postMessage({ action: 'fuzzy', data: { word, maxDistance } });
    });
  }

  async wildcardSearch(pattern) {
    if (!this.isInitialized) await this.initialize();

    return new Promise((resolve) => {
      this.callbacks['wildcard-complete'] = (data) => resolve(data.results);
      this.worker.postMessage({ action: 'wildcard', data: pattern });
    });
  }

  async insert(word) {
    if (!this.isInitialized) await this.initialize();
    
    return new Promise((resolve) => {
      this.callbacks['insert-complete'] = resolve;
      this.worker.postMessage({ action: 'insert', data: word });
    });
  }

  async delete(word) {
    if (!this.isInitialized) await this.initialize();
    
    return new Promise((resolve) => {
      this.callbacks['delete-complete'] = resolve;
      this.worker.postMessage({ action: 'delete', data: word });
    });
  }

  async startsWith(prefix) {
    if (!this.isInitialized) await this.initialize();
    
    return new Promise((resolve) => {
      this.callbacks['startswith-complete'] = (data) => resolve(data.hasPrefix);
      this.worker.postMessage({ action: 'startsWith', data: prefix });
    });
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

export default TrieWorkerManager;
