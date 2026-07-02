import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";


export const checkUser = async () => {
  const user = await currentUser();

  console.log("Clerk User:", user?.id);

  if (!user) {
    console.log("No Clerk user found");
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    console.log("Existing User:", loggedInUser);

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    console.log("Created User:", newUser);

    return newUser;
  } catch (error) {
    console.error("checkUser Error:", error);
  }
};