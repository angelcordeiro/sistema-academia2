/**
 * PerfilNutricionista - Página de perfil detalhado do nutricionista
 * Exibe informações completas, alunos vinculados e planos alimentares
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Users, Clock, DollarSign, Plus, Trash2, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { toast } from "sonner";

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

interface VinculacaoAluno {
  id: string;
  alunoId: string;
  alunoNome: string;
  nutricionistaId: string;
  dataVinculacao: string;
  status: "ativo" | "inativo";
}

interface PlanoAlimentar {
  id: string;
  vinculacaoId: string;
  alunoId: string;
  alunoNome: string;
  nutricionistaId: string;
  titulo: string;
  descricao: string;
  objetivo: string;
  restricoes: string;
  dataInicio: string;
  dataTermino: string;
  status: "ativo" | "concluído" | "suspenso";
}

interface Consulta {
  id: string;
  vinculacaoId: string;
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
  const [vinculacoes, setVinculacoes] = useState<VinculacaoAluno[]>([]);
  const [planosAlimentares, setPlanosAlimentares] = useState<PlanoAlimentar[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [alunosAtendidos, setAlunosAtendidos] = useState<Aluno[]>([]);

  // Dialog states
  const [isVinculacaoDialogOpen, setIsVinculacaoDialogOpen] = useState(false);
  const [isPlanoDialogOpen, setIsPlanoDialogOpen] = useState(false);
  const [selectedVinculacao, setSelectedVinculacao] = useState<VinculacaoAluno | null>(null);
  const [editingPlano, setEditingPlano] = useState<PlanoAlimentar | null>(null);

  // Form states
  const [vinculacaoFormData, setVinculacaoFormData] = useState({
    alunoId: "",
  });

  const [planoFormData, setPlanoFormData] = useState({
    titulo: "",
    descricao: "",
    objetivo: "",
    restricoes: "",
    dataInicio: "",
    dataTermino: "",
  });

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
    const storedVinculacoes = JSON.parse(localStorage.getItem("vinculacoes") || "[]");
    const storedPlanos = JSON.parse(localStorage.getItem("planosAlimentares") || "[]");
    const storedConsultas = JSON.parse(localStorage.getItem("consultas") || "[]");

    setAlunos(storedAlunos);

    // Filtrar vinculações deste nutricionista
    const vinculacoesNutricionista = storedVinculacoes.filter(
      (v: VinculacaoAluno) => v.nutricionistaId === nutricionistaId
    );
    setVinculacoes(vinculacoesNutricionista);

    // Filtrar planos alimentares deste nutricionista
    const planosNutricionista = storedPlanos.filter(
      (p: PlanoAlimentar) => p.nutricionistaId === nutricionistaId
    );
    setPlanosAlimentares(planosNutricionista);

    // Filtrar consultas deste nutricionista
    const consultasNutricionista = storedConsultas.filter(
      (c: Consulta) => c.nutricionistaId === nutricionistaId
    );
    setConsultas(consultasNutricionista);

    // Extrair alunos únicos que este nutricionista atende
    const idsAlunosSet = new Set(vinculacoesNutricionista.map((v: VinculacaoAluno) => v.alunoId));
    const idsAlunos = Array.from(idsAlunosSet);
    const alunosUnicos = storedAlunos.filter((a: Aluno) => idsAlunos.includes(a.id));
    setAlunosAtendidos(alunosUnicos);
  };

  const handleVincularAluno = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vinculacaoFormData.alunoId) {
      toast.error("Selecione um aluno!");
      return;
    }

    // Verificar se já existe vinculação ativa
    const jaVinculado = vinculacoes.some(
      (v) => v.alunoId === vinculacaoFormData.alunoId && v.nutricionistaId === nutricionistaId && v.status === "ativo"
    );

    if (jaVinculado) {
      toast.error("Este aluno já está vinculado a este nutricionista!");
      return;
    }

    const alunoSelecionado = alunos.find((a) => a.id === vinculacaoFormData.alunoId);
    if (!alunoSelecionado) return;

    const novaVinculacao: VinculacaoAluno = {
      id: Date.now().toString(),
      alunoId: vinculacaoFormData.alunoId,
      alunoNome: alunoSelecionado.nome,
      nutricionistaId: nutricionistaId!,
      dataVinculacao: new Date().toISOString().split("T")[0],
      status: "ativo",
    };

    const storedVinculacoes = JSON.parse(localStorage.getItem("vinculacoes") || "[]");
    localStorage.setItem("vinculacoes", JSON.stringify([...storedVinculacoes, novaVinculacao]));

    setVinculacoes([...vinculacoes, novaVinculacao]);
    toast.success("Aluno vinculado com sucesso!");
    setIsVinculacaoDialogOpen(false);
    setVinculacaoFormData({ alunoId: "" });
    loadDados();
  };

  const handleCriarPlano = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVinculacao || !planoFormData.titulo) {
      toast.error("Preencha os dados do plano!");
      return;
    }

    if (editingPlano) {
      // Editar plano existente
      const updated = planosAlimentares.map((p) =>
        p.id === editingPlano.id
          ? {
              ...p,
              titulo: planoFormData.titulo,
              descricao: planoFormData.descricao,
              objetivo: planoFormData.objetivo,
              restricoes: planoFormData.restricoes,
              dataInicio: planoFormData.dataInicio,
              dataTermino: planoFormData.dataTermino,
            }
          : p
      );
      localStorage.setItem("planosAlimentares", JSON.stringify(updated));
      setPlanosAlimentares(updated);
      toast.success("Plano atualizado com sucesso!");
    } else {
      // Criar novo plano
      const novoPlano: PlanoAlimentar = {
        id: Date.now().toString(),
        vinculacaoId: selectedVinculacao.id,
        alunoId: selectedVinculacao.alunoId,
        alunoNome: selectedVinculacao.alunoNome,
        nutricionistaId: nutricionistaId!,
        titulo: planoFormData.titulo,
        descricao: planoFormData.descricao,
        objetivo: planoFormData.objetivo,
        restricoes: planoFormData.restricoes,
        dataInicio: planoFormData.dataInicio,
        dataTermino: planoFormData.dataTermino,
        status: "ativo",
      };

      const storedPlanos = JSON.parse(localStorage.getItem("planosAlimentares") || "[]");
      localStorage.setItem("planosAlimentares", JSON.stringify([...storedPlanos, novoPlano]));

      setPlanosAlimentares([...planosAlimentares, novoPlano]);
      toast.success("Plano alimentar criado com sucesso!");
    }

    setIsPlanoDialogOpen(false);
    setSelectedVinculacao(null);
    setEditingPlano(null);
    setPlanoFormData({
      titulo: "",
      descricao: "",
      objetivo: "",
      restricoes: "",
      dataInicio: "",
      dataTermino: "",
    });
  };

  const handleDeletePlano = (planoId: string) => {
    const updated = planosAlimentares.filter((p) => p.id !== planoId);
    localStorage.setItem("planosAlimentares", JSON.stringify(updated));
    setPlanosAlimentares(updated);
    toast.success("Plano excluído com sucesso!");
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

  const alunosDisponiveis = alunos.filter(
    (a) =>
      !vinculacoes.some(
        (v) => v.alunoId === a.id && v.nutricionistaId === nutricionistaId && v.status === "ativo"
      )
  );

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
              <CardTitle className="text-sm text-muted-foreground">Alunos Vinculados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{alunosAtendidos.length}</p>
              <p className="text-xs text-muted-foreground mt-1">alunos</p>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Planos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {planosAlimentares.filter((p) => p.status === "ativo").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">planos</p>
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

        {/* Alunos Vinculados e Planos Alimentares */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Alunos Vinculados */}
          <Card className="brutal-card bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Alunos Vinculados ({alunosAtendidos.length})
              </CardTitle>
              <Button
                onClick={() => setIsVinculacaoDialogOpen(true)}
                className="brutal-button bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Vincular
              </Button>
            </CardHeader>
            <CardContent>
              {alunosAtendidos.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum aluno vinculado ainda
                </p>
              ) : (
                <div className="space-y-2">
                  {alunosAtendidos.map((aluno) => {
                    const planosDoAluno = planosAlimentares.filter(
                      (p) => p.alunoId === aluno.id && p.status === "ativo"
                    );
                    return (
                      <div
                        key={aluno.id}
                        className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground font-bold text-sm">
                                {aluno.nome.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{aluno.nome}</p>
                              <p className="text-xs text-muted-foreground">
                                {planosDoAluno.length} plano(s) ativo(s)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Planos Alimentares */}
          <Card className="brutal-card bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Planos Alimentares ({planosAlimentares.filter((p) => p.status === "ativo").length})</CardTitle>
              <Button
                onClick={() => {
                  if (alunosAtendidos.length === 0) {
                    toast.error("Vincule um aluno primeiro!");
                    return;
                  }
                  const vinculacao = vinculacoes.find((v) => v.status === "ativo");
                  if (vinculacao) {
                    setSelectedVinculacao(vinculacao);
                    setIsPlanoDialogOpen(true);
                  }
                }}
                className="brutal-button bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Novo Plano
              </Button>
            </CardHeader>
            <CardContent>
              {planosAlimentares.filter((p) => p.status === "ativo").length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum plano alimentar ativo
                </p>
              ) : (
                <div className="space-y-3">
                  {planosAlimentares
                    .filter((p) => p.status === "ativo")
                    .map((plano) => (
                      <div
                        key={plano.id}
                        className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-sm">{plano.titulo}</p>
                            <p className="text-xs text-muted-foreground">{plano.alunoNome}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setEditingPlano(plano);
                                setPlanoFormData({
                                  titulo: plano.titulo,
                                  descricao: plano.descricao,
                                  objetivo: plano.objetivo,
                                  restricoes: plano.restricoes,
                                  dataInicio: plano.dataInicio,
                                  dataTermino: plano.dataTermino,
                                });
                                setSelectedVinculacao(
                                  vinculacoes.find((v) => v.id === plano.vinculacaoId) || null
                                );
                                setIsPlanoDialogOpen(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="brutal-button"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeletePlano(plano.id)}
                              variant="destructive"
                              size="sm"
                              className="brutal-button"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-foreground mb-1">{plano.descricao}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Objetivo: {plano.objetivo}</span>
                          <span>
                            {plano.dataInicio} até {plano.dataTermino}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
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

        {/* Dialog de Vinculação */}
        <Dialog open={isVinculacaoDialogOpen} onOpenChange={setIsVinculacaoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vincular Aluno</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleVincularAluno}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="aluno">Selecione um Aluno *</Label>
                  <Select value={vinculacaoFormData.alunoId} onValueChange={(value) => setVinculacaoFormData({ alunoId: value })}>
                    <SelectTrigger id="aluno">
                      <SelectValue placeholder="Escolha um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {alunosDisponiveis.map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id}>
                          {aluno.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsVinculacaoDialogOpen(false)}
                  className="brutal-button"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="brutal-button bg-primary">
                  Vincular
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog de Plano Alimentar */}
        <Dialog open={isPlanoDialogOpen} onOpenChange={setIsPlanoDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlano ? "Editar Plano Alimentar" : "Novo Plano Alimentar"}
              </DialogTitle>
            </DialogHeader>
            {selectedVinculacao && (
              <form onSubmit={handleCriarPlano}>
                <div className="space-y-4 py-4">
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm font-medium">{selectedVinculacao.alunoNome}</p>
                  </div>

                  <div>
                    <Label htmlFor="titulo">Título do Plano *</Label>
                    <Input
                      id="titulo"
                      value={planoFormData.titulo}
                      onChange={(e) => setPlanoFormData({ ...planoFormData, titulo: e.target.value })}
                      placeholder="Ex: Plano de Emagrecimento"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="objetivo">Objetivo *</Label>
                    <Input
                      id="objetivo"
                      value={planoFormData.objetivo}
                      onChange={(e) => setPlanoFormData({ ...planoFormData, objetivo: e.target.value })}
                      placeholder="Ex: Perder 5kg em 3 meses"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={planoFormData.descricao}
                      onChange={(e) => setPlanoFormData({ ...planoFormData, descricao: e.target.value })}
                      placeholder="Descreva o plano alimentar..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="restricoes">Restrições e Alergias</Label>
                    <Textarea
                      id="restricoes"
                      value={planoFormData.restricoes}
                      onChange={(e) => setPlanoFormData({ ...planoFormData, restricoes: e.target.value })}
                      placeholder="Alimentos proibidos, alergias, intolerâncias..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="dataInicio">Data de Início</Label>
                      <Input
                        id="dataInicio"
                        type="date"
                        value={planoFormData.dataInicio}
                        onChange={(e) => setPlanoFormData({ ...planoFormData, dataInicio: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataTermino">Data de Término</Label>
                      <Input
                        id="dataTermino"
                        type="date"
                        value={planoFormData.dataTermino}
                        onChange={(e) => setPlanoFormData({ ...planoFormData, dataTermino: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsPlanoDialogOpen(false);
                      setEditingPlano(null);
                      setPlanoFormData({
                        titulo: "",
                        descricao: "",
                        objetivo: "",
                        restricoes: "",
                        dataInicio: "",
                        dataTermino: "",
                      });
                    }}
                    className="brutal-button"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="brutal-button bg-accent">
                    {editingPlano ? "Salvar Alterações" : "Criar Plano"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
