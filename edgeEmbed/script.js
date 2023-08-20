let session; // Declare the session at a wider scope so it's accessible later
async function loadModel() {
    console.log("model loading!")
    session = await ort.InferenceSession.create('./onnx/model.onnx', {executionProviders: ['wasm']});
    console.log("model loaded!")

    
    document.getElementById("modelLoadingText").textContent = "Model Loaded; Ready for inference.";
    document.getElementById("userInput").style.display = "inline-block";
    document.getElementById("submitBtn").style.display = "inline-block";
    
}

window.onload = loadModel;

var xhr = new XMLHttpRequest();
xhr.open('GET', 'tokenizer.json', true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var jsonText = xhr.responseText;
        var jsonData = JSON.parse(jsonText);
        const tokenizerJSON = jsonData;

        // Hide "Loading..." text once JSON is loaded
        document.getElementById("loadingText").textContent = "Tokenizer Loaded.";
        

                function extractTokens(input){
                    var regex = /\w+(?:'\w+)?|[^\w\s]/g;
                    var matches = input.match(regex);
                    return matches;
                }

                function cvtToTokens(jsString) {
                    let tokenValues = extractTokens(jsString);
                    tokenValues = tokenValues.filter(value => value !== " " && value !== "\n");
                    const tokenization=[]
                    tokenization.push(101);
                    tokenValues.map((value) => {
                        value=value.toLowerCase();
                        if (tokenizerJSON.model.vocab[value] === undefined) {
                            tokenization.push(100); //UNK
                        }
                        else{
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

                async function main(inputString) {
                    start=performance.now();
                    
                    let unpadded=cvtToTokens(inputString).map(val=>{
                        return BigInt(val);
                    });

                    let input_ids=unpadded.concat(new Array(256-unpadded.length).fill(BigInt(0)));
                    let aMask=unpadded.concat(new Array(256-unpadded.length).fill(BigInt(0))).fill(BigInt(1),0,unpadded.length);

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
                    end=performance.now();
                    document.getElementById('inferenceTime').textContent = "Inference time: "+(end-start).toFixed(3) + " ms";
                    

                    const first5 = embeddings.slice(0, 5);
                    const last5 = embeddings.slice(-5);

                    // Combine them into a string
                    const displayText = '[' + first5.join(', ') + ' ... ' + last5.join(', ') + ']';

                    // Set that string as the text content of the new HTML element
                    document.getElementById('vectorEntries').textContent = displayText;
                    return embeddings;
                }
                // Attach an event listener to the Submit button
                document.getElementById("submitBtn").addEventListener("click", function() {
                    var inputString = document.getElementById("userInput").value; // Get user input
                    main(inputString); // Call main function with user input and print the output vector to console
                });
            }
        };
xhr.send();  


