// import { useState } from "react";
// import Navbar         from "./components/Navbar";
// import KitchenPDFForm from "./components/KitchenForm";
// import XLSXConverter  from "./components/XlsxToCsvUploader";

// const VIEWS = {
//   kitchen: KitchenPDFForm,
//   xlsx:    XLSXConverter,
// };

// export default function App() {
//   const [activeTab, setActiveTab] = useState("kitchen");
//   const ActiveView = VIEWS[activeTab];

//   return (
//     <>
//       <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
//       <ActiveView />
//     </>
//   );
// }


import { useState } from "react";
import Navbar         from "./components/Navbar";
import HomePage       from "./components/HomePage";
import KitchenPDFForm from "./components/KitchenForm";
import XLSXConverter  from "./components/XlsxToCsvUploader";
import WarrantyForm   from "./components/WarrantyForm";   // ← new

const VIEWS = {
  home:    HomePage,
  kitchen: KitchenPDFForm,
  xlsx:    XLSXConverter,
  warranty: WarrantyForm,
};

export default function App() {
  const [activeView, setActiveView] = useState("home");  // home page by default

  const ActiveView = VIEWS[activeView];

  return (
    <>
      <Navbar activeView={activeView} onNavigate={setActiveView} />
      <ActiveView onNavigate={setActiveView} />
    </>
  );
}