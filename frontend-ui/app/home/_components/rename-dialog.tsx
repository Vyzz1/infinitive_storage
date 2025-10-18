"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newName: string) => Promise<void>;
  currentName: string;
  type: "file" | "folder";
}

export function RenameDialog({
  open,
  onOpenChange,
  onConfirm,
  currentName,
  type,
}: RenameDialogProps) {
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extension, setExtension] = useState("");
  const [nameWithoutExtension, setNameWithoutExtension] = useState("");

  useEffect(() => {
    if (open && currentName) {
      if (type === "file") {
        const lastDotIndex = currentName.lastIndexOf(".");
        if (lastDotIndex > 0) {
          const ext = currentName.substring(lastDotIndex); 
          const name = currentName.substring(0, lastDotIndex);
          setExtension(ext);
          setNameWithoutExtension(name);
          setNewName(name);
        } else {
          setExtension("");
          setNameWithoutExtension(currentName);
          setNewName(currentName);
        }
      } else {
        setExtension("");
        setNameWithoutExtension(currentName);
        setNewName(currentName);
      }
    }
  }, [open, currentName, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const finalName = type === "file" && extension 
        ? `${newName.trim()}${extension}` 
        : newName.trim();
      
      await onConfirm(finalName);
      onOpenChange(false);
      setNewName("");
    } catch (error) {
      console.error("Rename error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setNewName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename {type}</DialogTitle>
            <DialogDescription>
              {type === "file" 
                ? "Enter a new name for the file. The extension will be kept." 
                : "Enter a new name for the folder."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                {type === "file" ? "File name" : "Folder name"}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={`Enter ${type} name`}
                  disabled={isLoading}
                  autoFocus
                  className="flex-1"
                />
                {type === "file" && extension && (
                  <span className="text-sm text-muted-foreground font-medium min-w-fit">
                    {extension}
                  </span>
                )}
              </div>
              {type === "file" && extension && (
                <p className="text-xs text-muted-foreground">
                  Extension <span className="font-mono font-semibold">{extension}</span> will be kept
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !newName.trim()}>
              {isLoading ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}