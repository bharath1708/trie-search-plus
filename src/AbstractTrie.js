/**
 * Abstract base class that defines the common interface for all Trie implementations.
 * This serves as a contract that both synchronous and worker-based implementations must follow.
 */
export class AbstractTrie {
  /**
   * Insert a word into the trie
   * @param {string} word - The word to insert
   * @returns {Promise<void>|void} - May return a Promise for async implementations
   */
  insert(word) {
    throw new Error('Method insert() must be implemented');
  }

  /**
   * Search for an exact word in the trie
   * @param {string} word - The word to search for
   * @returns {Promise<boolean>|boolean} - True if found, false otherwise
   */
  search(word) {
    throw new Error('Method search() must be implemented');
  }

  /**
   * Delete a word from the trie
   * @param {string} word - The word to delete
   * @returns {Promise<void>|void} - May return a Promise for async implementations
   */
  delete(word) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Check if any words in the trie start with the given prefix
   * @param {string} prefix - The prefix to check
   * @returns {Promise<boolean>|boolean} - True if any word starts with the prefix
   */
  startsWith(prefix) {
    throw new Error('Method startsWith() must be implemented');
  }

  /**
   * Get autocomplete suggestions for a prefix
   * @param {string} prefix - The prefix to autocomplete
   * @returns {Promise<string[]>|string[]} - Array of matching words
   */
  autocomplete(prefix) {
    throw new Error('Method autocomplete() must be implemented');
  }

  /**
   * Perform a fuzzy search with Levenshtein distance
   * @param {string} word - The word to search for
   * @param {number} [maxDistance=1] - Maximum edit distance
   * @returns {Promise<string[]>|string[]} - Array of matching words
   */
  fuzzySearch(word, maxDistance = 1) {
    throw new Error('Method fuzzySearch() must be implemented');
  }

  /**
   * Search using wildcards ('.' matches any character)
   * @param {string} pattern - The pattern to search for
   * @returns {Promise<string[]>|string[]} - Array of matching words
   */
  wildcardSearch(pattern) {
    throw new Error('Method wildcardSearch() must be implemented');
  }

  /**
   * Load data into the trie
   * @param {string[]} words - Array of words to load
   * @returns {Promise<void>|void} - May return a Promise for async implementations
   */
  loadData(words) {
    throw new Error('Method loadData() must be implemented');
  }
}

export default AbstractTrie;