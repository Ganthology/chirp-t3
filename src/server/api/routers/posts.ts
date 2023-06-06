import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { z } from "zod";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
});
