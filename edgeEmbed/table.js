const dataRows = [];
// Function to compute cosine similarity
function cosineSimilarity(v1, v2) {
    let dotProduct = 0.0;
    let magnitude1 = 0.0;
    let magnitude2 = 0.0;

    for(let i = 0; i < v1.length; i++) {
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

document.addEventListener('DOMContentLoaded', function() {
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
    function addNewPerson(event) {
        event.preventDefault();
    
        const randomId = (dataRows.length >0 ? Math.max(...dataRows.map(row => row.id)) + 1: 0);
        const randomEmbedding = [Math.random(), Math.random(), Math.random()];
        const addName = addNameInput.value || 'NewPerson' + randomId;

        //Compute embedding here.


    
        const newDataEntry = { 
            id: randomId, 
            embedding: randomEmbedding, 
            content: addName, 
            cosineSim: null
        };
        
        dataRows.push(newDataEntry);
    
        const newRow = dataTable.insertRow();
        newRow.insertCell().textContent = newDataEntry.id;
        newRow.insertCell().textContent = "[" + newDataEntry.embedding.join(', ') + "]";
        newRow.insertCell().textContent = newDataEntry.content;
        newRow.insertCell().textContent = newDataEntry.cosineSim;
    
        // Clear the input field
        addNameInput.value = '';
    }

    

    // Function to search and compute similarity
    function searchAndComputeSimilarity(event) {
        const searchNameInput = document.getElementById('searchName');
        const searchValue = searchNameInput.value;

        //Compute embedding here.



        event.preventDefault();
        let hardcodedVector = [Math.random(),0.3,0.7];

        dataRows.forEach(row => {
            row.cosineSim = cosineSimilarity(hardcodedVector, row.embedding);
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
            newRow.insertCell().textContent = "[" + dataEntry.embedding.join(', ') + "]";
            newRow.insertCell().textContent = dataEntry.content;
            newRow.insertCell().textContent = dataEntry.cosineSim.toFixed(4);
        });
    }

    addForm.addEventListener('submit', addNewPerson);
    searchForm.addEventListener('submit', searchAndComputeSimilarity);
});