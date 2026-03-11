/**
 * PerfilNutricionista - Página de perfil detalhado do nutricionista
 * Exibe informações completas e alunos vinculados
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Clock, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";

interface Nutricionista {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: string;
  crn: string;
  especialidade: string;
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

interface Aluno {
  id: string;
  nome: string;
}

interface Consulta {
  id: string;
  alunoId: string;
  alunoNome: string;
  nutricionistaId: string;
  nutricionistaNome: string;
  data: string;
  observacoes: string;
}

export default function PerfilNutricionista() {
  const [, params] = useRoute("/nutricionistas/:id");
  const [, navigate] = useLocation();
  const nutricionistaId = params?.id;

  const [nutricionista, setNutricionista] = useState<Nutricionista | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [alunosAtendidos, setAlunosAtendidos] = useState<Aluno[]>([]);

  useEffect(() => {
    loadNutricionista();
  }, [nutricionistaId]);

  const loadNutricionista = () => {
    if (!nutricionistaId) return;
    const nutricionistas = JSON.parse(localStorage.getItem("nutricionistas") || "[]");
    const found = nutricionistas.find((n: Nutricionista) => n.id === nutricionistaId);
    if (found) {
      setNutricionista(found);
      loadDados();
    } else {
      navigate("/nutricionistas");
    }
  };

  const loadDados = () => {
    const storedAlunos = JSON.parse(localStorage.getItem("alunos") || "[]");
    const storedConsultas = JSON.parse(localStorage.getItem("consultas") || "[]");

    setAlunos(storedAlunos);

    // Filtrar consultas deste nutricionista
    const consultasNutricionista = storedConsultas.filter(
      (c: Consulta) => c.nutricionistaId === nutricionistaId
    );
    setConsultas(consultasNutricionista);

    // Extrair alunos únicos que este nutricionista atende
    const idsAlunosSet = new Set(consultasNutricionista.map((c: Consulta) => c.alunoId));
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
    if (!nutricionista?.dataAdmissao) return 0;
    const hoje = new Date();
    const admissao = new Date(nutricionista.dataAdmissao);
    return Math.floor((hoje.getTime() - admissao.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (!nutricionista) {
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
            onClick={() => navigate("/nutricionistas")}
            variant="outline"
            className="brutal-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">{nutricionista.nome}</h1>
            <p className="text-muted-foreground">Perfil completo do nutricionista</p>
          </div>
        </div>

        {/* Grid de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Idade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{calcularIdade(nutricionista.dataNascimento)}</p>
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
              <CardTitle className="text-sm text-muted-foreground">Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{consultas.length}</p>
              <p className="text-xs text-muted-foreground mt-1">consultas</p>
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
                <p className="text-sm font-medium">{nutricionista.cpf}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sexo</p>
                <p className="text-sm font-medium capitalize">{nutricionista.sexo || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Data de Nascimento</p>
                <p className="text-sm font-medium">
                  {nutricionista.dataNascimento
                    ? new Date(nutricionista.dataNascimento).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">{nutricionista.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                <p className="text-sm font-medium">{nutricionista.telefone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Endereço</p>
                <p className="text-sm font-medium">{nutricionista.endereco || "—"}</p>
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
                <p className="text-sm font-medium">{nutricionista.especialidade}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">CRN</p>
                <p className="text-sm font-medium">{nutricionista.crn || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Formação</p>
                <p className="text-sm font-medium">{nutricionista.formacao || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Anos de Experiência</p>
                <p className="text-sm font-medium">{nutricionista.experiencia || "—"}</p>
              </div>
              {nutricionista.certificacoes && (
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Certificações</p>
                  <p className="text-sm font-medium">{nutricionista.certificacoes}</p>
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
                <p className="text-sm font-medium capitalize">{nutricionista.regimeContratacao || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Data de Admissão</p>
                <p className="text-sm font-medium">
                  {nutricionista.dataAdmissao
                    ? new Date(nutricionista.dataAdmissao).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Salário/Valor Hora</p>
                <p className="text-sm font-medium">
                  {nutricionista.salario > 0 ? `R$ ${nutricionista.salario.toFixed(2)}` : "—"}
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
                  <p className="text-sm font-medium">{nutricionista.horarioInicio || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Horário de Fim</p>
                  <p className="text-sm font-medium">{nutricionista.horarioFim || "—"}</p>
                </div>
              </div>
              {nutricionista.diasAtendimento && nutricionista.diasAtendimento.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Dias de Atendimento</p>
                  <div className="flex flex-wrap gap-2">
                    {nutricionista.diasAtendimento.map((dia) => (
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
        <Card className="brutal-card bg-card">
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
                      {consultas.filter((c) => c.alunoId === aluno.id).length} consulta(s)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contato de Emergência */}
        {(nutricionista.emergenciaContato || nutricionista.emergenciaTelefone) && (
          <Card className="brutal-card bg-card mt-6">
            <CardHeader>
              <CardTitle>Contato de Emergência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nome</p>
                  <p className="text-sm font-medium">{nutricionista.emergenciaContato || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                  <p className="text-sm font-medium">{nutricionista.emergenciaTelefone || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
