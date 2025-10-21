"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckIcon, RotateCcwIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (color: string | null) => Promise<void>;
  currentColor?: string | null;
  folderName: string;
}

const FOLDER_COLORS = [
  { name: "Blue", value: "#3B82F6", description: "Ocean Blue" },
  { name: "Emerald", value: "#10B981", description: "Forest Green" },
  { name: "Purple", value: "#8B5CF6", description: "Lavender Purple" },
  { name: "Pink", value: "#EC4899", description: "Rose Pink" },
  { name: "Orange", value: "#F97316", description: "Sunset Orange" },
  { name: "Red", value: "#EF4444", description: "Cherry Red" },
  { name: "Yellow", value: "#EAB308", description: "Golden Yellow" },
  { name: "Indigo", value: "#6366F1", description: "Deep Indigo" },
  { name: "Teal", value: "#14B8A6", description: "Turquoise Teal" },
  { name: "Lime", value: "#84CC16", description: "Fresh Lime" },
  { name: "Cyan", value: "#06B6D4", description: "Sky Cyan" },
  { name: "Amber", value: "#F59E0B", description: "Warm Amber" },
  { name: "Violet", value: "#7C3AED", description: "Royal Violet" },
  { name: "Fuchsia", value: "#D946EF", description: "Bright Fuchsia" },
  { name: "Rose", value: "#F43F5E", description: "Coral Rose" },
  { name: "Slate", value: "#64748B", description: "Cool Slate" },
];

export function ColorPickerDialog({
  open,
  onOpenChange,
  onConfirm,
  currentColor,
  folderName,
}: ColorPickerDialogProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    currentColor || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (selectedColor === currentColor) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(selectedColor);
      onOpenChange(false);
    } catch (error) {
      console.error("Error changing folder color:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedColor(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Choose Color for &ldquo;{folderName}&rdquo;
          </DialogTitle>
          <DialogDescription>
            Select a color to personalize your folder and make it easier to
            identify.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Selection Preview */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
            <div
              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm flex items-center justify-center"
              style={{
                backgroundColor: selectedColor || "#64748B",
              }}
            >
              {!selectedColor && (
                <div className="w-4 h-4 rounded bg-white/20" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">
                {selectedColor
                  ? FOLDER_COLORS.find((c) => c.value === selectedColor)
                      ?.name || "Custom"
                  : "Default"}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedColor
                  ? FOLDER_COLORS.find((c) => c.value === selectedColor)
                      ?.description || selectedColor
                  : "System default color"}
              </p>
            </div>
          </div>

          {/* Color Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Available Colors</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 px-2 text-xs"
              >
                <RotateCcwIcon className="w-3 h-3 mr-1" />
                Reset to Default
              </Button>
            </div>

            <div className="grid grid-cols-8 gap-2">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "relative w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg group",
                    selectedColor === color.value
                      ? "border-foreground ring-2 ring-ring ring-offset-2"
                      : "border-white shadow-sm hover:border-gray-300"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={`${color.name} - ${color.description}`}
                >
                  {selectedColor === color.value && (
                    <CheckIcon className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-sm" />
                  )}

                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs font-medium border shadow-md whitespace-nowrap">
                      {color.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Color"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
