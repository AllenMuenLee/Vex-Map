"use client";
import React from "react";
import RectangleBlock from "./Area";

export default function AreaCanvas({
  Areas,
  setAreas,
  Items,
  isAdmin,
  isEditing,
  selectedIds,
  selectedAreas,
  setSelectedIds,
  setSelectedAreas,
  setItems,
  dragRefs,
  rectRefs,
  cameraRef,
  focusedParentId,
  setFocusedParentId,
  setViewMode,
  viewMode,
  dragging,
}) {
  const handleBack = () => {
      if (focusedParentId){
        setViewMode("zooming-out");
      }
      setTimeout(() => {
        setFocusedParentId(null);
        setSelectedIds([]);
        setSelectedAreas([]);
        setViewMode("default");
      }, 700);
  };

  const unfocus = () => {
    setSelectedIds([]);
    setSelectedAreas([]);
  }
  

  // Only show root areas or children of the focused parent
  const visibleAreas = focusedParentId
    ? Areas.filter((area) => area.parent === focusedParentId)
    : Areas.filter((area) => area.parent === null);

  var f_prev = !focusedParentId;
  var a_prev = !Areas;
  
  return (
    <div
      className="flex flex-col items-center justify-center flex-grow relative overflow-hidden"
      onClick={unfocus}
    >
      {/* Back Button */}
      {(focusedParentId) && (
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded z-50"
        >
          ← Back
        </button>
      )}

      {/* Camera container */}
      <div
        ref={cameraRef}
        className={`
          flex flex-wrap items-center justify-center gap-6
        `}
        style={{ transformOrigin: "center" }}
      >

        {visibleAreas.map((rect, i) => {
            const isFocusMode = selectedAreas.length > 0;
            if (f_prev != focusedParentId || a_prev != Areas){
              f_prev = focusedParentId;
              return (
                <RectangleBlock
                  key={rect.id}
                  rect={rect}
                  index={i}
                  isFocusMode={isFocusMode}
                  isAdmin={isAdmin}
                  isEditing={isEditing}
                  dragRefs={dragRefs}
                  rectRefs={rectRefs}
                  setAreas={setAreas}
                  selectedIds={selectedIds}
                  selectedAreas={selectedAreas}
                  Items={Items}
                  setItems={setItems}
                  setSelectedAreas={setSelectedAreas}
                  Areas={Areas}
                  focusedParentId={focusedParentId}
                  setFocusedParentId={setFocusedParentId}
                  setViewMode={setViewMode}
                  dragging={dragging}
                  viewMode={viewMode}
                />
              );
            }
        })}
      </div>
    </div>
  );
}
