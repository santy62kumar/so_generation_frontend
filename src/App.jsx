import React, { useState } from "react";

import Navbar from "@/components/Navbar";
import HomePage from "@/components/HomePage";
import KitchenForm from "@/components/KitchenForm";
import WarrantyForm from "@/components/WarrantyForm";
import InstallationReportForm from "@/components/InstallationReportForm";
import DatabaseManager from "@/components/DatabaseManager";
import XlsxUploader from "@/components/XlsxToCsvUploader";

const VIEWS = {
  home: HomePage,
  kitchen: KitchenForm,
  warranty: WarrantyForm,
  installation: InstallationReportForm,
  xlsx: XlsxUploader,
  database: DatabaseManager,
};

export default function App() {
  const [view, setView] = useState("home");
  const ActiveView = VIEWS[view] ?? HomePage;

  return (
    <>
      <Navbar activeView={view} onNavigate={setView} />
      <ActiveView onNavigate={setView} />
    </>
  );
}
