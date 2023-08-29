function chunkString(str, length) {
    const regex = new RegExp(`.{1,${length}}`, 'g');
    return str.match(regex) || [];
}

function extractTextFromPDF(pdfData, callback) {
    // Ensure the workerSrc is set (required for the library to function).
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

    pdfjsLib.getDocument({data: pdfData}).promise.then((pdf) => {
        let totalPages = pdf.numPages;
        let textPromises = [];

        for (let i = 1; i <= totalPages; i++) {
            textPromises.push(pdf.getPage(i).then(page => {
                return page.getTextContent().then(text => {
                    return text.items.map(item => item.str).join(' ');
                });
            }));
        }

        Promise.all(textPromises).then(texts => {
            callback(texts.join('\n'));
        });

    }).catch(error => {
        console.error('Error while reading the PDF:', error);
    });
}

function loadPDF() {
    const pdfFile = document.getElementById('pdfFile').files[0];
    if (pdfFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const pdfData = new Uint8Array(event.target.result);
            extractTextFromPDF(pdfData, (text) => {
                const chunkedTexts = chunkString(text, 100);
                document.getElementById('pdfText').textContent = chunkedTexts.join('\n\n');
            });
        };
        reader.readAsArrayBuffer(pdfFile);
    }
}
