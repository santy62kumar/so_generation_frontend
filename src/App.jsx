// // import { useState } from "react";
// // import Navbar         from "./components/Navbar";
// // import KitchenPDFForm from "./components/KitchenForm";
// // import XLSXConverter  from "./components/XlsxToCsvUploader";

// // const VIEWS = {
// //   kitchen: KitchenPDFForm,
// //   xlsx:    XLSXConverter,
// // };

// // export default function App() {
// //   const [activeTab, setActiveTab] = useState("kitchen");
// //   const ActiveView = VIEWS[activeTab];

// //   return (
// //     <>
// //       <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
// //       <ActiveView />
// //     </>
// //   );
// // }


// import { useState } from "react";
// import Navbar         from "./components/Navbar";
// import HomePage       from "./components/HomePage";
// import KitchenPDFForm from "./components/KitchenForm";
// import XLSXConverter  from "./components/XlsxToCsvUploader";
// import WarrantyForm   from "./components/WarrantyForm";   // ← new
// import InstallationReportForm  from "./components/InstallationReportForm"; // ← NEW

// const VIEWS = {
//   home:    HomePage,
//   kitchen: KitchenPDFForm,
//   xlsx:    XLSXConverter,
//   warranty: WarrantyForm,
// };

// export default function App() {
//   const [activeView, setActiveView] = useState("home");  // home page by default

//   const ActiveView = VIEWS[activeView];

//   return (
//     <>
//       <Navbar activeView={activeView} onNavigate={setActiveView} />
//       <ActiveView onNavigate={setActiveView} />
//     </>
//   );
// }

/**
 * App.jsx — add the "installation" view alongside your existing views.
 *
 * Only the changed/added parts are shown below.
 * Merge this into your existing App.jsx.
 */

import React, { useState } from "react";
import Navbar                  from "./components/Navbar";
import HomePage                from "./components/HomePage";
import KitchenForm             from "./components/KitchenForm";
import WarrantyForm            from "./components/WarrantyForm";
import InstallationReportForm  from "./components/InstallationReportForm"; // ← NEW

// Add your existing XlsxUploader import here too
import XlsxUploader from "./components/XlsxToCsvUploader";

export default function App() {
  const [view, setView] = useState("home");

  return (
    <>
      <Navbar activeView={view} onNavigate={setView} />

      {view === "home"         && <HomePage onNavigate={setView} />}
      {view === "kitchen"      && <KitchenForm />}
      {view === "warranty"     && <WarrantyForm />}
      {view === "installation" && <InstallationReportForm />}   {/* ← NEW */}
      {view === "xlsx" && <XlsxUploader />}
    </>
  );
}