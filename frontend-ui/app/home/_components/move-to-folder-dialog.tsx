"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronDown, Folder, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoveToFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (folderId: string | null) => Promise<void>;
  currentFolderId?: string | null;
  itemName: string;
  itemType: "file" | "folder";
  folders: FolderDbItem[];
  excludeFolderId?: string;
}

interface FolderNode {
  id: string;
  name: string;
  children: FolderNode[];
}

export function MoveToFolderDialog({
  open,
  onOpenChange,
  onConfirm,
  currentFolderId,
  itemName,
  itemType,
  folders = [],
  excludeFolderId,
}: MoveToFolderDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  // Build folder tree with memoization
  const folderTree = useMemo(() => {
    const buildFolderTree = (folders: FolderDbItem[]): FolderNode[] => {
      const folderMap = new Map<string, FolderNode>();
      const rootFolders: FolderNode[] = [];

      if (!folders || folders.length === 0) {
        return rootFolders;
      }

      const filteredFolders = folders.filter((f) => f.id !== excludeFolderId);

      filteredFolders.forEach((folder) => {
        folderMap.set(folder.id, {
          id: folder.id,
          name: folder.name,
          children: [],
        });
      });

      filteredFolders.forEach((folder) => {
        const node = folderMap.get(folder.id);
        if (!node) return;

        if (!folder.parentId || folder.parentId === "root") {
          rootFolders.push(node);
        } else {
          const parent = folderMap.get(folder.parentId);
          if (parent) {
            parent.children.push(node);
          }
        }
      });

      return rootFolders;
    };

    return buildFolderTree(folders);
  }, [folders, excludeFolderId]);

  useEffect(() => {
    if (open) {
      const allFolderIds = new Set<string>();
      const collectIds = (nodes: FolderNode[]) => {
        nodes.forEach((node) => {
          allFolderIds.add(node.id);
          collectIds(node.children);
        });
      };
      collectIds(folderTree);
      setExpandedFolders(allFolderIds);
      setSelectedFolderId(currentFolderId || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentFolderId]);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onConfirm(selectedFolderId);
      onOpenChange(false);
    } catch (error) {
      console.error("Move error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const renderFolderNode = (node: FolderNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFolderId === node.id;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2.5 rounded-md cursor-pointer hover:bg-muted transition-colors group", // ⭐ THÊM py-2.5 và group
            isSelected && "bg-primary/10 hover:bg-primary/15"
          )}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => setSelectedFolderId(node.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(node.id);
              }}
              className="p-1 hover:bg-muted-foreground/20 rounded transition-colors flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-foreground" />
              )}
            </button>
          ) : (
            <span className="w-6 flex-shrink-0" />
          )}

          <Folder
            className={cn(
              "h-4 w-4 flex-shrink-0",
              isSelected ? "text-primary" : "text-blue-500",
              hasChildren && "text-amber-500"
            )}
          />

          <span
            className={cn(
              "text-sm flex-1 truncate",
              isSelected && "font-semibold text-primary",
              !isSelected && "group-hover:text-foreground"
            )}
          >
            {node.name}
            {hasChildren && (
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                ({node.children.length})
              </span>
            )}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5">
            {node.children.map((child) => renderFolderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Move {itemType}</DialogTitle>
          <DialogDescription>
            Choose a destination folder for &quot;{itemName}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-md cursor-pointer hover:bg-muted transition-colors mb-3",
              selectedFolderId === null && "bg-primary/10 hover:bg-primary/15"
            )}
            onClick={() => setSelectedFolderId(null)}
          >
            <Home
              className={cn(
                "h-4 w-4 flex-shrink-0",
                selectedFolderId === null
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-sm",
                selectedFolderId === null && "font-semibold text-primary"
              )}
            >
              Root (Home)
            </span>
          </div>

          <ScrollArea className="h-[350px] border rounded-md p-2">
            {folderTree.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Folder className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No folders available
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {folderTree.map((node) => renderFolderNode(node))}
              </div>
            )}
          </ScrollArea>
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
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || selectedFolderId === currentFolderId}
          >
            {isLoading ? "Moving..." : "Move Here"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
