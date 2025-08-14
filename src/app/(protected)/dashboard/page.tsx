"use client";

import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useProjects } from "~/hooks/use-projects";

export default function DashboardPage() {
  const { user } = useUser();
  const { selectedProject } = useProjects();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* Github link */}
        <div className="bg-primary flex w-fit items-center gap-x-2 rounded-md px-4 py-3">
          <Github className="size-5 text-white" />
          <div>
            <p className="text-sm font-medium text-white">
              This project is linked to{" "}
              <a
                href={selectedProject?.githubUrl ?? ""}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center text-white/80 hover:underline"
              >
                {selectedProject?.githubUrl}
                <ExternalLink className="ml-1 size-4" />
              </a>
            </p>
          </div>
        </div>
        {/* Action items */}
        <div className="flex items-center gap-4">
          Team Members Invite Button Smth else
        </div>
      </div>

      {/* Smth else */}
      <div className="mt4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          AskQuestionCard MeetingCard
        </div>
      </div>

      {/* Commits log */}
      <div className="mt-8">Commit log</div>
      <h1>{selectedProject?.name}</h1>
    </div>
  );
}
