import { type User } from "@clerk/nextjs/dist/types/server/clerkClient";

export const filterUserForClient = (user: User) => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
});
