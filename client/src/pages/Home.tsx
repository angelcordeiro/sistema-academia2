/**
 * Home - Dashboard principal
 * Brutalismo Digital Suavizado: cards com bordas grossas, grid assimétrico
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, ClipboardList, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Stats {
  totalAlunos: number;
  totalProfessores: number;
  totalTreinos: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalAlunos: 0,
    totalProfessores: 0,
    totalTreinos: 0,
  });

  useEffect(() => {
    // Carregar estatísticas do localStorage
    const alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
    const professores = JSON.parse(localStorage.getItem("professores") || "[]");
    const treinos = JSON.parse(localStorage.getItem("treinos") || "[]");

    setStats({
      totalAlunos: alunos.length,
      totalProfessores: professores.length,
      totalTreinos: treinos.length,
    });
  }, []);

  const statCards = [
    {
      title: "Total de Alunos",
      value: stats.totalAlunos,
      icon: Users,
      color: "bg-primary",
    },
    {
      title: "Total de Professores",
      value: stats.totalProfessores,
      icon: GraduationCap,
      color: "bg-accent",
    },
    {
      title: "Total de Treinos",
      value: stats.totalTreinos,
      icon: ClipboardList,
      color: "bg-primary",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de gestão</p>
        </div>

        {/* Stats Grid - Grid assimétrico */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="brutal-card bg-card hover:shadow-lg"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Welcome Card */}
        <Card className="brutal-card bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Bem-vindo ao GymSystem</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Sistema completo de gestão para academias
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-foreground">Cadastro Completo</p>
                  <p className="text-sm text-muted-foreground">
                    Gerencie alunos, professores e treinos em um só lugar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-foreground">Edição e Exclusão</p>
                  <p className="text-sm text-muted-foreground">
                    Atualize ou remova registros com facilidade
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-foreground">Interface Intuitiva</p>
                  <p className="text-sm text-muted-foreground">
                    Design moderno e funcional para máxima produtividade
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
