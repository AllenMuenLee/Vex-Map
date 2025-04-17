"use client";
import React from "react";

export default function AdminPanel({
  isAdmin,
  isEditing,
  adminPassword,
  setAdminPassword,
  setIsAdmin,
  setIsEditing,
  completeEditing,
  state_changed
}) {
  const handlePasswordSubmit = () => {
    if (adminPassword === "admin123") {
      setIsAdmin(true);
      setIsEditing(true);
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
      {!isAdmin && !isEditing ? (
        <div className="flex gap-2 items-center">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Admin Password"
            className="px-3 py-2 rounded bg-gray-800 text-white"
          />
          <button
            onClick={handlePasswordSubmit}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Enter
          </button>
        </div>
      ) : (
        <button
          onClick={completeEditing}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Complete
        </button>
      )}
    </div>
  );
}
