"use client";
import {useEffect, useState} from 'react';
import UserProfileSection from './UserProfileSection';

interface ClientOnlyRoleSectionProps {
  globalLanguageData?: Record<string, string>;
}

const ClientOnlyRoleSection = ({globalLanguageData}: ClientOnlyRoleSectionProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
    },
    []);

  if (!isClient) {
    // Return empty div during server-side rendering
    return <div></div>;
  }

  // Single-user mode: show both capabilities
  return (
    <>
      <UserProfileSection />
    </>
  );
};

export default ClientOnlyRoleSection;