import { Worker, parentPort } from 'node:worker_threads';
import { handleWorkerMessage } from './trieWorker.js';

if (parentPort) {
  parentPort.on('message', (data) => {
    try {
      console.log('Node worker received:', data);
      handleWorkerMessage({ 
        ...data, 
        postMessage: (message) => {
          console.log('Node worker sending response:', message);
          parentPort.postMessage(message);
        }
      });
    } catch (error) {
      console.error('Error in worker:', error);
      parentPort.postMessage({ status: 'error', error: error.message });
    }
  });
}