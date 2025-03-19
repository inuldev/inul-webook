import React from "react";

import LeftSideBar from "../components/LeftSideBar";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 pt-16">
        <LeftSideBar />
      </main>
    </div>
  );
};

export default HomePage;
