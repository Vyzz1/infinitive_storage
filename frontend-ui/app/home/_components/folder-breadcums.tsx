import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

interface FolderBreadcumsProps {
  folders: { id: string; name: string }[];
}
export default function FolderBreadcums({ folders }: FolderBreadcumsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="text-lg font-normal">
            <Link href="/home">Home </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {folders.slice(0, -1).map((folder) => (
          <React.Fragment key={folder.id}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/home/folder/${folder.id}`}
                className="text-lg font-normal"
              >
                {folder.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}

        <BreadcrumbItem>
          <BreadcrumbPage className="text-lg font-normal">
            {folders[folders.length - 1]?.name}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
