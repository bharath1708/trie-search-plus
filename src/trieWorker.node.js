import { Worker, parentPort } from 'node:worker_threads';
import { handleWorkerMessage } from './trieWorker.js';

if (parentPort) {
  parentPort.on('message', (data) => {
    try {
      // Special handling for terminate action
      if (data.action === 'terminate') {
        // Allow any pending operations to complete
        setTimeout(() => {
          process.exit(0); // Force exit the worker thread
        }, 10);
        return;
      }
      
      handleWorkerMessage({ 
        ...data, 
        postMessage: (message) => {
          parentPort.postMessage(message);
        }
      });
    } catch (error) {
      parentPort.postMessage({ status: 'error', error: error.message });
    }
  });
}