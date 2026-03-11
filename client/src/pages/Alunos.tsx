/**
 * Alunos - G1-8: Cadastro Aluno + G1-12: Edição/Exclusão Cadastro
 * CRUD completo de alunos com validação e campos expandidos
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2, Users, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

// Funções de validação
const formatCPF = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 11);
};

const formatTelefone = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 11);
};

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

export default function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Aluno, "id">>({
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    endereco: "",
    sexo: "",
    peso: 0,
    altura: 0,
    dataFiliacao: "",
    objetivoFitness: "",
    condicaoSaude: "",
    medicamentos: "",
    alergia: "",
    emergenciaContato: "",
    emergenciaTelefone: "",
  });

  useEffect(() => {
    loadAlunos();
  }, []);

  const loadAlunos = () => {
    const stored = localStorage.getItem("alunos");
    if (stored) {
      setAlunos(JSON.parse(stored));
    }
  };

  const saveAlunos = (data: Aluno[]) => {
    localStorage.setItem("alunos", JSON.stringify(data));
    setAlunos(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.cpf || !formData.email) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    if (editingAluno) {
      const updated = alunos.map((a) =>
        a.id === editingAluno.id ? { ...formData, id: editingAluno.id } : a
      );
      saveAlunos(updated);
      toast.success("Aluno atualizado com sucesso!");
    } else {
      const newAluno: Aluno = {
        ...formData,
        id: Date.now().toString(),
      };
      saveAlunos([...alunos, newAluno]);
      toast.success("Aluno cadastrado com sucesso!");
    }

    closeDialog();
  };

  const openDialog = (aluno?: Aluno) => {
    if (aluno) {
      setEditingAluno(aluno);
      setFormData({
        nome: aluno.nome,
        cpf: aluno.cpf,
        dataNascimento: aluno.dataNascimento,
        telefone: aluno.telefone,
        email: aluno.email,
        endereco: aluno.endereco,
        sexo: aluno.sexo,
        peso: aluno.peso,
        altura: aluno.altura,
        dataFiliacao: aluno.dataFiliacao,
        objetivoFitness: aluno.objetivoFitness,
        condicaoSaude: aluno.condicaoSaude,
        medicamentos: aluno.medicamentos,
        alergia: aluno.alergia,
        emergenciaContato: aluno.emergenciaContato,
        emergenciaTelefone: aluno.emergenciaTelefone,
      });
    } else {
      setEditingAluno(null);
      setFormData({
        nome: "",
        cpf: "",
        dataNascimento: "",
        telefone: "",
        email: "",
        endereco: "",
        sexo: "",
        peso: 0,
        altura: 0,
        dataFiliacao: "",
        objetivoFitness: "",
        condicaoSaude: "",
        medicamentos: "",
        alergia: "",
        emergenciaContato: "",
        emergenciaTelefone: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingAluno(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      const updated = alunos.filter((a) => a.id !== deletingId);
      saveAlunos(updated);
      toast.success("Aluno excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const calcularIMC = (peso: number, altura: number) => {
    if (!peso || !altura) return 0;
    const alturaMetros = altura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(1);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Alunos</h1>
            <p className="text-muted-foreground">Gerencie os alunos da academia</p>
          </div>
          <Button
            onClick={() => openDialog()}
            className="brutal-button bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Aluno
          </Button>
        </div>

        {/* Lista de Alunos */}
        {alunos.length === 0 ? (
          <Card className="brutal-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Nenhum aluno cadastrado</p>
              <p className="text-sm text-muted-foreground">
                Clique em "Novo Aluno" para começar
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alunos.map((aluno) => (
              <Card key={aluno.id} className="brutal-card bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">{aluno.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">CPF</p>
                    <p className="text-sm font-medium">{aluno.cpf}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{aluno.email}</p>
                  </div>
                  {aluno.peso > 0 && aluno.altura > 0 && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Peso</p>
                        <p className="text-sm font-medium">{aluno.peso} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Altura</p>
                        <p className="text-sm font-medium">{aluno.altura} cm</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">IMC</p>
                        <p className="text-sm font-medium">{calcularIMC(aluno.peso, aluno.altura)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Link href={`/alunos/${aluno.id}`}>
                      <a className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full brutal-button"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Perfil
                        </Button>
                      </a>
                    </Link>
                    <Button
                      onClick={() => openDialog(aluno)}
                      variant="outline"
                      size="sm"
                      className="flex-1 brutal-button"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(aluno.id)}
                      variant="destructive"
                      size="sm"
                      className="flex-1 brutal-button"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Cadastro/Edição */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingAluno ? "Editar Aluno" : "Novo Aluno"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                {/* Seção: Dados Pessoais */}
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Dados Pessoais</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="cpf">CPF * (11 dígitos)</Label>
                      <Input
                        id="cpf"
                        type="text"
                        inputMode="numeric"
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                        placeholder="00000000000"
                        maxLength={11}
                        required
                      />
                    </div>
                      <div>
                        <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                        <Input
                          id="dataNascimento"
                          type="date"
                          value={formData.dataNascimento}
                          onChange={(e) =>
                            setFormData({ ...formData, dataNascimento: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone (10-11 dígitos)</Label>
                      <Input
                        id="telefone"
                        type="text"
                        inputMode="numeric"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: formatTelefone(e.target.value) })}
                        placeholder="00000000000"
                        maxLength={11}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção: Dados Físicos */}
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Dados Físicos</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="sexo">Sexo</Label>
                      <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                        <SelectTrigger id="sexo">
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="peso">Peso (kg)</Label>
                        <Input
                          id="peso"
                          type="number"
                          step="0.1"
                          value={formData.peso || ""}
                          onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="altura">Altura (cm)</Label>
                        <Input
                          id="altura"
                          type="number"
                          value={formData.altura || ""}
                          onChange={(e) => setFormData({ ...formData, altura: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção: Fitness */}
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Informações Fitness</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="dataFiliacao">Data de Filiação</Label>
                      <Input
                        id="dataFiliacao"
                        type="date"
                        value={formData.dataFiliacao}
                        onChange={(e) =>
                          setFormData({ ...formData, dataFiliacao: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="objetivoFitness">Objetivo Fitness</Label>
                      <Select value={formData.objetivoFitness} onValueChange={(value) => setFormData({ ...formData, objetivoFitness: value })}>
                        <SelectTrigger id="objetivoFitness">
                          <SelectValue placeholder="Selecione o objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                          <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                          <SelectItem value="condicionamento">Condicionamento</SelectItem>
                          <SelectItem value="reabilitacao">Reabilitação</SelectItem>
                          <SelectItem value="manutencao">Manutenção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Seção: Saúde */}
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Informações de Saúde</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="condicaoSaude">Condição de Saúde</Label>
                      <Textarea
                        id="condicaoSaude"
                        value={formData.condicaoSaude}
                        onChange={(e) =>
                          setFormData({ ...formData, condicaoSaude: e.target.value })
                        }
                        placeholder="Ex: Hipertensão, Diabetes, Lesões anteriores..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="medicamentos">Medicamentos</Label>
                      <Textarea
                        id="medicamentos"
                        value={formData.medicamentos}
                        onChange={(e) =>
                          setFormData({ ...formData, medicamentos: e.target.value })
                        }
                        placeholder="Liste os medicamentos em uso..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="alergia">Alergias</Label>
                      <Input
                        id="alergia"
                        value={formData.alergia}
                        onChange={(e) => setFormData({ ...formData, alergia: e.target.value })}
                        placeholder="Ex: Penicilina, Látex..."
                      />
                    </div>
                  </div>
                </div>

                {/* Seção: Emergência */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Contato de Emergência</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="emergenciaContato">Nome</Label>
                      <Input
                        id="emergenciaContato"
                        value={formData.emergenciaContato}
                        onChange={(e) =>
                          setFormData({ ...formData, emergenciaContato: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergenciaTelefone">Telefone</Label>
                      <Input
                        id="emergenciaTelefone"
                        value={formData.emergenciaTelefone}
                        onChange={(e) =>
                          setFormData({ ...formData, emergenciaTelefone: e.target.value })
                        }
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  className="brutal-button"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="brutal-button bg-primary">
                  {editingAluno ? "Salvar Alterações" : "Cadastrar"}
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
                Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="brutal-button">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="brutal-button bg-destructive text-destructive-foreground"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
