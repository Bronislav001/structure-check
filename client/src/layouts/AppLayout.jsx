import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";

export default function AppLayout() {
  return (
    <>
      <Header />
      <Hero />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        <Outlet />
      </main>
    </>
  );
}
