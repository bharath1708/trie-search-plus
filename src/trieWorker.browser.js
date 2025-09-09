import { handleWorkerMessage } from './trieWorker.js';

self.onmessage = (e) => {
  handleWorkerMessage({ ...e.data, postMessage: self.postMessage.bind(self) });
};
