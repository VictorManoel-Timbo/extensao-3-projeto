import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "@/router/router";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </QueryClientProvider>
);

export default App
