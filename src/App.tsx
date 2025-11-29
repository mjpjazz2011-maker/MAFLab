import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { EstudanteDashboard } from "./pages/estudante/Dashboard";
import { SessaoCritica } from "./pages/estudante/SessaoCritica";
import { Notas } from "./pages/estudante/Notas";
import { Gamificacao } from "./pages/estudante/Gamificacao";
import { Uploads } from "./pages/estudante/Uploads";
import { MapaCognitivo } from "./pages/estudante/MapaCognitivo";
import { Relatorios } from "./pages/estudante/Relatorios";
import { Configuracoes } from "./pages/estudante/Configuracoes";
import { SessaoIA } from "./pages/estudante/SessaoIA";
import { HistoricoIA } from "./pages/estudante/HistoricoIA";


import { OrientadorDashboard } from "./pages/orientador/Dashboard";
import { EstudanteDetail } from "./pages/orientador/EstudanteDetail";
import { PeerReview } from "./pages/orientador/PeerReview";
import { DocenteDashboard } from "./pages/docente/Dashboard";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminUtilizadores } from "./pages/admin/Utilizadores";
import { AdminRelatorios } from "./pages/admin/Relatorios";


import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/estudante" element={<ProtectedRoute allowedTypes={['estudante']}><EstudanteDashboard /></ProtectedRoute>} />
            <Route path="/sessao-critica" element={<ProtectedRoute allowedTypes={['estudante']}><SessaoCritica /></ProtectedRoute>} />
            <Route path="/notas" element={<ProtectedRoute allowedTypes={['estudante']}><Notas /></ProtectedRoute>} />
            <Route path="/mapa-cognitivo" element={<ProtectedRoute allowedTypes={['estudante']}><MapaCognitivo /></ProtectedRoute>} />
            <Route path="/uploads" element={<ProtectedRoute allowedTypes={['estudante']}><Uploads /></ProtectedRoute>} />
            <Route path="/gamificacao" element={<ProtectedRoute allowedTypes={['estudante']}><Gamificacao /></ProtectedRoute>} />

            <Route path="/escrita-ia" element={<ProtectedRoute allowedTypes={['estudante']}><SessaoIA /></ProtectedRoute>} />
            <Route path="/historico-ia" element={<ProtectedRoute allowedTypes={['estudante']}><HistoricoIA /></ProtectedRoute>} />



            <Route path="/relatorios" element={<ProtectedRoute allowedTypes={['estudante']}><Relatorios /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute allowedTypes={['estudante']}><Configuracoes /></ProtectedRoute>} />

            
            <Route path="/orientador" element={<ProtectedRoute allowedTypes={['orientador']}><OrientadorDashboard /></ProtectedRoute>} />
            <Route path="/orientador/estudante/:id" element={<ProtectedRoute allowedTypes={['orientador']}><EstudanteDetail /></ProtectedRoute>} />
            <Route path="/orientador/peer-review" element={<ProtectedRoute allowedTypes={['orientador']}><PeerReview /></ProtectedRoute>} />
            
            <Route path="/docente" element={<ProtectedRoute allowedTypes={['docente']}><DocenteDashboard /></ProtectedRoute>} />
            
            <Route path="/admin" element={<ProtectedRoute allowedTypes={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/utilizadores" element={<ProtectedRoute allowedTypes={['admin']}><AdminUtilizadores /></ProtectedRoute>} />
            <Route path="/admin/relatorios" element={<ProtectedRoute allowedTypes={['admin']}><AdminRelatorios /></ProtectedRoute>} />

            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
