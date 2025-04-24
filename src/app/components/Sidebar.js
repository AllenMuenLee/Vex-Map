"use client";
import React from "react";
import Fuse from "fuse.js";

export default function Sidebar({
  search,
  setSearch,
  suggestions,
  setSuggestions,
  Items,
  setItems,
  Itemsets,
  setItemsets,
  selectedIds,
  setSelectedIds,
  selectedAreas,
  setSelectedAreas,
  isAdmin,
  isEditing,
  editingSets,
  setEditingSets,
  addItem,
  addSet,
  setAreas,
  Areas,
  navigateToArea,
  state_changed,
  focusedParentId,
  handleSearchChange,
}) {

  const selectSuggestion = (id) => {
    setSearch("");
    setSuggestions([]);
    Items.forEach((item) => {
      if ((item.id) === (id)){
        navigateToArea(item.area, id);
        return;
      }
    });
  };

  const selectSet = (setName) => {
    const set = Itemsets.find((s) => s.name === setName);
    const setsareas = [];

    if (set) {
      setSelectedIds(set.includes);
      Items.forEach((item) => {
        if (set.includes.includes(item.id)) {
          setsareas.push(item.area);
        }
      });
      setSelectedAreas(setsareas);
    }
  };

  const toggleRectInSet = (setIndex, rectId) => {
    const newSets = [...Itemsets];
    const set = newSets[setIndex];
    if (set.includes.includes(rectId)) {
      set.includes = set.includes.filter((id) => id !== rectId);
    } else {
      set.includes.push(rectId);
    }
    setItemsets(newSets);
  };

  return (
    <div className="w-64 bg-gray-800 p-4 space-y-4 flex flex-col">
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={search ?? ""}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="px-3 py-2 rounded bg-gray-700 text-white"
      />
      {suggestions.length > 0 && (
        <ul className="bg-gray-700 rounded">
          {suggestions.map((r, i) => (
            <li
              key={i}
              onClick={() => selectSuggestion(r.id)}
              className="px-3 py-1 hover:bg-gray-600 cursor-pointer"
            >
              {r.id}
            </li>
          ))}
        </ul>
      )}

      {/* Items / Parts */}
      <h2 className="font-bold border-b border-gray-600 pb-1">Parts</h2>
      <div className={`overflow-y-auto pr-1 ${isAdmin ? "max-h-96" : "max-h-150"}`}>
        {Items.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-2 mb-2">
            {isAdmin ? (
              <>
                <input
                  value={r.id}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setItems((prev) =>
                      prev.map((it, idx) => (idx === i ? { ...it, id: newId } : it))
                    );
                  }}
                  onClick={() => {
                    setSelectedAreas([r.area]);
                    setSelectedIds([r.id]);
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border-b border-gray-5000"
                />
                <button
                  onClick={() =>
                    setItems((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 hover:text-red-600 text-xl"
                  title="Delete item"
                >
                  🗑️
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigateToArea(r.area, r.id);
                }}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-left w-full"
              >
                {r.id}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Admin Buttons */}
      {isAdmin && (
        <div className="space-y-2 border-t pt-4 border-gray-600 mt-8">
          <button
            onClick={addItem}
            className="bg-indigo-700 hover:bg-indigo-600 w-full px-3 py-2 rounded"
          >
            ➕ Add Items
          </button>
            <button
                onClick={() => {
                    const id = prompt("Enter new area Name:");
                    if (!id) return;
                    else if (Areas.find((a) => a.name === id)){
                      alert("repeated id");
                      return;
                    }
                    setAreas(prev => [
                    ...prev,
                    {
                        id,
                        name: id,
                        color: "bg-green-500", // default color
                        x: 100,
                        y: 100,
                        width: 160,
                        height: 80,
                        parent: focusedParentId,
                        hadChild: false,
                        protips: "",
                    }
                    ]);
                    state_changed = true;
                    
                }}
                className="bg-green-700 hover:bg-green-600 px-3 py-2 rounded w-full"
                >
                ➕ Add Area
            </button>
        </div>
      )}
    </div>
  );
}
