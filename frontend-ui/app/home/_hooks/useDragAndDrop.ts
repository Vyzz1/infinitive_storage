"use client";

import { useState } from "react";
import { toast } from "sonner";

interface DragItem {
  id: string;
  type: "file" | "folder";
  name: string;
}

export function useDragAndDrop(
  onMove?: (itemId: string, itemType: "file" | "folder", targetFolderId: string) => Promise<void>
) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (item: DragItem, e: React.DragEvent) => {
    setDraggedItem(item);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (targetFolderId: string) => async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || !onMove) return;

    if (draggedItem.type === "folder" && draggedItem.id === targetFolderId) {
      toast.error("Cannot move folder into itself");
      setDraggedItem(null);
      setIsDragging(false);
      return;
    }

    try {
      await onMove(draggedItem.id, draggedItem.type, targetFolderId);
      toast.success(`${draggedItem.type === "file" ? "File" : "Folder"} moved successfully`);
    } catch (error) {
      toast.error("Failed to move item");
      console.error(error);
    } finally {
      setDraggedItem(null);
      setIsDragging(false);
    }
  };

  return {
    draggedItem,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
}