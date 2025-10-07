import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { restoreSession } from "./store/slices/authSlice";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Music from "./pages/Music";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const dispatch = useDispatch();//do Redux, que permite enviar ações (actions) para o estado global

  useEffect(() => {//é executado automaticamente assim que o app é carregado pela primeira vez.
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(restoreSession(user));
      } catch (error) {
        sessionStorage.removeItem('user');
      }
    }
  }, [dispatch]);
  //[dispatch] -> executa o useEffect toda vez que dispatch mudar

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/playlists" element={<PrivateRoute><Playlists /></PrivateRoute>} />
        <Route path="/playlists/:id" element={<PrivateRoute><PlaylistDetail /></PrivateRoute>} />
        <Route path="/music" element={<PrivateRoute><Music /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
