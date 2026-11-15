import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { Album } from "./pages/Album";
import { Canto } from "./pages/Canto";
import { EmBreve } from "./pages/EmBreve";
import { Inicio } from "./pages/Inicio";
import { Passeio } from "./pages/Passeio";
import { Silhueta } from "./pages/Silhueta";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: "silhueta", element: <Silhueta /> },
      { path: "canto", element: <Canto /> },
      { path: "passeio", element: <Passeio /> },
      { path: "album", element: <Album /> },
      { path: "creditos", element: <EmBreve titulo="Créditos" /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
