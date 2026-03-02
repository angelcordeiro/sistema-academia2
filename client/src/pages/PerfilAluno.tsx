/**
 * PerfilAluno - Página de perfil detalhado do aluno
 * Exibe informações completas, histórico de medidas e estatísticas
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Aluno {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco: string;
  sexo: string;
  peso: number;
  altura: number;
  dataFiliacao: string;
  objetivoFitness: string;
  condicaoSaude: string;
  medicamentos: string;
  alergia: string;
  emergenciaContato: string;
  emergenciaTelefone: string;
}

interface HistoricoMedida {
  id: string;
  data: string;
  peso: number;
  altura: number;
  notas: string;
}

export default function PerfilAluno() {
  const [, params] = useRoute("/alunos/:id");
  const [, navigate] = useLocation();
  const alunoId = params?.id;

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [historico, setHistorico] = useState<HistoricoMedida[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMedidaId, setDeletingMedidaId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    peso: 0,
    altura: 0,
    notas: "",
  });

  useEffect(() => {
    loadAluno();
  }, [alunoId]);

  const loadAluno = () => {
    if (!alunoId) return;
    const alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
    const found = alunos.find((a: Aluno) => a.id === alunoId);
    if (found) {
      setAluno(found);
      loadHistorico();
    } else {
      navigate("/alunos");
    }
  };

  const loadHistorico = () => {
    if (!alunoId) return;
    const allHistorico = JSON.parse(localStorage.getItem("historicoMedidas") || "{}");
    setHistorico(allHistorico[alunoId] || []);
  };

  const saveHistorico = (data: HistoricoMedida[]) => {
    if (!alunoId) return;
    const allHistorico = JSON.parse(localStorage.getItem("historicoMedidas") || "{}");
    allHistorico[alunoId] = data;
    localStorage.setItem("historicoMedidas", JSON.stringify(allHistorico));
    setHistorico(data);
  };

  const handleAddMedida = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.peso || !formData.altura) {
      toast.error("Preencha peso e altura!");
      return;
    }

    const newMedida: HistoricoMedida = {
      id: Date.now().toString(),
      data: new Date().toISOString().split("T")[0],
      peso: formData.peso,
      altura: formData.altura,
      notas: formData.notas,
    };

    saveHistorico([...historico, newMedida]);
    toast.success("Medida registrada com sucesso!");
    setFormData({ peso: 0, altura: 0, notas: "" });
    setIsDialogOpen(false);
  };

  const handleDeleteMedida = (id: string) => {
    setDeletingMedidaId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingMedidaId) {
      const updated = historico.filter((m) => m.id !== deletingMedidaId);
      saveHistorico(updated);
      toast.success("Medida removida com sucesso!");
      setIsDeleteDialogOpen(false);
      setDeletingMedidaId(null);
    }
  };

  const calcularIMC = (peso: number, altura: number) => {
    if (!peso || !altura) return 0;
    const alturaMetros = altura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(1);
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

  const diasFiliacao = () => {
    if (!aluno?.dataFiliacao) return 0;
    const hoje = new Date();
    const filiacao = new Date(aluno.dataFiliacao);
    return Math.floor((hoje.getTime() - filiacao.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (!aluno) {
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
            onClick={() => navigate("/alunos")}
            variant="outline"
            className="brutal-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">{aluno.nome}</h1>
            <p className="text-muted-foreground">Perfil completo do aluno</p>
          </div>
        </div>

        {/* Grid de informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Idade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{calcularIdade(aluno.dataNascimento)}</p>
              <p className="text-xs text-muted-foreground mt-1">anos</p>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Peso Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{aluno.peso}</p>
              <p className="text-xs text-muted-foreground mt-1">kg</p>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">IMC</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{calcularIMC(aluno.peso, aluno.altura)}</p>
              <p className="text-xs text-muted-foreground mt-1">kg/m²</p>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Dias na Academia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{diasFiliacao()}</p>
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
                <p className="text-sm font-medium">{aluno.cpf}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sexo</p>
                <p className="text-sm font-medium capitalize">{aluno.sexo || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Data de Nascimento</p>
                <p className="text-sm font-medium">
                  {aluno.dataNascimento
                    ? new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">{aluno.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                <p className="text-sm font-medium">{aluno.telefone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Endereço</p>
                <p className="text-sm font-medium">{aluno.endereco || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Físicos */}
        <Card className="brutal-card bg-card mb-6">
          <CardHeader>
            <CardTitle>Dados Físicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Altura</p>
                <p className="text-2xl font-bold text-foreground">{aluno.altura} cm</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Peso</p>
                <p className="text-2xl font-bold text-foreground">{aluno.peso} kg</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">IMC</p>
                <p className="text-2xl font-bold text-foreground">{calcularIMC(aluno.peso, aluno.altura)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Fitness */}
        <Card className="brutal-card bg-card mb-6">
          <CardHeader>
            <CardTitle>Informações Fitness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Data de Filiação</p>
                <p className="text-sm font-medium">
                  {aluno.dataFiliacao
                    ? new Date(aluno.dataFiliacao).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Objetivo</p>
                <p className="text-sm font-medium capitalize">{aluno.objetivoFitness || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Saúde */}
        {(aluno.condicaoSaude || aluno.medicamentos || aluno.alergia) && (
          <Card className="brutal-card bg-card mb-6">
            <CardHeader>
              <CardTitle>Informações de Saúde</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aluno.condicaoSaude && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Condição de Saúde</p>
                  <p className="text-sm">{aluno.condicaoSaude}</p>
                </div>
              )}
              {aluno.medicamentos && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Medicamentos</p>
                  <p className="text-sm">{aluno.medicamentos}</p>
                </div>
              )}
              {aluno.alergia && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Alergias</p>
                  <p className="text-sm">{aluno.alergia}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contato de Emergência */}
        {(aluno.emergenciaContato || aluno.emergenciaTelefone) && (
          <Card className="brutal-card bg-card mb-6">
            <CardHeader>
              <CardTitle>Contato de Emergência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nome</p>
                  <p className="text-sm font-medium">{aluno.emergenciaContato || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                  <p className="text-sm font-medium">{aluno.emergenciaTelefone || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico de Medidas */}
        <Card className="brutal-card bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Histórico de Medidas</CardTitle>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="brutal-button bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar Medida
            </Button>
          </CardHeader>
          <CardContent>
            {historico.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma medida registrada
              </p>
            ) : (
              <div className="space-y-3">
                {historico
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .map((medida) => (
                    <div
                      key={medida.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {new Date(medida.data).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {medida.peso} kg • {medida.altura} cm • IMC: {calcularIMC(medida.peso, medida.altura)}
                        </p>
                        {medida.notas && (
                          <p className="text-xs text-muted-foreground mt-1">{medida.notas}</p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleDeleteMedida(medida.id)}
                        variant="destructive"
                        size="sm"
                        className="brutal-button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Adicionar Medida */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Medida</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMedida}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    value={formData.peso || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, peso: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={formData.altura || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, altura: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notas">Notas</Label>
                  <Input
                    id="notas"
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Ex: Após treino intenso..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="brutal-button"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="brutal-button bg-primary">
                  Registrar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover este registro de medida? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="brutal-button">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="brutal-button bg-destructive text-destructive-foreground"
              >
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
