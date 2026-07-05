import React from "react";

const MainLayout = async ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">{children}</div>
  );
};

export default MainLayout;