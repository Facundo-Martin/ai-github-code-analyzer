"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import Image from "next/image";
import { api } from "~/trpc/react";
import { toast } from "sonner";

const formSchema = z.object({
  repoUrl: z.url().min(1, {
    message: "Username must be at least 2 characters.",
  }),
  projectName: z.string().min(1, {
    message: "Username must be at least 2 characters.",
  }),
  githubToken: z.string().optional(),
});

export default function CreateProjectPage() {
  const { mutate: createProject, isPending: isCreatingProject } =
    api.project.create.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: "",
      projectName: "",
      githubToken: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createProject(values, {
      onSuccess: () => {
        toast.success("Project created successfully");
        form.reset();
      },
      onError: () => {
        toast.error("Failed to create project");
      },
    });
  }

  return (
    <div className="grid h-full place-items-center">
      <div className="flex h-full items-center justify-center gap-12">
        {/* TODO: Add create project image */}
        <Image src="/image.png" alt="hmm" height={56} width={120} />
        <div>
          <h1 className="text-2xl font-semibold">
            Link your Github Repository
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the URL of your repository to link it to Dionysus
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-2"
            >
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input required placeholder="Project Name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        required
                        type="url"
                        placeholder="Repo URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubToken"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Github Token (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-2 cursor-pointer"
                disabled={isCreatingProject}
              >
                Create Project
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
