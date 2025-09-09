/**
 * @fileoverview Main export file for the trie-search-plus package.
 * This module exposes the Trie data structure implementations.
 */

import Trie from "./trie.js";
import TrieWorkerManager from "./trieWorkerManager.js";
import { AbstractTrie } from "./AbstractTrie.js";
import { TrieFactory } from "./trieFactory.js";

/**
 * @namespace TrieSearchPlus
 */
export { Trie, TrieWorkerManager, AbstractTrie, TrieFactory };
export default TrieFactory; // Default export is the factory for easy instance creation