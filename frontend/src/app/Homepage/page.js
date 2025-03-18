"use client";

import React from "react";
import Header from "../components/Header";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex flex-1 pt-16"></main>
    </div>
  );
};

export default HomePage;
