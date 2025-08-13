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
              userId: ctx.user.userId,
            },
          },
        },
      });
      return project;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.userId,
          },
        },
        deletedAt: null,
      },
      include: {
        userToProjects: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  }),
});
