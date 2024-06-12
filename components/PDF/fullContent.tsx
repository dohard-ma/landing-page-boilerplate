// 全屏显示
export default function fullContent(src: any) {
    return `<html>
                 <body>
                    <div id="canvas_list"></div>
                 </body>
                 <style>
                     canvas{display: block;margin: 0 auto;}
                 </style>
                 <script src="https://mozilla.github.io/pdf.js/build/pdf.js"></script>
                 <script src="https://mozilla.github.io/pdf.js/build/pdf.worker.js"></script>
                 <script>
                       let url = '${src}';
                       let PDFJS = pdfjsLib;
                       let pdfDoc = null,
                           page_count = 0,
                           pageNum = 1,
                           pageRendering = false,
                           pageNumPending = null,
                           page_canvas_list = [],
                           scale = 1.5;
                       function renderPage(num) {
                           pageRendering = true;
                           pdfDoc.getPage(num).then(function (page) {
                               let canvasList = document.getElementById('canvas_list');
                               let canvas = document.createElement('canvas');
                               page_canvas_list[num - 1] = canvas;
                               if (page_canvas_list.length === page_count) page_canvas_list.map((item) => canvasList.appendChild(item))
                               let ctx = canvas.getContext('2d');
                               let viewport = page.getViewport({scale});
                               canvas.height = viewport.height;
                               canvas.width = viewport.width;
                               let renderContext = {
                                   canvasContext: ctx,
                                   viewport: viewport
                               };
                               let renderTask = page.render(renderContext);
                               renderTask.promise.then(function () {
                                   pageRendering = false;
                                   if (pageNumPending !== null) {
                                       renderPage(pageNumPending);
                                       pageNumPending = null;
                                   }
                               });
                           });
                       }
                       function queueRenderPage(num) {
                           if (pageRendering) {
                               pageNumPending = num;
                           } else {
                               renderPage(num);
                           }
                       }
                       PDFJS.getDocument(url).promise.then(function (pdfDoc_) {
                           pdfDoc = pdfDoc_;
                           page_count = pdfDoc.numPages;
                           for (let $i = 1; $i <= pdfDoc.numPages; $i++) {
                               renderPage($i);
                           }
                       });
                        </script>
           </html>`;
}
