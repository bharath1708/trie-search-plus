/**
 * Factory for creating Trie instances based on user preferences.
 */
import Trie from './trie.js';
import TrieWorkerManager from './trieWorkerManager.js';

export class TrieFactory {
  /**
   * Creates a new Trie instance
   * @param {Object} options - Configuration options
   * @param {boolean} [options.useWorker=false] - Whether to use a worker-based implementation
   * @param {boolean} [options.autoInitialize=true] - For worker implementation, whether to initialize it immediately
   * @returns {import('./AbstractTrie').AbstractTrie} A trie instance
   */
  static create(options = {}) {
    const { useWorker = false, autoInitialize = true } = options;
    
    if (useWorker) {
      const workerTrie = new TrieWorkerManager();
      if (autoInitialize) {
        // Start initializing the worker
        workerTrie.initialize();
      }
      return workerTrie;
    } else {
      return new Trie();
    }
  }
}

export default TrieFactory;