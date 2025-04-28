"use client";

import React, { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
import { supabase } from "./lib/supabaseClient";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import AreaCanvas from "./components/AreaCanvas";
import ExplanationPanel from "./components/ExplanationPanel";
import ChatPanel from "./components/Chat";

export default function Home() {
  const [Areas, setAreas] = useState([]);
  const [Items, setItems] = useState([]);
  const [Itemsets, setItemsets] = useState([]);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [adminPassword, setAdminPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingSets, setEditingSets] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [focusedParentId, setFocusedParentId] = useState(null);
  const [viewMode, setViewMode] = useState("default"); // default | zooming-in | zooming-out

  const dragging = useRef(false);

  const cameraRef = useRef(null);
  const rectRefs = useRef({});
  const dragRefs = useRef({});

  var state_changed = false;

  const focusedRectangle =
    selectedIds.length === 1
      ? Areas.find((r) => r.id === selectedIds[0])
      : null;

  // Zoom on focus
  useEffect(() => {
    const camera = cameraRef.current;
    if (selectedIds.length === 1 && camera && !isEditing) {
      const rectId = selectedIds[0];
      const target = rectRefs.current[rectId];
      if (target) {
        const cameraBox = camera.getBoundingClientRect();
        const targetBox = target.getBoundingClientRect();
        const offsetX =
          cameraBox.width / 2 -
          (targetBox.left - cameraBox.left + targetBox.width / 2);
        const offsetY =
          cameraBox.height / 2 -
          (targetBox.top - cameraBox.top + targetBox.height / 2);
        camera.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.5)`;
      }
    } else if (camera) {
      camera.style.transform = "translate(0, 0) scale(1)";
    }
  }, [selectedIds, isEditing]);

  // Load map from Supabase
  useEffect(() => {
    const loadMap = async () => {
      const { data, error } = await supabase
        .from("vex_map")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setAreas(data.areas);
        setItems(data.items);
        setItemsets(data.itemsets);
      }
    };
    loadMap();
  }, []);

  // Save map to Supabase
  const completeEditing = async () => {
    const unassignedItem = Items.find((item) => !item.area);
    if (unassignedItem) {
      alert("❗ Please set area for: " + unassignedItem.id);
      return;
    }

    setIsEditing(false);
    setIsAdmin(false);
    setAdminPassword("");
    setEditingSets(false);

    const { error } = await supabase.from("vex_map").insert([
      { areas: Areas, items: Items, itemsets: Itemsets },
    ]);

    if (error) {
      console.error("Failed to save map:", error);
      alert("❌ Failed to save map.");
    } else {
      alert("✅ Map saved successfully.");
    }
  };

  const navigateToArea = async (areaId, itemId) => {
    // Step 1: Build path from root to this area
    const path = [];
    let area = Areas.find((a) => a.id === areaId);
    let current = area;

    while (current != undefined) {
      path.unshift(current.id);
      current = Areas.find((a) => a.id === current.parent);
    }
  
    // Step 2: Traverse the path one by one
    for (let i = 0; i < path.length - 1; i++) {
      setViewMode("zooming-in");
      setSelectedAreas(path[i]);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFocusedParentId(path[i]);
      setViewMode("default");
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  
    // Step 3: Final focus (child node)
    const lastArea = path[path.length - 1];
    setSelectedAreas([lastArea]);
    setSelectedIds([itemId]);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  
    const results = fuse.search(value);
    setSuggestions(results.map(r => r.item)); // `item` is the actual object
  };
  
  const fuse = new Fuse(Items, {
    keys: ["id"],
  });

  return (
    <div className="flex h-screen text-white bg-gray-900">
      <Sidebar
        search={search}
        setSearch={setSearch}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        Items={Items}
        setItems={setItems}
        Itemsets={Itemsets}
        setItemsets={setItemsets}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        selectedAreas={selectedAreas}
        setSelectedAreas={setSelectedAreas}
        isAdmin={isAdmin}
        isEditing={isEditing}
        editingSets={editingSets}
        setEditingSets={setEditingSets}
        setAreas={setAreas}
        Areas={Areas}
        navigateToArea={navigateToArea}
        state_changed={state_changed}
        focusedParentId={focusedParentId}
        handleSearchChange={handleSearchChange}
        addItem={() => {
          const name = prompt("Enter item name:");
          if (name?.trim()) {
            setItems([...Items, { id: name, area: null }]);
          }
        }}
        addSet={() => {
          const name = prompt("Enter set name:");
          if (name?.trim()) {
            setItemsets([...Itemsets, { name, includes: [] }]);
          }
        }}
      />

      <AreaCanvas
          Areas={Areas}
          setAreas={setAreas}
          Items={Items}
          isAdmin={isAdmin}
          isEditing={isEditing}
          selectedIds={selectedIds}
          selectedAreas={selectedAreas}
          setSelectedIds={setSelectedIds}
          setSelectedAreas={setSelectedAreas}
          setItems={setItems}
          dragRefs={dragRefs}
          rectRefs={rectRefs}
          cameraRef={cameraRef}
          setFocusedParentId={setFocusedParentId}
          focusedParentId={focusedParentId}
          viewMode={viewMode}
          setViewMode={setViewMode}
          state_changed={state_changed}
          dragging={dragging}
      />

      <AdminPanel
        isAdmin={isAdmin}
        isEditing={isEditing}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        setIsAdmin={setIsAdmin}
        setIsEditing={setIsEditing}
        completeEditing={completeEditing}
        state_changed={state_changed}
      />

      <ExplanationPanel 
        selectedIds={selectedIds}
        focusedRectangle={focusedRectangle}
        Items={Items}
        setItems={setItems}
        isAdmin={isAdmin}/>

      <ChatPanel
      setSearch={setSearch}
      handleSearchChange={handleSearchChange}
      />
    </div>
  );
}
