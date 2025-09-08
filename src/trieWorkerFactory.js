export async function createTrieWorker() {
    if (typeof window !== 'undefined') {
      // Browser
      return new Worker(new URL('./trieWorker.browser.js', import.meta.url), { type: 'module' });
    } else {
      // Node.js
      const { Worker } = await import('node:worker_threads');
      return new Worker(new URL('./trieWorker.node.js', import.meta.url), { type: 'module' });
    }
  }
  


  /**
 * Attach a unified message handler to a worker (browser or Node.js)
 * @param {Worker} worker - Worker instance (browser or Node.js)
 * @param {Object} callbacks - Dictionary of callbacks keyed by status
 */
export function attachWorkerMessageHandler(worker, callbacks) {
    const handleMessage = (data) => {
      const msg = data?.data || data; // browser uses e.data, Node.js sends raw data
      const { status } = msg;
  
      if (!status) {
        console.warn('Worker message missing status:', msg);
        return;
      }
  
      if (callbacks[status]) {
        callbacks[status](msg);       // resolve the promise or call callback
        delete callbacks[status];     // one-time callback
      } else {
        console.warn(`No callback registered for status: ${status}`);
      }
    };
  
    if (typeof window === 'undefined') {
      // Node.js environment (worker_threads)
      worker.on('message', handleMessage);
    } else {
      // Browser environment
      worker.onmessage = handleMessage;
    }
  }