import React, { useState } from "react";

const App = () => {
  const [query, setQuery] = useState(""); // To store user input
  const [response, setResponse] = useState(""); // To store API response
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Show loading state
    setResponse(""); // Clear previous response

    try {
      // Make API call to Gemini
      const res = await fetch("https://api.gemini.com/your-endpoint", {
        method: "POST", // Adjust to API method (e.g., GET/POST)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }), // Send user query as request payload
      });

      const data = await res.json(); // Parse JSON response
      setResponse(data.message || "Response received!"); // Update response
    } catch (error) {
      setResponse("Error: Unable to fetch response."); // Handle error
    } finally {
      setLoading(false); // Remove loading state
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Gemini Query App</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="query">Enter your query:</label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows="4"
          style={{ width: "100%", marginTop: "10px", padding: "10px" }}
          required
        />
        <button
          type="submit"
          style={{ marginTop: "10px", padding: "10px 20px" }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Send Query"}
        </button>
      </form>
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <strong>Response:</strong>
        <p>{response || "No response yet."}</p>
      </div>
    </div>
  );
};

export default App;
