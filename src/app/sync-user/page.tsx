import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export default async function SyncUser() {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { emailAddress: user.emailAddresses[0]?.emailAddress ?? "" },
        { phoneNumber: user.phoneNumbers[0]?.phoneNumber ?? "" },
      ],
    },
  });

  const userData = {
    emailAddress: user.emailAddresses[0]?.emailAddress ?? undefined,
    phoneNumber: user.phoneNumbers[0]?.phoneNumber ?? undefined,
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  if (existingUser) {
    await db.user.update({
      where: { id: existingUser.id },
      data: userData,
    });
  } else {
    await db.user.create({
      data: {
        id: user.id,
        ...userData,
      },
    });

    return redirect("/dashboard");
  }
}
