// trieWorker.js
import Trie from './trie.js';

let trie = new Trie();

export function handleWorkerMessage({ action, data, postMessage }) {
  switch (action) {
    case 'load':
      for (const word of data) trie.insert(word);
      postMessage({ status: 'loaded', wordCount: trie.countWords() });
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
      const fuzzyResults = trie.fuzzySearch(data.word, data.maxDistance);
      const formattedResults = fuzzyResults.map(word => ({ word }));
      postMessage({ status: 'fuzzy-complete', results: formattedResults });
      break;

    case 'wildcard':
      const results = wildcardSearchInTrie(trie, data);
      postMessage({ status: 'wildcard-complete', results });
      break;

    default:
      postMessage({ status: 'error', message: 'Unknown action' });
  }
}

// Helper function to perform wildcard search with '*' character support
function wildcardSearchInTrie(trie, pattern) {
  if (!pattern) return [];
  
  const regexPattern = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
  
  const allWords = trie.listWords();
  
  return allWords.filter(word => regexPattern.test(word));
}
