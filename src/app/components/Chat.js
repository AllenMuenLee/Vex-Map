"use client";
import React, { useState } from "react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import Fuse from "fuse.js";

export default function ChatPanel({
        setSearch,
        handleSearchChange,
    }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const prompt = "Ur name is Allen, and you’re an experienced builder in Vex Robotics, as you know all of the advanced techniques about building parts and usage of each element. You understand the usage of all parts, so when people ask you specific parts they wants to make, you can list out all of the elements needed. You should not further explain the usage of each part, but make sure give pro tips about how to make specific mechanism. People might also ask which element can achieve certain functionality, make sure giving a precise answer about which element or vex part they should use. Make sure all of the answers are listed using bullet points, and give answer in both English and traditional Chinese. Make the words of all of the parts you listed out bold and italics. The qeustion now is: ";

  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/novita/v3/openai",
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });
  
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
  
    try {
      const chatCompletion = await client.chat.completions.create({
        model: "deepseek/deepseek-v3-turbo",
        messages: [
          {
            role: "user",
            content: prompt + input,
          },
        ],
        max_tokens: 500,
      });
  
      const aiMessage = chatCompletion.choices[0].message;
      setMessages([...updatedMessages, aiMessage]);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (messages[0] === undefined){
    setInput("Introduce yourself");
    sendMessage();
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-gray-900 text-white p-2 rounded-lg shadow-md w-72">
        <button
          className="w-full text-left text-sm font-bold bg-gray-700 px-3 py-2 rounded"
          onClick={() => setOpen(!open)}
        >
          🤖 Part Finder {open ? "▼" : "▲"}
        </button>

        {open && (
    <div className="mt-2">
        <div className="h-48 overflow-y-auto p-2 bg-gray-800 rounded text-sm space-y-2">
        {messages.map((msg, idx) => (
                <div
                key={idx}
                className={`p-2 rounded ${
                  msg.role === "user" ? "bg-blue-700 text-right" : "bg-green-700"
                }`}
              >
                <ReactMarkdown
                  components={{
                    em: ({ node, children }) => (
                      <span
                        onClick={(e) => {
                            console.log(children);
                            setSearch(children);
                            handleSearchChange(children);
                            }}
                        className="text-yellow-300 cursor-pointer underline hover:text-yellow-400"
                      >
                        {children}
                      </span>
                    ),
                    
                  }}
                >
                  {idx === 0? null : msg.content}
                </ReactMarkdown>
              </div>
              
            ))}

            {loading && <div className="text-gray-400 text-xs">Thinking...</div>}
            </div>

            <div className="mt-2 flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-2 py-1 text-white rounded"
                placeholder="Ask something..."
            />
            <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
                Send
            </button>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}
