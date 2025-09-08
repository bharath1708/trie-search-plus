// trieWorker.js
import Trie from './trie.js';

let trie = new Trie();

export function handleWorkerMessage({ action, data, postMessage }) {
  console.log('Worker received action:', action);
  switch (action) {
    case 'load':
      console.log('Worker loading data:', data.length, 'words');
      for (const word of data) trie.insert(word);
      console.log('Worker finished loading data. Total words:', trie.countWords());
      postMessage({ status: 'loaded', wordCount: trie.countWords() });
      console.log('Worker sent loaded message');
      break;

    case 'insert':
      trie.insert(data);
      postMessage({ status: 'insert-complete', success: true });
      break;

    case 'search':
      postMessage({ status: 'search-complete', found: trie.search(data) });
      break;

    case 'autocomplete':
      postMessage({ status: 'autocomplete-complete', suggestions: trie.autocomplete(data) });
      break;

    case 'fuzzy':
      // Convert string results to objects with a word property to match the test expectations
      const fuzzyResults = trie.fuzzySearch(data.word, data.maxDistance);
      const formattedResults = fuzzyResults.map(word => ({ word }));
      postMessage({ status: 'fuzzy-complete', results: formattedResults });
      break;

    case 'wildcard':
      // Instead of just replacing wildcard chars, implement a more powerful wildcard search
      const results = wildcardSearchInTrie(trie, data);
      postMessage({ status: 'wildcard-complete', results });
      break;

    default:
      postMessage({ status: 'error', message: 'Unknown action' });
  }
}

// Helper function to perform wildcard search with '*' character support
function wildcardSearchInTrie(trie, pattern) {
  // If pattern is empty, return empty array
  if (!pattern) return [];
  
  // Convert the pattern to a regex pattern
  // * matches any sequence of characters (including zero)
  const regexPattern = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
  
  // Get all words in the trie
  const allWords = trie.listWords();
  
  // Filter words that match the regex pattern
  return allWords.filter(word => regexPattern.test(word));
}
