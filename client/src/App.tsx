import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Alunos from "./pages/Alunos";
import PerfilAluno from "./pages/PerfilAluno";
import Professores from "./pages/Professores";
import PerfilProfessor from "./pages/PerfilProfessor";
import Treinos from "./pages/Treinos";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/alunos" component={Alunos} />
      <Route path="/alunos/:id" component={PerfilAluno} />
      <Route path="/professores" component={Professores} />
      <Route path="/professores/:id" component={PerfilProfessor} />
      <Route path="/treinos" component={Treinos} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
