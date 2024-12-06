import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests

function App() {
  const [query, setQuery] = useState(""); // User input
  const [conversation, setConversation] = useState([]); // List of questions and answers
  const [loading, setLoading] = useState(false); // Loading state
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const name = prompt("Welcome! Please enter your name:");
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return; // Prevent submitting empty queries

    setLoading(true);

    const apikey = process.env.REACT_APP_API_KEY; // Replace with your API key
    const apiurl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apikey}`;

    try {
      // Add the user's query to the conversation
      setConversation((prev) => [...prev, { sender: "user", text: query }]);

      const res = await axios.post(apiurl, {
        contents: [
          {
            parts: [
              {
                text: query,
              },
            ],
          },
        ],
      });

      // Extract the response text
      const result = res.data;
      const generatedText =
        result.candidates[0]?.content?.parts[0]?.text || "No content generated";

      // Add the API response to the conversation
      setConversation((prev) => [...prev, { sender: "bot", text: generatedText }]);
    } catch (error) {
      console.error("Error:", error);
      setConversation((prev) => [
        ...prev,
        { sender: "bot", text: "Error: " + error.message },
      ]);
    } finally {
      setLoading(false);
      setQuery(""); // Clear the input field
    }
  };

  return (
    <>
    <div 
  className="d-flex justify-content-center align-items-center mb-5" 
  style={{ height: "100px" }}
>
  <strong 
    style={{ color: "green", textAlign: "center",  marginLeft:"500px"}}
  >
    Welcome {userName} to vahi-ai.... Feel free to ask anything
  </strong>
</div>

    <div className='container'>
    <div className="app" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        className="chat-container"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          backgroundColor: "#f9f9f9",
          height: "500px",
          overflowY: "auto",
        }}
      >
        {/* Render conversation */}
        {conversation.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: message.sender === "user" ? "flex-end" : "flex-start",

            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: message.sender === "user" ? "#d1e7dd" : "#e2e3e5",
                color: message.sender === "user" ? "#0f5132" : "#495057",
                textAlign: "left",
                marginBottom:"10px"
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <textarea
            className="form-control"
            rows="2"
            placeholder="Type your question here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              marginRight: "10px",
              resize: "none",
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </div>
      </form>
    </div>
    </div>
    </>
  );
}

export default App;
