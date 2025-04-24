"use client";
import { Red_Hat_Text } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";

export default function RectangleBlock({
  rect,
  isFocusMode,
  isAdmin,
  isEditing,
  index,
  dragRefs,
  rectRefs,
  setAreas,
  selectedIds,
  Items,
  setItems,
  selectedAreas,
  setSelectedAreas,
  setFocusedParentId,
  FocusedParentId,
  Areas,
  setViewMode,
  dragging,
  viewMode,
}) {
  const [localName, setlocalName] = useState(rect.name);
  const [activeRectId, setActiveRectId] = useState(null);

  React.useEffect(() => {
    setlocalName(rect.name);
  }, [rect.name]);

  if (!dragRefs.current[rect.id]) {
    dragRefs.current[rect.id] = React.createRef();
  }

  return (
    <Draggable
      nodeRef={dragRefs.current[rect.id]}
      position={{ x: rect.x, y: rect.y }}
      onDrag={(e) => {dragging.current = true; setActiveRectId(rect.id)}}
      onStart={(e) => {dragging.current = false; setActiveRectId(null)}}
      onStop={(e, data) => {
        const newX = data.x;
        const newY = data.y;
        setAreas((prev) =>
          prev.map((r) =>
            r.id === rect.id ? { ...r, x: newX, y: newY } : r
          )
        );        
      }}
      disabled={!isEditing}
    >
      <div
        ref={(el) => {
          rectRefs.current[rect.id] = el;
          dragRefs.current[rect.id].current = el;
        }}
        style={{
          position: "absolute",
          cursor: isEditing ? "move" : "pointer",
          width: rect.width,
          height: rect.height,
          zIndex: (activeRectId === rect.id ? "50" : "10"),
        }}
      >
      <motion.div
        ref={(el) => {
          rectRefs.current[rect.id] = el;
          dragRefs.current[rect.id].current = el;
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!dragging.current){
            if (rect.hasChild) {
              setViewMode("zooming-in");
              setTimeout(() => {
                setFocusedParentId(rect.id);
                setViewMode("default");
              }, 1400);
              return;
            }

            if (isAdmin){
              Items.forEach((item) => {
                if (selectedIds.includes(item.id)) {
                  item.area = rect.id;
                }
              });

              Areas.forEach((area) => {
                if (selectedAreas.includes(area.id) && area.id != rect.id) {
                  area.parent = rect.id;
                  rect.hasChild = true;
                }
              });

              setActiveRectId(rect.id);
              console.log("active id");
            }

            setSelectedAreas([rect.id]);
          }
          }}
          initial={{ 
            scale: rect.hasChild && FocusedParentId ? 1 : 0.5, 
            opacity: rect.hasChild && FocusedParentId ? 0 : 1}}
          animate={{
            scale:
              viewMode === "zooming-in" && selectedAreas.includes(rect.id)
                ? 1.3
                : viewMode === "zooming-in"
                ? 0.5
                : viewMode === "zooming-out"
                ? 0.5 
                : 1,
            opacity:
              (viewMode === "zooming-out") || (viewMode === "zooming-in") ? 0 : 1,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        style={{
            position: "absolute",
            cursor: isEditing ? "move" : "pointer",
            width: rect.width,
            height: rect.height,
        }}
        className={`
          ${rect.color}
          ${isFocusMode && selectedAreas.includes(rect.id) ? "ring-4 ring-yellow-300 z-20" : ""}
          ${isFocusMode && !selectedAreas.includes(rect.id) && !isEditing ? "opacity-30 scale-95" : ""}
          w-40 h-20 flex items-center justify-center font-bold relative
          transform
        `}
      >
        {isAdmin ? (
          <>
            {/* Show area ID inside block */}
            <span className="text-sm">{rect.name}</span>

            {/* Floating edit panel to the right */}
            <div
              className="absolute left-full top-0 ml-2 bg-gray-800 border border-gray-600 p-2 rounded shadow z-40 w-48 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setActiveRectId(rect.id);
              }}
              style={{
                zIndex: activeRectId === rect.id ? 50 : 10,
              }}
            >
              <label className="block mb-2 text-sm font-semibold">NAME:</label>
              <input
                value={localName}
                onChange={(e) => setlocalName(e.target.value)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRectId(rect.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setAreas((prev) =>
                      prev.map((r, index) =>
                        r.id === rect.id ? { ...r, name: localName } : r
                      )
                    );
                    e.target.blur(); // trigger blur logic
                  }
                }}
                className="w-full px-2 py-1 mb-2 text-white rounded"
              />

              <div className="flex gap-2 mb-2">
                <label className="flex flex-col text-xs text-white">
                  W:
                  <input
                    type="number"
                    min = "1"
                    value={rect.width}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRectId(rect.id);
                    }}
                    onChange={(e) => {
                      const newWidth = parseInt(e.target.value);
                      setAreas((prev) =>
                        prev.map((r) =>
                          r.id === rect.id ? { ...r, width: newWidth } : r
                        )
                      );
                    
                    }}
                    className="w-16 px-1 py-0.5 text-white rounded"
                  />
                </label>
                <label className="flex flex-col text-xs text-white">
                  H:
                  <input
                    type="number"
                    min = "1"
                    value={rect.height}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRectId(rect.id);
                    }}
                    onChange={(e) => {
                      const newHeight = parseInt(e.target.value);
                      setAreas((prev) =>
                        prev.map((r) =>
                          r.id === rect.id ? { ...r, height: newHeight } : r
                        )
                      );
                    }}
                    className="w-16 px-1 py-0.5 text-white rounded"
                  />
                </label>
              </div>

              <button
                onClick={() => {
                  const confirmDelete = confirm(`Delete area "${rect.id}" and its children?`);
                  if (!confirmDelete) return;

                  setAreas((prev) => {
                    const deleteRecursive = (id, areas) => {
                      let toDelete = [id];
                      let queue = [id];

                      while (queue.length > 0) {
                        const current = queue.pop();
                        const children = areas.filter((a) => a.parent === current);
                        children.forEach((child) => {
                          toDelete.push(child.id);
                          queue.push(child.id);
                        });
                      }

                      return areas.filter((a) => !toDelete.includes(a.id));
                    };

                    return deleteRecursive(rect.id, prev);
                  });
                }}
                className="bg-red-600 hover:bg-red-700 text-sm w-full py-1 rounded"
              >
                🗑 Delete
              </button>
            </div>
          </>
        ) : (
          <span className="text-sm">{rect.name}</span>
        )}
      </motion.div>
      </div>
    </Draggable>
  );
}
