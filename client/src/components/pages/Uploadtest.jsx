import React, { useState } from 'react';

const Uploadtest = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = JSON.parse(e.target.result);
        setJsonData(fileContent);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  };

  const createtest = async () => {
    if (!jsonData) {
      return alert("Please select Test json");
    }

    const response = await fetch("/api/new/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    });

    let res = await response.json();
    alert(res.message);
  };

  return (
    <div>
      <input
        type="file"
        accept=".json"
        onChange={handleFileInputChange}
      />
      {jsonData && (
        <div>
          <h2>JSON Data:</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          <button onClick={createtest}>Upload</button>
        </div>
      )}
    </div>
  );
};

export default Uploadtest;
