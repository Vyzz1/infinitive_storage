"use client";

import { Search, UserIcon, Settings, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logout from "./logout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useCallback, useEffect } from "react";
import { searchFiles } from "@/app/actions/file.action";
import { searchFolders } from "@/app/actions/folder.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileIcon } from "@/components/file-icon";
import { FolderIcon } from "@/components/folder-icon";

interface AppHeaderProps {
  user: any;
}

export function AppHeader({ user }: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    files: FileDbItem[];
    folders: FolderDbItem[];
  }>({ files: [], folders: [] });
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults({ files: [], folders: [] });
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      setShowResults(true);

      try {
        const [files, folders] = await Promise.all([
          searchFiles(query),
          searchFolders(query),
        ]);

        setSearchResults({ files, folders });
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to search");
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const handleFileClick = (file: FileDbItem) => {
    sessionStorage.setItem(`file_${file.id}`, JSON.stringify(file));
    
    window.open(`/preview/${file.id}`, '_blank');
    
    setShowResults(false);
    setSearchQuery("");
    
    toast.success("Opening file in new tab...");
  };

  const handleFolderClick = (folder: FolderDbItem) => {
    router.push(`/home/folder/${folder.id}`);
    setShowResults(false);
    setSearchQuery("");
  };

  const totalResults = searchResults.files.length + searchResults.folders.length;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />

      <div className="flex w-full items-center justify-between flex-1">
        <div className="flex-1 max-w-2xl">
          <Popover open={showResults} onOpenChange={setShowResults}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search files, folders, and documents..."
                  className="w-full pl-10 h-10 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery) setShowResults(true);
                  }}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[600px] p-0"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Command>
                <CommandList>
                  {isSearching ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Searching...
                    </div>
                  ) : totalResults === 0 && searchQuery ? (
                    <CommandEmpty>No results found.</CommandEmpty>
                  ) : (
                    <>
                      {searchResults.folders.length > 0 && (
                        <CommandGroup heading={`Folders (${searchResults.folders.length})`}>
                          {searchResults.folders.slice(0, 5).map((folder) => (
                            <CommandItem
                              key={folder.id}
                              onSelect={() => handleFolderClick(folder)}
                              className="cursor-pointer"
                            >
                              <FolderIcon
                                folder={folder}
                                className="mr-2 h-4 w-4"
                              />
                              <span>{folder.name}</span>
                              {folder.location && folder.location !== "root" && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {folder.location}
                                </span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}

                      {searchResults.files.length > 0 && (
                        <CommandGroup heading={`Files (${searchResults.files.length})`}>
                          {searchResults.files.slice(0, 5).map((file) => (
                            <CommandItem
                              key={file.id}
                              onSelect={() => handleFileClick(file)}
                              className="cursor-pointer"
                            >
                              <FileIcon file={file} className="mr-2 h-4 w-4" />
                              <span className="truncate">{file.fileName}</span>
                              {file.location && file.location !== "root" && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {file.location}
                                </span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <Button variant="ghost" className="p-0">
              <FileQuestion className="size-5" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative size-10 rounded-full p-0"
              >
                <Avatar className="size-10">
                  <AvatarImage
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Logout />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}