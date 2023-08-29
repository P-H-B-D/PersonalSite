let session; // Declare the session at a wider scope so it's accessible later

async function loadModel() {
    const start=performance.now();
    console.log("Model loading!");
    const modelUrl = 'https://content.phbd.xyz/model.onnx'; // Replace with your R2 bucket URL
    const response = await fetch(modelUrl);
    const modelBuffer = await response.arrayBuffer();
    const modelArrayBuffer = new Uint8Array(modelBuffer);

    session = await ort.InferenceSession.create(modelArrayBuffer, { executionProviders: ['wasm'] });
    const end=performance.now();
    console.log("Model loaded! Took "+(end-start)+"ms");
    document.getElementById("modelLoadingText").textContent = "Model Loaded; Ready for inference.";
    document.getElementById("userInput").style.display = "inline-block";
    document.getElementById("submitBtn").style.display = "inline-block";
    document.getElementById("embeddingTextBoxes").style.display = "flex";
    document.getElementById("embeddingTable").style.display = "block";
    
}


window.onload = loadModel;


// Attach an event listener to a PDF upload button



var xhr = new XMLHttpRequest();
xhr.open('GET', 'tokenizer.json', true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var jsonText = xhr.responseText;
        var jsonData = JSON.parse(jsonText);
        const tokenizerJSON = jsonData;

        document.getElementById("pdfFileButton").addEventListener("click", loadPDF);
        
        


        // Hide "Loading..." text once JSON is loaded
        document.getElementById("loadingText").textContent = "Tokenizer Loaded.";
        const dataRows = [];
        // Function to compute cosine similarity
        function cosineSimilarity(v1, v2) {
            let dotProduct = 0.0;
            let magnitude1 = 0.0;
            let magnitude2 = 0.0;

            for (let i = 0; i < v1.length; i++) {
                dotProduct += v1[i] * v2[i];
                magnitude1 += v1[i] * v1[i];
                magnitude2 += v2[i] * v2[i];
            }

            magnitude1 = Math.sqrt(magnitude1);
            magnitude2 = Math.sqrt(magnitude2);

            if (magnitude1 === 0 || magnitude2 === 0) {
                return 0;
            }

            return dotProduct / (magnitude1 * magnitude2);
        }



        function extractTokens(input) {
            var regex = /\w+(?:'\w+)?|[^\w\s]/g;
            var matches = input.match(regex);
            return matches;
        }

        function cvtToTokens(jsString) {
            let tokenValues = extractTokens(jsString);
            tokenValues = tokenValues.filter(value => value !== " " && value !== "\n");
            const tokenization = []
            tokenization.push(101);
            tokenValues.map((value) => {
                value = value.toLowerCase();
                if (tokenizerJSON.model.vocab[value] === undefined) {
                    tokenization.push(100); //UNK
                }
                else {
                    tokenization.push(tokenizerJSON.model.vocab[value])
                }
            });
            tokenization.push(102);
            return tokenization;
        }

        function normalize(v) {
            if (v.length === 0 || v[0].length === 0) return [];

            const norms = v.map(vec =>
                Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0)) || 1e-12
            );

            const result = new Float32Array(v.length * v[0].length);
            for (let i = 0; i < v.length; i++) {
                for (let j = 0; j < v[0].length; j++) {
                    result[i * v[0].length + j] = v[i][j] / norms[i];
                }
            }

            return result;
        }

        function meanPoolingWithAttentionWeighting(lastHiddenState, attentionMask) {
            const sentenceCount = lastHiddenState.dims[0];
            const tokenCount = lastHiddenState.dims[1];
            const hiddenSize = lastHiddenState.dims[2];
            const lastHiddenStateData = lastHiddenState.data;
            const attentionMaskData = attentionMask.data;

            const embeddings = new Array(sentenceCount);
            for (let i = 0; i < sentenceCount; i++) {
                const embedding = new Float32Array(hiddenSize).fill(0);
                let sumAttention = 0;

                for (let j = 0; j < tokenCount; j++) {
                    const attentionValue = Number(attentionMaskData[i * tokenCount + j]);
                    sumAttention += attentionValue;

                    for (let k = 0; k < hiddenSize; k++) {
                        embedding[k] += lastHiddenStateData[i * tokenCount * hiddenSize + j * hiddenSize + k] * attentionValue;
                    }
                }

                if (sumAttention === 0) sumAttention = 1e-9;
                for (let k = 0; k < hiddenSize; k++) {
                    embedding[k] /= sumAttention;
                }

                embeddings[i] = embedding;
            }

            return normalize(embeddings);
        }


        function generateTensor(data, dataType, dims) {
            return new ort.Tensor(dataType, data, dims);
        }


        async function embed(inputString, displayPerf=false) {
            start = performance.now();

            let unpadded = cvtToTokens(inputString).map(val => {
                return BigInt(val);
            });

            let input_ids = unpadded.concat(new Array(256 - unpadded.length).fill(BigInt(0)));
            let aMask = unpadded.concat(new Array(256 - unpadded.length).fill(BigInt(0))).fill(BigInt(1), 0, unpadded.length);

            const input_ids_Tensor = generateTensor(input_ids, 'int64', [1, 256]);
            const attention_mask_Tensor = generateTensor(aMask, 'int64', [1, 256]);

            const token_type_ids = new Array(256).fill(BigInt(0));
            const token_type_ids_Tensor = generateTensor(token_type_ids, 'int64', [1, 256]);

            const feeds = {
                input_ids: input_ids_Tensor,
                attention_mask: attention_mask_Tensor,
                token_type_ids: token_type_ids_Tensor
            };

            const results = await session.run(feeds);
            const lastHiddenState = results.last_hidden_state;
            const embeddings = meanPoolingWithAttentionWeighting(lastHiddenState, attention_mask_Tensor);
            end = performance.now();
            if(displayPerf){
                document.getElementById('inferenceTime').textContent = "Inference time: " + (end - start).toFixed(3) + " ms";
            }

            return embeddings;
            
        }

        // Import the chunkString function from vdb.js
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
                        
                        // Run embedding on each chunk
                        Promise.all(chunkedTexts.map(chunk => embed(chunk)))
                            .then(embeddingsArray => {
                                // embeddingsArray will contain an array of embeddings for each chunk
                                console.log(embeddingsArray);
                                
                                // Iterate through the embeddingsArray and create data entries for each chunk
                                for (let i = 0; i < embeddingsArray.length; i++) {
                                    const addVector = embeddingsArray[i];
                                    const addName = chunkedTexts[i];
                                    
                                
                                    const newDataEntry = {
                                        id: 27,
                                        embedding: addVector,
                                        content: addName,
                                        cosineSim: null
                                    };
                                    
                                    dataRows.push(newDataEntry);
                                    
                                    const newRow = dataTable.insertRow();
                                    newRow.insertCell().textContent = newDataEntry.id;
                                    const displayPrecision = 5;
                                    newRow.insertCell().textContent = "[" + String(newDataEntry.embedding.slice(0,1)).slice(0,displayPrecision) + "..." + String(newDataEntry.embedding.slice(-1)).slice(0,displayPrecision) + "]";
                                    newRow.insertCell().textContent = newDataEntry.content;
                                    newRow.insertCell().textContent = newDataEntry.cosineSim;
                                }
                                
                                // Clear the input field
                                addNameInput.value = '';
                                const end = performance.now();
                                document.getElementById('addText').textContent = "Add: (Operation Performed in " + (end - start).toFixed(3) + " ms)";
                            });
                    });
                };
                reader.readAsArrayBuffer(pdfFile);
            }
        }
        


        // Attach an event listener to the Submit button
        document.getElementById("submitBtn").addEventListener("click", function () {

            var inputString = document.getElementById("userInput").value; // Get user input
            embed(inputString,true).then(embeddings=>{
                const first5 = embeddings.slice(0, 5);
                const last5 = embeddings.slice(-5);
                // Combine them into a string
                const displayText = '[' + first5.join(', ') + ' ... ' + last5.join(', ') + ']';

                // Set that string as the text content of the new HTML element
                document.getElementById('vectorEntries').textContent = displayText; // remove when adding to the table view

            }); // Call main function with user input and print the output vector to console
            

        });
        const dataTable = document.getElementById('dataTable');
        const addNameInput = document.getElementById('addName');
        const addForm = document.getElementById('addForm');
        const searchForm = document.getElementById('searchForm');

        // Create and populate the header
        const header = dataTable.insertRow();
        header.insertCell().textContent = "ID";
        header.insertCell().textContent = "Embedding (dim=384)";
        header.insertCell().textContent = "Content";
        header.insertCell().textContent = "Similarity";

        // Function to add a new person to the data table
        async function addNewPerson(event) {
            const start=performance.now();
            event.preventDefault();

            const randomId = (dataRows.length > 0 ? Math.max(...dataRows.map(row => row.id)) + 1 : 0);
            const randomEmbedding = [Math.random(), Math.random(), Math.random()];
            const addName = addNameInput.value || 'NewPerson' + randomId;

            //Compute embedding here.
            let addVector = await embed(addName);
            // console.log(addVector);



            const newDataEntry = {
                id: randomId,
                embedding: addVector,
                content: addName,
                cosineSim: null
            };

            dataRows.push(newDataEntry);

            const newRow = dataTable.insertRow();
            newRow.insertCell().textContent = newDataEntry.id;
            const displayPrecision=5;
            newRow.insertCell().textContent = "[" + String(newDataEntry.embedding.slice(0,1)).slice(0,displayPrecision)+"..." + String(newDataEntry.embedding.slice(-1)).slice(0,displayPrecision)+ "]";
            newRow.insertCell().textContent = newDataEntry.content;
            newRow.insertCell().textContent = newDataEntry.cosineSim;

            // Clear the input field
            addNameInput.value = '';
            const end=performance.now();
            document.getElementById('addText').textContent = "Add: (Operation Performed in " + (end - start).toFixed(3) + " ms)";
        }



        // Function to search and compute similarity
        async function searchAndComputeSimilarity(event) {
            const now=performance.now();
            event.preventDefault();
            const searchNameInput = document.getElementById('searchName');
            const searchValue = searchNameInput.value;

            //Compute embedding here.
            let searchVector = await embed(searchValue);
            console.log(searchVector);

            dataRows.forEach(row => {
                row.cosineSim = cosineSimilarity(searchVector, row.embedding);
            });

            // Sort dataRows by similarity in descending order
            dataRows.sort((a, b) => b.cosineSim - a.cosineSim);

            // Refresh the data table
            while (dataTable.rows.length > 1) {
                dataTable.deleteRow(1);
            }
            dataRows.forEach(dataEntry => {
                const newRow = dataTable.insertRow();
                newRow.insertCell().textContent = dataEntry.id;
                const displayPrecision=5;
                newRow.insertCell().textContent = "[" + String(dataEntry.embedding.slice(0,1)).slice(0,displayPrecision)+"..." + String(dataEntry.embedding.slice(-1)).slice(0,displayPrecision)+ "]";
                newRow.insertCell().textContent = dataEntry.content;
                newRow.insertCell().textContent = dataEntry.cosineSim.toFixed(4);
            });
            const end=performance.now();
            document.getElementById('searchText').textContent = "Search: (Operation Performed in " + (end - now).toFixed(3) + " ms)";
        }

        addForm.addEventListener('submit', addNewPerson);
        searchForm.addEventListener('submit', searchAndComputeSimilarity);


        
    }
};
xhr.send();
