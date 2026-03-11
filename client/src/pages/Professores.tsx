/**
 * Professores - G1-9: Cadastro Professor + G1-12: Edição/Exclusão Cadastro
 * CRUD completo de professores com campos expandidos
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
import { Plus, Pencil, Trash2, GraduationCap, Eye } from "lucide-react";
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

export default function Professores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Professor, "id">>({
    nome: "",
    cpf: "",
    dataNascimento: "",
    sexo: "",
    especialidade: "",
    telefone: "",
    email: "",
    cref: "",
    regimeContratacao: "",
    dataAdmissao: "",
    salario: 0,
    horarioInicio: "",
    horarioFim: "",
    diasAtendimento: [],
    formacao: "",
    experiencia: "",
    certificacoes: "",
    endereco: "",
    emergenciaContato: "",
    emergenciaTelefone: "",
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
        dataNascimento: professor.dataNascimento,
        sexo: professor.sexo,
        especialidade: professor.especialidade,
        telefone: professor.telefone,
        email: professor.email,
        cref: professor.cref,
        regimeContratacao: professor.regimeContratacao,
        dataAdmissao: professor.dataAdmissao,
        salario: professor.salario,
        horarioInicio: professor.horarioInicio,
        horarioFim: professor.horarioFim,
        diasAtendimento: professor.diasAtendimento,
        formacao: professor.formacao,
        experiencia: professor.experiencia,
        certificacoes: professor.certificacoes,
        endereco: professor.endereco,
        emergenciaContato: professor.emergenciaContato,
        emergenciaTelefone: professor.emergenciaTelefone,
      });
    } else {
      setEditingProfessor(null);
      setFormData({
        nome: "",
        cpf: "",
        dataNascimento: "",
        sexo: "",
        especialidade: "",
        telefone: "",
        email: "",
        cref: "",
        regimeContratacao: "",
        dataAdmissao: "",
        salario: 0,
        horarioInicio: "",
        horarioFim: "",
        diasAtendimento: [],
        formacao: "",
        experiencia: "",
        certificacoes: "",
        endereco: "",
        emergenciaContato: "",
        emergenciaTelefone: "",
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

  const toggleDiaAtendimento = (dia: string) => {
    const dias = formData.diasAtendimento || [];
    if (dias.includes(dia)) {
      setFormData({
        ...formData,
        diasAtendimento: dias.filter((d) => d !== dia),
      });
    } else {
      setFormData({
        ...formData,
        diasAtendimento: [...dias, dia],
      });
    }
  };

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

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
                    <p className="text-xs text-muted-foreground">Regime</p>
                    <p className="text-sm font-medium capitalize">{professor.regimeContratacao || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{professor.email}</p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Link href={`/professores/${professor.id}`}>
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
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingProfessor ? "Editar Professor" : "Novo Professor"}
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

                {/* Seção: Profissional */}
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Informações Profissionais</h3>
                  <div className="space-y-3">
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
                      <Label htmlFor="formacao">Formação</Label>
                      <Input
                        id="formacao"
                        value={formData.formacao}
                        onChange={(e) => setFormData({ ...formData, formacao: e.target.value })}
                        placeholder="Ex: Educação Física - UFRJ"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experiencia">Anos de Experiência</Label>
                      <Input
                        id="experiencia"
                        type="number"
                        value={formData.experiencia}
                        onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="certificacoes">Certificações</Label>
                      <Textarea
                        id="certificacoes"
                        value={formData.certificacoes}
                        onChange={(e) =>
                          setFormData({ ...formData, certificacoes: e.target.value })
                        }
                        placeholder="Ex: Certificação em Pilates, Treinamento Funcional..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção: Contratação */}
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Regime de Contratação</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="regimeContratacao">Regime *</Label>
                      <Select value={formData.regimeContratacao} onValueChange={(value) => setFormData({ ...formData, regimeContratacao: value })}>
                        <SelectTrigger id="regimeContratacao">
                          <SelectValue placeholder="Selecione o regime" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clt">CLT</SelectItem>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                          <SelectItem value="pj">PJ</SelectItem>
                          <SelectItem value="estagiario">Estagiário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dataAdmissao">Data de Admissão</Label>
                      <Input
                        id="dataAdmissao"
                        type="date"
                        value={formData.dataAdmissao}
                        onChange={(e) =>
                          setFormData({ ...formData, dataAdmissao: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="salario">Salário/Valor Hora (R$)</Label>
                      <Input
                        id="salario"
                        type="number"
                        step="0.01"
                        value={formData.salario || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, salario: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Seção: Horários */}
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-3">Horários</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="horarioInicio">Horário de Início</Label>
                        <Input
                          id="horarioInicio"
                          type="time"
                          value={formData.horarioInicio}
                          onChange={(e) =>
                            setFormData({ ...formData, horarioInicio: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="horarioFim">Horário de Fim</Label>
                        <Input
                          id="horarioFim"
                          type="time"
                          value={formData.horarioFim}
                          onChange={(e) =>
                            setFormData({ ...formData, horarioFim: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Dias de Atendimento</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {diasSemana.map((dia) => (
                          <button
                            key={dia}
                            type="button"
                            onClick={() => toggleDiaAtendimento(dia)}
                            className={`p-2 rounded border-2 transition-all ${
                              (formData.diasAtendimento || []).includes(dia)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background border-border hover:border-primary"
                            }`}
                          >
                            {dia}
                          </button>
                        ))}
                      </div>
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
