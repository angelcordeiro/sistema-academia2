/**
 * Treinos - G1-10: Cadastro Treino + G1-16: Edição/Exclusão Treino
 * CRUD completo de treinos com seleção de aluno e professor
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
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

interface Professor {
  id: string;
  nome: string;
}

export default function Treinos() {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTreino, setEditingTreino] = useState<Treino | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Treino, "id" | "alunoNome" | "professorNome">>({
    nome: "",
    alunoId: "",
    professorId: "",
    descricao: "",
    objetivo: "",
    dataInicio: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedTreinos = localStorage.getItem("treinos");
    const storedAlunos = localStorage.getItem("alunos");
    const storedProfessores = localStorage.getItem("professores");

    if (storedTreinos) setTreinos(JSON.parse(storedTreinos));
    if (storedAlunos) setAlunos(JSON.parse(storedAlunos));
    if (storedProfessores) setProfessores(JSON.parse(storedProfessores));
  };

  const saveTreinos = (data: Treino[]) => {
    localStorage.setItem("treinos", JSON.stringify(data));
    setTreinos(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.alunoId || !formData.professorId) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    const aluno = alunos.find((a) => a.id === formData.alunoId);
    const professor = professores.find((p) => p.id === formData.professorId);

    if (!aluno || !professor) {
      toast.error("Aluno ou professor não encontrado!");
      return;
    }

    if (editingTreino) {
      const updated = treinos.map((t) =>
        t.id === editingTreino.id
          ? {
              ...formData,
              id: editingTreino.id,
              alunoNome: aluno.nome,
              professorNome: professor.nome,
            }
          : t
      );
      saveTreinos(updated);
      toast.success("Treino atualizado com sucesso!");
    } else {
      const newTreino: Treino = {
        ...formData,
        id: Date.now().toString(),
        alunoNome: aluno.nome,
        professorNome: professor.nome,
      };
      saveTreinos([...treinos, newTreino]);
      toast.success("Treino cadastrado com sucesso!");
    }

    closeDialog();
  };

  const openDialog = (treino?: Treino) => {
    if (treino) {
      setEditingTreino(treino);
      setFormData({
        nome: treino.nome,
        alunoId: treino.alunoId,
        professorId: treino.professorId,
        descricao: treino.descricao,
        objetivo: treino.objetivo,
        dataInicio: treino.dataInicio,
      });
    } else {
      setEditingTreino(null);
      setFormData({
        nome: "",
        alunoId: "",
        professorId: "",
        descricao: "",
        objetivo: "",
        dataInicio: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTreino(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      const updated = treinos.filter((t) => t.id !== deletingId);
      saveTreinos(updated);
      toast.success("Treino excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Treinos</h1>
            <p className="text-muted-foreground">Gerencie os treinos dos alunos</p>
          </div>
          <Button
            onClick={() => openDialog()}
            className="brutal-button bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Treino
          </Button>
        </div>

        {treinos.length === 0 ? (
          <Card className="brutal-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ClipboardList className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Nenhum treino cadastrado</p>
              <p className="text-sm text-muted-foreground">
                Clique em "Novo Treino" para começar
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {treinos.map((treino) => (
              <Card key={treino.id} className="brutal-card bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">{treino.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Aluno</p>
                    <p className="text-sm font-medium">{treino.alunoNome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Professor</p>
                    <p className="text-sm font-medium">{treino.professorNome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="text-sm font-medium">{treino.objetivo || "—"}</p>
                  </div>
                  {treino.descricao && (
                    <div>
                      <p className="text-xs text-muted-foreground">Descrição</p>
                      <p className="text-sm">{treino.descricao}</p>
                    </div>
                  )}
                  {treino.dataInicio && (
                    <div>
                      <p className="text-xs text-muted-foreground">Data de Início</p>
                      <p className="text-sm font-medium">
                        {new Date(treino.dataInicio).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => openDialog(treino)}
                      variant="outline"
                      size="sm"
                      className="flex-1 brutal-button"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(treino.id)}
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingTreino ? "Editar Treino" : "Novo Treino"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <Label htmlFor="nome">Nome do Treino *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Treino A - Peito e Tríceps"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="aluno">Aluno *</Label>
                  <Select
                    value={formData.alunoId}
                    onValueChange={(value) => setFormData({ ...formData, alunoId: value })}
                  >
                    <SelectTrigger id="aluno">
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {alunos.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Nenhum aluno cadastrado
                        </SelectItem>
                      ) : (
                        alunos.map((aluno) => (
                          <SelectItem key={aluno.id} value={aluno.id}>
                            {aluno.nome}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="professor">Professor *</Label>
                  <Select
                    value={formData.professorId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, professorId: value })
                    }
                  >
                    <SelectTrigger id="professor">
                      <SelectValue placeholder="Selecione um professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {professores.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Nenhum professor cadastrado
                        </SelectItem>
                      ) : (
                        professores.map((professor) => (
                          <SelectItem key={professor.id} value={professor.id}>
                            {professor.nome}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="objetivo">Objetivo</Label>
                  <Input
                    id="objetivo"
                    value={formData.objetivo}
                    onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                    placeholder="Ex: Hipertrofia, Emagrecimento, Condicionamento"
                  />
                </div>
                <div>
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, dataInicio: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva os exercícios e séries do treino..."
                    rows={4}
                  />
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
                  {editingTreino ? "Salvar Alterações" : "Cadastrar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.
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
