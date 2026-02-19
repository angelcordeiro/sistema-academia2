/**
 * DashboardLayout - Brutalismo Digital Suavizado
 * Layout com sidebar fixa à esquerda, estrutura geométrica forte
 * Paleta: bege claro, verde-oliva, laranja queimado
 */

import { Link, useLocation } from "wouter";
import { Dumbbell, Users, GraduationCap, ClipboardList, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: "/", label: "Início", icon: Home },
  { path: "/alunos", label: "Alunos", icon: Users },
  { path: "/professores", label: "Professores", icon: GraduationCap },
  { path: "/treinos", label: "Treinos", icon: ClipboardList },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - Estrutura geométrica forte */}
      <aside className="w-64 bg-sidebar border-r-4 border-sidebar-border flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b-4 border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">GymSystem</h1>
              <p className="text-xs text-muted-foreground">Gestão Completa</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150",
                    "border-2 font-medium",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary shadow-sm scale-[1.02]"
                      : "bg-sidebar-accent text-sidebar-accent-foreground border-transparent hover:border-sidebar-border hover:scale-[1.02]"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t-4 border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            Sprint 2 - Sistema Academia
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
