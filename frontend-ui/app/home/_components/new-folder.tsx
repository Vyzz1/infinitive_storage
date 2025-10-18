"use client";
import { createFolder } from "@/app/actions/folder.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useFolderStore } from "../_context/folder-context";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const newFolderSchema = z.object({
  name: z.string().min(3, "At least 3 characters"),
});
export default function NewFolder() {
  const form = useForm({
    resolver: zodResolver(newFolderSchema),
    defaultValues: {
      name: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const { open, setOpen } = useFolderStore();

  const { id } = useParams<{ id: string }>();

  async function onSubmit(data: z.infer<typeof newFolderSchema>) {
    setLoading(true);
    try {
      const res = await createFolder(data.name, id);
      if (res) {
        form.reset({
          name: "",
        });

        toast.success("Create folder successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="pointer-events-none"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Create a new folder</DialogTitle>
        </DialogHeader>
        <div className="p-4 pointer-events-none" contextMenu="return false;">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-3 justify-end mt-5">
                <Button
                  onClick={() => setOpen(false)}
                  type="button"
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  {loading && <Loader className="animate-spin" />}
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
