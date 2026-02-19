/**
 * Professores - G1-9: Cadastro Professor + G1-12: Edição/Exclusão Cadastro
 * CRUD completo de professores
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Professor {
  id: string;
  nome: string;
  cpf: string;
  especialidade: string;
  telefone: string;
  email: string;
  cref: string;
}

export default function Professores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Professor, "id">>({
    nome: "",
    cpf: "",
    especialidade: "",
    telefone: "",
    email: "",
    cref: "",
  });

  useEffect(() => {
    loadProfessores();
  }, []);

  const loadProfessores = () => {
    const stored = localStorage.getItem("professores");
    if (stored) {
      setProfessores(JSON.parse(stored));
    }
  };

  const saveProfessores = (data: Professor[]) => {
    localStorage.setItem("professores", JSON.stringify(data));
    setProfessores(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.cpf || !formData.email || !formData.especialidade) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    if (editingProfessor) {
      const updated = professores.map((p) =>
        p.id === editingProfessor.id ? { ...formData, id: editingProfessor.id } : p
      );
      saveProfessores(updated);
      toast.success("Professor atualizado com sucesso!");
    } else {
      const newProfessor: Professor = {
        ...formData,
        id: Date.now().toString(),
      };
      saveProfessores([...professores, newProfessor]);
      toast.success("Professor cadastrado com sucesso!");
    }

    closeDialog();
  };

  const openDialog = (professor?: Professor) => {
    if (professor) {
      setEditingProfessor(professor);
      setFormData({
        nome: professor.nome,
        cpf: professor.cpf,
        especialidade: professor.especialidade,
        telefone: professor.telefone,
        email: professor.email,
        cref: professor.cref,
      });
    } else {
      setEditingProfessor(null);
      setFormData({
        nome: "",
        cpf: "",
        especialidade: "",
        telefone: "",
        email: "",
        cref: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProfessor(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      const updated = professores.filter((p) => p.id !== deletingId);
      saveProfessores(updated);
      toast.success("Professor excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Professores</h1>
            <p className="text-muted-foreground">Gerencie os professores da academia</p>
          </div>
          <Button
            onClick={() => openDialog()}
            className="brutal-button bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Professor
          </Button>
        </div>

        {professores.length === 0 ? (
          <Card className="brutal-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <GraduationCap className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Nenhum professor cadastrado</p>
              <p className="text-sm text-muted-foreground">
                Clique em "Novo Professor" para começar
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professores.map((professor) => (
              <Card key={professor.id} className="brutal-card bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">{professor.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Especialidade</p>
                    <p className="text-sm font-medium">{professor.especialidade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CREF</p>
                    <p className="text-sm font-medium">{professor.cref || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{professor.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="text-sm font-medium">{professor.telefone || "—"}</p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => openDialog(professor)}
                      variant="outline"
                      size="sm"
                      className="flex-1 brutal-button"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(professor.id)}
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingProfessor ? "Editar Professor" : "Novo Professor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="especialidade">Especialidade *</Label>
                  <Input
                    id="especialidade"
                    value={formData.especialidade}
                    onChange={(e) =>
                      setFormData({ ...formData, especialidade: e.target.value })
                    }
                    placeholder="Ex: Musculação, Funcional, Yoga"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cref">CREF</Label>
                  <Input
                    id="cref"
                    value={formData.cref}
                    onChange={(e) => setFormData({ ...formData, cref: e.target.value })}
                    placeholder="000000-G/SP"
                  />
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
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
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
                <Button type="submit" className="brutal-button bg-accent">
                  {editingProfessor ? "Salvar Alterações" : "Cadastrar"}
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
                Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.
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
