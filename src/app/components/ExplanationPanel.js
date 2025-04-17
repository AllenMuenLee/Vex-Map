"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import OpenAI from "openai";

export default function ExplanationPanel({
  selectedIds,
  focusedRectangle,
  Items,
  setItems,
  isAdmin,
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [localProTips, setLocalProTips] = useState("");

  const selectedItem =
    selectedIds.length === 1
      ? Items.find((item) => item.id === selectedIds[0])
      : null;

  const prompt =
    "Ur name is Allen, and you’re an experienced builder in Vex Robotics. You understand the usage of all parts, so when people ask you specific parts they want to make, you can list out all of the elements needed. You should not further explain the usage of each part, but make sure to give pro tips about how to make specific mechanism. People might also ask which element can achieve certain functionality—make sure to give a precise answer about which element or vex part they should use. Make sure all of the answers are listed using bullet points, and give answer in both English and traditional Chinese.\n\nThe question now is: ";

  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/novita/v3/openai",
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (!selectedItem) return;

    setMessage("");
    setLocalProTips(selectedItem.proTips || "");
    const askAI = async () => {
      setLoading(true);
      try {
        const chatCompletion = await client.chat.completions.create({
          model: "deepseek/deepseek-v3-turbo",
          messages: [
            {
              role: "user",
              content: `${prompt}${selectedItem.proTips || ""}\n\n${selectedItem.id}`,
            },
          ],
          max_tokens: 500,
        });

        const aiMessage = chatCompletion.choices[0].message.content;
        setMessage(aiMessage);
      } catch (err) {
        console.error("AI Error:", err);
        setMessage("❌ Failed to fetch explanation.");
      } finally {
        setLoading(false);
      }
    };

    askAI();
  }, [selectedItem]);

  // Save pro tips on blur
  const handleProTipsBlur = () => {
    if (selectedItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, proTips: localProTips }
            : item
        )
      );
    }
  };

  return (
    <div
      className={`
        fixed top-0 right-0 h-full bg-gray-800 shadow-lg transition-all duration-500 ease-in-out z-40
        ${selectedItem ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-full pointer-events-none overflow-hidden"}
      `}
    >
      <div className="p-4 space-y-2 h-full flex flex-col overflow-y-auto">
        <h2 className="text-lg font-bold border-b border-gray-600 pb-2">Explanation</h2>

        {selectedItem && (
          <div>
            <div className="mb-2">
              <label className="text-xs font-semibold">Pro Tips:</label>
              {isAdmin ? (
                <textarea
                  value={localProTips}
                  onChange={(e) => setLocalProTips(e.target.value)}
                  onBlur={handleProTipsBlur}
                  rows={3}
                  className="w-full p-1 text-sm text-white bg-gray-700 rounded mt-1"
                  placeholder="Enter pro tips here..."
                />
              ) : (
                <p className="text-sm bg-yellow-700 p-2 rounded mt-1">
                  {selectedItem.proTips || "No pro tips available."}
                </p>
              )}
            </div>

            {loading ? (
              <p className="text-sm text-gray-400">🔄 Loading explanation...</p>
            ) : (
              <div className="prose prose-invert text-sm">
                <ReactMarkdown>{message}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
