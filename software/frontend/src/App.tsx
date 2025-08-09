// import "./App.css";
// import MapComponent from "./components/LiveTackingMap";

// function App() {

//   return (
//     <div className="bg-gray-900 text-white h-screen flex flex-col">
//       <header className="p-4 bg-gray-800 shadow-lg z-10">
//         <h1 className="text-2xl font-bold text-center">
//           RASTRO - Seguimiento en Vivo
//         </h1>
//       </header>
//       <main className="flex-grow">
//         <MapComponent />
//       </main>
//     </div>
//   );
// }

// export default App;


import { Routes, Route, Link, useLocation } from "react-router-dom";
import LiveTrackingMap from "./components/LiveTrackingMap";
import ControlPointsMap from "./components/ControlPointsMap";
import "./App.css";

function App() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "bg-sky-500 text-white"
      : "bg-gray-700 hover:bg-gray-600";
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
      <header className="p-4 bg-gray-800 shadow-lg z-10">
        <h1 className="text-2xl font-bold text-center mb-4">
          RASTRO
        </h1>
        <nav className="flex justify-center space-x-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${getLinkClass('/')}`}
          >
            Seguimiento en Vivo
          </Link>
          <Link
            to="/puntos-de-control"
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${getLinkClass('/puntos-de-control')}`}
          >
            Puntos de Control
          </Link>
        </nav>
      </header>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LiveTrackingMap />} />
          <Route path="/puntos-de-control" element={<ControlPointsMap />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
