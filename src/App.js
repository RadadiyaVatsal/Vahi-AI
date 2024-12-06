import './App.css';
import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API requests

function App() {
  const [query, setQuery] = useState(""); // User input
  const [conversation, setConversation] = useState([]); // List of questions and answers
  const [loading, setLoading] = useState(false); // Loading state

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
    <div className="container py-3">
      <div className="app">
        <div
          className="chat-container p-3 border rounded shadow-sm bg-light"
          style={{ height: "500px", overflowY: "auto" }}
        >
          {/* Render conversation */}
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`d-flex ${message.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={`p-2 rounded mb-2 ${
                  message.sender === "user" ? "bg-success text-white" : "bg-secondary text-white"
                }`}
                style={{ maxWidth: "70%" }}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="d-flex justify-content-center align-items-center">
            <textarea
              className="form-control me-2"
              rows="2"
              placeholder="Type your question here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Loading..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
