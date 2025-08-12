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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div>
      <h1>Create project page</h1>
      <div className="flex h-full items-center justify-center gap-12">
        {/* TODO: Add create project image */}
        <Image src="" alt="hmm" height={56} width={120} />
        <div>
          <div>
            <h1 className="text-2xl font-semibold">
              Link your Github Repository
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter the URL of your repository to link it to Dionysus
            </p>
          </div>
          {/* Form goes here */}
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
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
                        <Input
                          placeholder="Github Token (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-2">
                  Create Project
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
