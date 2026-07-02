
import { getUserOnboardingStatus } from '@/actions/user';
import OnboardingForm from './_components/onboarding-form';
import { industries } from '@/data/industries'
import React from 'react'

export default async function OnboardingPage() {
  // Check if user is already onboarded
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
}