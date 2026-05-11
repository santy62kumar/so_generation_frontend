import { useState } from "react";
import Navbar         from "./components/Navbar";
import KitchenPDFForm from "./components/KitchenForm";
import XLSXConverter  from "./components/XlsxToCsvUploader";

const VIEWS = {
  kitchen: KitchenPDFForm,
  xlsx:    XLSXConverter,
};

export default function App() {
  const [activeTab, setActiveTab] = useState("kitchen");
  const ActiveView = VIEWS[activeTab];

  return (
    <>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <ActiveView />
    </>
  );
}