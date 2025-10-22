import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "./pages/Home/Home.tsx";
import Characters from "./pages/Characters/Characters.tsx";
import CharacterDetails from "./pages/CharacterDetails/CharacterDetails.tsx";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: "personajes", element: <Characters /> },
        { path: "personajes/:id", element: <CharacterDetails /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    // Opt-in early to v7 behavior where React.startTransition is used
    // Cast to `any` because the typed FutureConfig may not include upcoming flags yet.
    future: { v7_startTransition: true } as any,
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
