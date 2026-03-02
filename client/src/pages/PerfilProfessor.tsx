/**
 * PerfilProfessor - Página de perfil detalhado do professor
 * Exibe informações completas, alunos que atende, horários e estatísticas
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Clock, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";

interface Professor {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  especialidade: string;
  telefone: string;
  email: string;
  cref: string;
  regimeContratacao: string;
  dataAdmissao: string;
  salario: number;
  horarioInicio: string;
  horarioFim: string;
  diasAtendimento: string[];
  formacao: string;
  experiencia: string;
  certificacoes: string;
  endereco: string;
  emergenciaContato: string;
  emergenciaTelefone: string;
}

interface Treino {
  id: string;
  nome: string;
  alunoId: string;
  alunoNome: string;
  professorId: string;
  professorNome: string;
  descricao: string;
  objetivo: string;
  dataInicio: string;
}

interface Aluno {
  id: string;
  nome: string;
}

export default function PerfilProfessor() {
  const [, params] = useRoute("/professores/:id");
  const [, navigate] = useLocation();
  const professorId = params?.id;

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [alunosAtendidos, setAlunosAtendidos] = useState<Aluno[]>([]);

  useEffect(() => {
    loadProfessor();
  }, [professorId]);

  const loadProfessor = () => {
    if (!professorId) return;
    const professores = JSON.parse(localStorage.getItem("professores") || "[]");
    const found = professores.find((p: Professor) => p.id === professorId);
    if (found) {
      setProfessor(found);
      loadDados();
    } else {
      navigate("/professores");
    }
  };

  const loadDados = () => {
    const storedAlunos = JSON.parse(localStorage.getItem("alunos") || "[]");
    const storedTreinos = JSON.parse(localStorage.getItem("treinos") || "[]");

    setAlunos(storedAlunos);

    // Filtrar treinos deste professor
    const treinosProfessor = storedTreinos.filter(
      (t: Treino) => t.professorId === professorId
    );
    setTreinos(treinosProfessor);

    // Extrair alunos únicos que este professor atende
    const idsAlunosSet = new Set(treinosProfessor.map((t: Treino) => t.alunoId));
    const idsAlunos = Array.from(idsAlunosSet);
    const alunosUnicos = storedAlunos.filter((a: Aluno) => idsAlunos.includes(a.id));
    setAlunosAtendidos(alunosUnicos);
  };

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return "—";
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const calcularTempoAdmissao = () => {
    if (!professor?.dataAdmissao) return 0;
    const hoje = new Date();
    const admissao = new Date(professor.dataAdmissao);
    return Math.floor((hoje.getTime() - admissao.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (!professor) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/professores")}
            variant="outline"
            className="brutal-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">{professor.nome}</h1>
            <p className="text-muted-foreground">Perfil completo do professor</p>
          </div>
        </div>

        {/* Grid de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Idade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{calcularIdade(professor.dataNascimento)}</p>
              <p className="text-xs text-muted-foreground mt-1">anos</p>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Alunos Atendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{alunosAtendidos.length}</p>
              <p className="text-xs text-muted-foreground mt-1">alunos</p>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Treinos Criados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{treinos.length}</p>
              <p className="text-xs text-muted-foreground mt-1">treinos</p>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Dias na Academia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{calcularTempoAdmissao()}</p>
              <p className="text-xs text-muted-foreground mt-1">dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Informações Pessoais */}
        <Card className="brutal-card bg-card mb-6">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">CPF</p>
                <p className="text-sm font-medium">{professor.cpf}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sexo</p>
                <p className="text-sm font-medium capitalize">{professor.sexo || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Data de Nascimento</p>
                <p className="text-sm font-medium">
                  {professor.dataNascimento
                    ? new Date(professor.dataNascimento).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">{professor.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                <p className="text-sm font-medium">{professor.telefone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Endereço</p>
                <p className="text-sm font-medium">{professor.endereco || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Profissionais */}
        <Card className="brutal-card bg-card mb-6">
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Especialidade</p>
                <p className="text-sm font-medium">{professor.especialidade}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">CREF</p>
                <p className="text-sm font-medium">{professor.cref || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Formação</p>
                <p className="text-sm font-medium">{professor.formacao || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Anos de Experiência</p>
                <p className="text-sm font-medium">{professor.experiencia || "—"}</p>
              </div>
              {professor.certificacoes && (
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Certificações</p>
                  <p className="text-sm font-medium">{professor.certificacoes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações de Contratação */}
        <Card className="brutal-card bg-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Regime de Contratação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Regime</p>
                <p className="text-sm font-medium capitalize">{professor.regimeContratacao || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Data de Admissão</p>
                <p className="text-sm font-medium">
                  {professor.dataAdmissao
                    ? new Date(professor.dataAdmissao).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Salário/Valor Hora</p>
                <p className="text-sm font-medium">
                  {professor.salario > 0 ? `R$ ${professor.salario.toFixed(2)}` : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horários */}
        <Card className="brutal-card bg-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários de Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Horário de Início</p>
                  <p className="text-sm font-medium">{professor.horarioInicio || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Horário de Fim</p>
                  <p className="text-sm font-medium">{professor.horarioFim || "—"}</p>
                </div>
              </div>
              {professor.diasAtendimento && professor.diasAtendimento.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Dias de Atendimento</p>
                  <div className="flex flex-wrap gap-2">
                    {professor.diasAtendimento.map((dia) => (
                      <span
                        key={dia}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-medium"
                      >
                        {dia}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alunos que Atende */}
        <Card className="brutal-card bg-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Alunos que Atende ({alunosAtendidos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alunosAtendidos.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum aluno atendido ainda
              </p>
            ) : (
              <div className="space-y-2">
                {alunosAtendidos.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="p-3 border border-border rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">
                          {aluno.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium">{aluno.nome}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {treinos.filter((t) => t.alunoId === aluno.id).length} treino(s)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contato de Emergência */}
        {(professor.emergenciaContato || professor.emergenciaTelefone) && (
          <Card className="brutal-card bg-card">
            <CardHeader>
              <CardTitle>Contato de Emergência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nome</p>
                  <p className="text-sm font-medium">{professor.emergenciaContato || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                  <p className="text-sm font-medium">{professor.emergenciaTelefone || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
