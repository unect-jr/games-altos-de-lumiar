import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { Album } from "./pages/Album";
import { Canto } from "./pages/Canto";
import { Creditos } from "./pages/Creditos";
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
      { path: "creditos", element: <Creditos /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
