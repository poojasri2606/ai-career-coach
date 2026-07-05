"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // Step 1: Check if insights already exist
    let industryInsight = await db.industryInsight.findUnique({
      where: {
        industry: data.industry,
      },
    });

    // Step 2: Generate AI insights BEFORE transaction
    let insights = null;

    if (!industryInsight) {
      insights = await generateAIInsights(data.industry);
    }

    // Step 3: Start transaction
    const result = await db.$transaction(async (tx) => {
      let savedIndustryInsight = industryInsight;

      // Create industry insight if it doesn't exist
      if (!savedIndustryInsight) {
        savedIndustryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ),
          },
        });
      }

      // Update user profile
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return {
        updatedUser,
        industryInsight: savedIndustryInsight,
      };
    });

    revalidatePath("/");

    return result.updatedUser;
  } catch (error) {
    console.error("Update User Error:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to update profile"
    );
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}