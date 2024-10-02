// src/App.js
// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/data?search=${search}`,
      ); // Include the search parameter
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const result = await response.json();
      console.log("Fetched Data:", result);
      setData(result); // Update state with the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Uploading file:", file);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const responseData = await response.text();
    console.log("Upload response:", responseData); // Log the response
    fetchData(); // Refresh the data after upload
  };

  return (
    <div className="App">
      <h1>Excel Data Upload and Dashboard</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <input
        type="text"
        placeholder="Search by Client Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>SNo</th>
            <th>Material</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>Client Name</th> {/* Ensure this matches the data */}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.SNo}</td>
              <td>{item.Material}</td>
              <td>{item.Unit}</td>
              <td>{item.Quantity}</td>
              <td>{item.Rate}</td>
              <td>{item.Amount}</td>
              <td>{item.clientname}</td>{" "}
              {/* Ensure clientname is being displayed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
