import { Trie } from "../src/index.js";
import {TrieWorkerManager} from "../src/trieWorkerManager.js";
import {TrieFactory} from "../src/trieFactory.js";



describe("Trie", () => {
  test("insert and search words", () => {
    const trie = new Trie();
    trie.insert("apple");
    trie.insert("app");

    expect(trie.search("apple")).toBe(true);
    expect(trie.search("app")).toBe(true);
    expect(trie.search("appl")).toBe(false);
    expect(trie.search("banana")).toBe(false);
  });

  test("delete words", () => {
    const trie = new Trie();
    trie.insert("apple");
    trie.insert("app");
    trie.insert("application");
    
    expect(trie.search("apple")).toBe(true);
    
    // Delete a word
    trie.delete("apple");
    expect(trie.search("apple")).toBe(false);
    expect(trie.search("app")).toBe(true);
    expect(trie.search("application")).toBe(true);
    
    // Delete non-existent word
    trie.delete("apples");
    expect(trie.search("app")).toBe(true);
    
    // Delete prefix of other words
    trie.delete("app");
    expect(trie.search("app")).toBe(false);
    expect(trie.search("application")).toBe(true);
  });

  test("startsWith prefix", () => {
    const trie = new Trie();
    trie.insert("apple");
    trie.insert("app");
    
    expect(trie.startsWith("app")).toBe(true);
    expect(trie.startsWith("ap")).toBe(true);
    expect(trie.startsWith("appl")).toBe(true);
    expect(trie.startsWith("banana")).toBe(false);
  });

  test("autocomplete suggestions", () => {
    const trie = new Trie();
    ["apple", "app", "application", "apartment", "banana"].forEach(w => trie.insert(w));
    
    const suggestions = trie.autocomplete("ap");
    expect(suggestions).toContain("apple");
    expect(suggestions).toContain("app");
    expect(suggestions).toContain("application");
    expect(suggestions).toContain("apartment");
    expect(suggestions).not.toContain("banana");
    
    expect(trie.autocomplete("z")).toEqual([]);
  });

  test("fuzzy search", () => {
    const trie = new Trie();
    ["apple", "app", "application", "banana", "bath"].forEach(w => trie.insert(w));
    
    // Max distance 1
    expect(trie.fuzzySearch("aple", 1)).toContain("apple");
    expect(trie.fuzzySearch("appl", 1)).toContain("apple");
    expect(trie.fuzzySearch("appla", 1)).toContain("apple");
    
    // Max distance 2
    expect(trie.fuzzySearch("apl", 2)).toContain("apple");
    expect(trie.fuzzySearch("baths", 1)).toContain("bath");
    
    // No matches
    expect(trie.fuzzySearch("xyz", 1)).toEqual([]);
  });

  test("wildcard search", () => {
    const trie = new Trie();
    ["apple", "app", "application", "banana", "bat"].forEach(w => trie.insert(w));
    
    expect(trie.wildcardSearch("app.e")).toContain("apple");
    expect(trie.wildcardSearch(".pple")).toContain("apple");
    expect(trie.wildcardSearch("app..")).toEqual(["apple"]);
    expect(trie.wildcardSearch("ba.")).toContain("bat");
    expect(trie.wildcardSearch("...")).toContain("app");
    expect(trie.wildcardSearch("...")).toContain("bat");
  });

  test("count words", () => {
    const trie = new Trie();
    expect(trie.countWords()).toBe(0);
    
    trie.insert("apple");
    expect(trie.countWords()).toBe(1);
    
    trie.insert("app");
    trie.insert("banana");
    expect(trie.countWords()).toBe(3);
    
    trie.delete("app");
    expect(trie.countWords()).toBe(2);
  });

  test("list all words", () => {
    const trie = new Trie();
    ["apple", "app", "banana", "bat"].forEach(w => trie.insert(w));
    
    const words = trie.listWords();
    expect(words).toHaveLength(4);
    expect(words).toContain("apple");
    expect(words).toContain("app");
    expect(words).toContain("banana");
    expect(words).toContain("bat");
  });

  test("suggest words by prefix", () => {
    const trie = new Trie();
    ["apple", "app", "banana", "bat"].forEach(w => trie.insert(w));

    expect(trie.autocomplete("ap")).toEqual(expect.arrayContaining(["app", "apple"]));
    expect(trie.autocomplete("ba")).toEqual(expect.arrayContaining(["banana", "bat"]));
    expect(trie.autocomplete("z")).toEqual([]);
  });
  
  test("insert and search with non-alpha characters", () => {
    const trie = new Trie();
    trie.insert("hello123");
    trie.insert("hello-world");
    trie.insert("$pecial");
    trie.insert("email@example.com");
  
    expect(trie.search("hello123")).toBe(true);
    expect(trie.search("hello-world")).toBe(true);
    expect(trie.search("$pecial")).toBe(true);
    expect(trie.search("email@example.com")).toBe(true);
    
    expect(trie.search("hello")).toBe(false);
    expect(trie.search("hello-")).toBe(false);
    expect(trie.search("pecial")).toBe(false);
  });
  
  test("suggest words with non-alpha prefixes", () => {
    const trie = new Trie();
    ["hello123", "hello-world", "$pecial", "$$money", "$dollar", "email@example.com"].forEach(w => trie.insert(w));
  
    expect(trie.autocomplete("hello")).toEqual(expect.arrayContaining(["hello123", "hello-world"]));
    expect(trie.autocomplete("$")).toEqual(expect.arrayContaining(["$pecial", "$$money", "$dollar"]));
    expect(trie.autocomplete("email@")).toEqual(["email@example.com"]);
    expect(trie.autocomplete("123")).toEqual([]);
  });
  
  test("empty trie operations", () => {
    const trie = new Trie();
    
    expect(trie.search("anything")).toBe(false);
    expect(trie.startsWith("anything")).toBe(false);
    expect(trie.autocomplete("anything")).toEqual([]);
    expect(trie.fuzzySearch("anything")).toEqual([]);
    expect(trie.wildcardSearch("....")).toEqual([]);
    expect(trie.countWords()).toBe(0);
    expect(trie.listWords()).toEqual([]);
  });


});

// Add a new test suite specifically for TrieWorkerManager
describe("TrieWorkerManager", () => {
  let manager;
  
  beforeEach(async () => {
    manager = new TrieWorkerManager();
    await manager.initialize();
  });
  
  afterEach(async() => {
    if (manager) {
     await manager.terminate();
    }
  });
  
  test("should initialize correctly", async () => {
    expect(manager.isInitialized).toBe(true);
    expect(manager.worker).not.toBeNull();
  });
  
  test("should load data correctly", async () => {
    const testWords = ["apple", "application", "banana", "box", "car", "cartoon"];
    const result = await manager.loadData(testWords);
    expect(result).toBeDefined();
    expect(result.wordCount).toBe(testWords.length);
    expect(result.status).toBe("loaded");
  });
  
  test("should search for existing words", async () => {
    const testWords = ["apple", "application", "banana", "box", "car", "cartoon"];
    await manager.loadData(testWords);
    
    const exists = await manager.search("apple");
    expect(exists).toBe(true);
    
    const notExists = await manager.search("zebra");
    expect(notExists).toBe(false);
  });
  
  test("should provide autocomplete suggestions", async () => {
    const testWords = ["apple", "application", "banana", "box", "car", "cartoon"];
    await manager.loadData(testWords);
    
    const suggestions = await manager.autocomplete("app");
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions).toContain("apple");
    expect(suggestions).toContain("application");
    expect(suggestions).not.toContain("banana");
    
    const emptySuggestions = await manager.autocomplete("xyz");
    expect(emptySuggestions).toEqual([]);
  });
  
  test("should perform fuzzy search", async () => {
    const testWords = ["apple", "application", "banana", "box", "car", "cartoon"];
    await manager.loadData(testWords);
    
    const fuzzyResults = await manager.fuzzySearch("aple", 1);
    expect(Array.isArray(fuzzyResults)).toBe(true);
    expect(fuzzyResults.some(r => r.word === "apple")).toBe(true);
    
    const noResults = await manager.fuzzySearch("xyz", 1);
    expect(noResults).toEqual([]);
  });
  
  test("should perform wildcard search", async () => {
    const testWords = ["apple", "application", "banana", "box", "car", "cartoon"];
    await manager.loadData(testWords);
    
    const wildcardResults = await manager.wildcardSearch("ca*");
    expect(Array.isArray(wildcardResults)).toBe(true);
    expect(wildcardResults).toContain("car");
    expect(wildcardResults).toContain("cartoon");
    expect(wildcardResults).not.toContain("apple");
    
    const noResults = await manager.wildcardSearch("xyz*");
    expect(noResults).toEqual([]);
  });
  
  test("should handle empty inputs", async () => {
    const testWords = ["apple", "application", "banana", "box", "car", "cartoon"];
    await manager.loadData(testWords);
    
    const emptySearch = await manager.search("");
    expect(emptySearch).toBe(false);
    
    const emptyAutocomplete = await manager.autocomplete("");
    expect(Array.isArray(emptyAutocomplete)).toBe(true);
    
    const emptyFuzzy = await manager.fuzzySearch("", 1);
    expect(Array.isArray(emptyFuzzy)).toBe(true);
    
    const emptyWildcard = await manager.wildcardSearch("");
    expect(Array.isArray(emptyWildcard)).toBe(true);
  });
  
  test("should handle special characters", async () => {
    const specialWords = ["apple", "app-store", "banana!", "@car", "#box"];
    await manager.loadData(specialWords);
    
    const found = await manager.search("app-store");
    expect(found).toBe(true);
    
    const specialSearch = await manager.search("@car");
    expect(specialSearch).toBe(true);
    
    const specialFuzzy = await manager.fuzzySearch("@cr", 1);
    expect(specialFuzzy.some(r => r.word === "@car")).toBe(true);
    
    const specialWildcard = await manager.wildcardSearch("*ana*");
    expect(specialWildcard).toContain("banana!");
  });
  
  // Add test for performance with large dataset - commented out by default
  // as it might take longer to run
  
  test("should handle large datasets efficiently", async () => {
    // Generate large word list
    const largeWordList = [];
    for (let i = 0; i < 1000; i++) {
      largeWordList.push(`word${i}`);
    }
    
    await manager.loadData(largeWordList);
    
    const found = await manager.search("word500");
    expect(found).toBe(true);
    
    const suggestions = await manager.autocomplete("word5");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions).toContain("word500");
  });  // Increased timeout for this test
  
});

// Add test suite for TrieFactory
describe("TrieFactory", () => {
  // Track any worker-based instances to clean them up
  let workersToCleanup = [];
  
  // Clean up any worker instances after each test
  afterEach(async () => {
    if (workersToCleanup.length > 0) {
      for (const worker of workersToCleanup) {
        if (worker && typeof worker.terminate === 'function') {
          await worker.terminate();
        }
      }
      workersToCleanup = [];
    }
  });
  
  test("should create a synchronous Trie instance by default", () => {
    const trie = TrieFactory.create();
    
    // Verify it's a synchronous implementation by checking return types
    expect(trie.insert("test")).toBeUndefined(); // Sync operations return undefined
    expect(trie.search("test")).toBe(true); // Direct boolean result
    
    // Check core functionality works
    expect(trie.search("nonexistent")).toBe(false);
    trie.insert("hello");
    expect(trie.search("hello")).toBe(true);
    
    // Verify it's not a promise-based API
    expect(trie.search("test") instanceof Promise).toBe(false);
  });
  
  test("should handle bulk data loading in both implementations", async () => {
    const testData = ["apple", "banana", "cherry", "date", "elderberry"];
    
    // Test synchronous implementation
    const syncTrie = TrieFactory.create();
    syncTrie.loadData(testData);
    
    expect(syncTrie.search("apple")).toBe(true);
    expect(syncTrie.search("banana")).toBe(true);
    expect(syncTrie.search("grape")).toBe(false);
    
    // Test worker implementation
    const asyncTrie = TrieFactory.create({ useWorker: true });
    // Track for cleanup
    workersToCleanup.push(asyncTrie);
    // Also track in global list
    
    await asyncTrie.loadData(testData);
    
    expect(await asyncTrie.search("apple")).toBe(true);
    expect(await asyncTrie.search("banana")).toBe(true);
    expect(await asyncTrie.search("grape")).toBe(false);

    await asyncTrie.terminate();
  });
  
  test("should provide consistent results between implementations", async () => {
    const testWords = ["computer", "computing", "compute", "compost", "compare"];
    
    // Setup both implementations
    const syncTrie = TrieFactory.create();
    syncTrie.loadData(testWords);
    
    const asyncTrie = TrieFactory.create({ useWorker: true });
    // Track for cleanup
    workersToCleanup.push(asyncTrie);
    // Also track in global list
    
    await asyncTrie.loadData(testWords);
    
    // Test exact search
    for (const word of testWords) {
      expect(syncTrie.search(word)).toBe(true);
      expect(await asyncTrie.search(word)).toBe(true);
    }
    
    // Test prefix search
    const syncPrefixResults = syncTrie.autocomplete("comp");
    const asyncPrefixResults = await asyncTrie.autocomplete("comp");
    expect(syncPrefixResults.sort()).toEqual(expect.arrayContaining(["compute", "computer", "computing", "compost", "compare"].sort()));
    expect(asyncPrefixResults.sort()).toEqual(expect.arrayContaining(["compute", "computer", "computing", "compost", "compare"].sort()));
    
    // Test fuzzy search
    const syncFuzzyResults = syncTrie.fuzzySearch("compter", 2);
    const asyncFuzzyResults = await asyncTrie.fuzzySearch("compter", 2);
    expect(syncFuzzyResults.includes("computer")).toBe(true);
    expect(asyncFuzzyResults.some(r => r === "computer" || r.word === "computer")).toBe(true);
    await asyncTrie.terminate();
  });

  // New tests being added
  
  test("should respect autoInitialize option for worker implementation", async () => {
    // Create worker with autoInitialize=false
    const asyncTrie = TrieFactory.create({ useWorker: true, autoInitialize: false });
    workersToCleanup.push(asyncTrie);
    
    // Worker should not be initialized yet
    expect(asyncTrie.isInitialized).toBe(false);
    expect(asyncTrie.worker).toBeNull();
    
    // Manually initialize
    await asyncTrie.initialize();
    
    // Now worker should be initialized
    expect(asyncTrie.isInitialized).toBe(true);
    expect(asyncTrie.worker).not.toBeNull();
    
    // Functionality should work after manual initialization
    await asyncTrie.loadData(["test"]);
    expect(await asyncTrie.search("test")).toBe(true);
    
    await asyncTrie.terminate();
  });
  
  test("should create multiple independent worker instances", async () => {
    // Create two worker instances
    const asyncTrie1 = TrieFactory.create({ useWorker: true });
    const asyncTrie2 = TrieFactory.create({ useWorker: true });
    
    workersToCleanup.push(asyncTrie1, asyncTrie2);
    
    // Load different data into each instance
    await asyncTrie1.loadData(["apple", "banana"]);
    await asyncTrie2.loadData(["cherry", "date"]);
    
    // Each instance should only have its own data
    expect(await asyncTrie1.search("apple")).toBe(true);
    expect(await asyncTrie1.search("cherry")).toBe(false);
    
    expect(await asyncTrie2.search("cherry")).toBe(true);
    expect(await asyncTrie2.search("apple")).toBe(false);
    
    // Clean up
    await asyncTrie1.terminate();
    await asyncTrie2.terminate();
  });
  
  test("should handle initialization/termination cycles correctly", async () => {
    // Create and immediately terminate
    const asyncTrie = TrieFactory.create({ useWorker: true });
    await asyncTrie.terminate();
    
    // Should be able to re-initialize the same instance
    await asyncTrie.initialize();
    expect(asyncTrie.isInitialized).toBe(true);
    
    // Should work after re-initialization
    await asyncTrie.loadData(["reinitialized"]);
    expect(await asyncTrie.search("reinitialized")).toBe(true);
    
    // Clean up
    workersToCleanup.push(asyncTrie);
  });
  
  test("should handle empty data correctly in both implementations", async () => {
    const syncTrie = TrieFactory.create();
    const asyncTrie = TrieFactory.create({ useWorker: true });
    workersToCleanup.push(asyncTrie);
    
    // Test with empty arrays
    syncTrie.loadData([]);
    await asyncTrie.loadData([]);
    
    // Operations should work on empty tries
    expect(syncTrie.search("anything")).toBe(false);
    expect(await asyncTrie.search("anything")).toBe(false);
    
    expect(syncTrie.autocomplete("a")).toEqual([]);
    expect(await asyncTrie.autocomplete("a")).toEqual([]);
    
    // Clean up
    await asyncTrie.terminate();
  });
  
  test("should support all trie operations across both implementations", async () => {
    const syncTrie = TrieFactory.create();
    const asyncTrie = TrieFactory.create({ useWorker: true });
    workersToCleanup.push(asyncTrie);
    
    // Populate data
    const testWords = ["testing", "tested", "tester"];
    syncTrie.loadData(testWords);
    await asyncTrie.loadData(testWords);
    
    // Test various operations
    const operations = [
      // Operation name, args, expected result pattern
      ["search", ["testing"], true],
      ["search", ["nonexistent"], false],
      ["autocomplete", ["test"], expect.arrayContaining(["testing", "tested", "tester"])],
      ["fuzzySearch", ["testin", 1], expect.arrayContaining(["testing"])],
      // Note: wildcardSearch implementation differs between sync and worker versions
    ];
    
    for (const [op, args, expected] of operations) {
      // Test synchronous implementation
      const syncResult = syncTrie[op](...args);
      expect(syncResult).toEqual(expected);
      
      // Test asynchronous implementation
      const asyncResult = await asyncTrie[op](...args);
      
      // Handle special case of fuzzySearch which returns different formats
      if (op === "fuzzySearch") {
        if (Array.isArray(asyncResult)) {
          // Handle case where asyncResult might be array of objects with word property
          const normalizedResult = asyncResult.map(r => typeof r === 'string' ? r : r.word);
          expect(normalizedResult).toEqual(expect.arrayContaining(testWords.filter(w => expected.asymmetricMatch([w]))));
        }
      } else {
        expect(asyncResult).toEqual(expected);
      }
    }
    
    await asyncTrie.terminate();
  });
});