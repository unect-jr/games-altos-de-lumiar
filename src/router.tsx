import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { EmBreve } from "./pages/EmBreve";
import { Inicio } from "./pages/Inicio";
import { Silhueta } from "./pages/Silhueta";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: "silhueta", element: <Silhueta /> },
      { path: "canto", element: <EmBreve titulo="Canto" /> },
      { path: "passeio", element: <EmBreve titulo="Passeio" /> },
      { path: "album", element: <EmBreve titulo="Álbum" /> },
      { path: "creditos", element: <EmBreve titulo="Créditos" /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
