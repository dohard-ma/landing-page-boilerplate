// import PDFJSWorker from 'pdfjs-dist/build/pdf.worker.js';
export const PDFJSWorker = require('pdfjs-dist/build/pdf.worker.js').WorkerMessageHandler;

(typeof window !== 'undefined' ? window : ({} as any)).PDFJSWorker = PDFJSWorker;
