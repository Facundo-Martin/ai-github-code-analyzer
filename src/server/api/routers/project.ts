import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        projectName: z.string().min(1),
        repoUrl: z.url().min(1),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.repoUrl,
          name: input.projectName,
          githubToken: input.githubToken,
          userToProjects: {
            create: {
              // TODO: Fix this assertion, userId should always be typed as string in protectedProcedures...!
              userId: ctx.user.userId!,
            },
          },
        },
      });
      return project;
    }),
});
