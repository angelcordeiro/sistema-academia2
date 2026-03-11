/**
 * Suplementos - Gestão de estoque, vendas e histórico
 * CRUD completo com controle de estoque
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
import { Plus, Pencil, Trash2, Pill, ShoppingCart, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Suplemento {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  descricao: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  unidade: string;
  dataValidade: string;
  fornecedor: string;
  contatoFornecedor: string;
}

interface Venda {
  id: string;
  suplementoId: string;
  suplementoNome: string;
  quantidade: number;
  preco: number;
  total: number;
  data: string;
  cliente: string;
  observacoes: string;
}

export default function Suplementos() {
  const [suplementos, setSuplementos] = useState<Suplemento[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVendaDialogOpen, setIsVendaDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSuplemento, setEditingSuplemento] = useState<Suplemento | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedSuplemento, setSelectedSuplemento] = useState<Suplemento | null>(null);
  const [formData, setFormData] = useState<Omit<Suplemento, "id">>({
    nome: "",
    marca: "",
    categoria: "",
    descricao: "",
    preco: 0,
    estoque: 0,
    estoqueMinimo: 0,
    unidade: "un",
    dataValidade: "",
    fornecedor: "",
    contatoFornecedor: "",
  });
  const [vendaFormData, setVendaFormData] = useState({
    quantidade: 0,
    cliente: "",
    observacoes: "",
  });

  useEffect(() => {
    loadSuplementos();
    loadVendas();
  }, []);

  const loadSuplementos = () => {
    const stored = localStorage.getItem("suplementos");
    if (stored) {
      setSuplementos(JSON.parse(stored));
    }
  };

  const loadVendas = () => {
    const stored = localStorage.getItem("vendas");
    if (stored) {
      setVendas(JSON.parse(stored));
    }
  };

  const saveSuplementos = (data: Suplemento[]) => {
    localStorage.setItem("suplementos", JSON.stringify(data));
    setSuplementos(data);
  };

  const saveVendas = (data: Venda[]) => {
    localStorage.setItem("vendas", JSON.stringify(data));
    setVendas(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.marca || !formData.categoria) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    if (editingSuplemento) {
      const updated = suplementos.map((s) =>
        s.id === editingSuplemento.id ? { ...formData, id: editingSuplemento.id } : s
      );
      saveSuplementos(updated);
      toast.success("Suplemento atualizado com sucesso!");
    } else {
      const newSuplemento: Suplemento = {
        ...formData,
        id: Date.now().toString(),
      };
      saveSuplementos([...suplementos, newSuplemento]);
      toast.success("Suplemento cadastrado com sucesso!");
    }

    closeDialog();
  };

  const handleVenda = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSuplemento || vendaFormData.quantidade <= 0) {
      toast.error("Preencha os dados da venda!");
      return;
    }

    if (vendaFormData.quantidade > selectedSuplemento.estoque) {
      toast.error("Quantidade insuficiente em estoque!");
      return;
    }

    // Registrar venda
    const newVenda: Venda = {
      id: Date.now().toString(),
      suplementoId: selectedSuplemento.id,
      suplementoNome: selectedSuplemento.nome,
      quantidade: vendaFormData.quantidade,
      preco: selectedSuplemento.preco,
      total: vendaFormData.quantidade * selectedSuplemento.preco,
      data: new Date().toISOString().split("T")[0],
      cliente: vendaFormData.cliente,
      observacoes: vendaFormData.observacoes,
    };

    saveVendas([...vendas, newVenda]);

    // Atualizar estoque
    const updated = suplementos.map((s) =>
      s.id === selectedSuplemento.id
        ? { ...s, estoque: s.estoque - vendaFormData.quantidade }
        : s
    );
    saveSuplementos(updated);

    toast.success("Venda registrada com sucesso!");
    setIsVendaDialogOpen(false);
    setVendaFormData({ quantidade: 0, cliente: "", observacoes: "" });
    setSelectedSuplemento(null);
  };

  const openDialog = (suplemento?: Suplemento) => {
    if (suplemento) {
      setEditingSuplemento(suplemento);
      setFormData({
        nome: suplemento.nome,
        marca: suplemento.marca,
        categoria: suplemento.categoria,
        descricao: suplemento.descricao,
        preco: suplemento.preco,
        estoque: suplemento.estoque,
        estoqueMinimo: suplemento.estoqueMinimo,
        unidade: suplemento.unidade,
        dataValidade: suplemento.dataValidade,
        fornecedor: suplemento.fornecedor,
        contatoFornecedor: suplemento.contatoFornecedor,
      });
    } else {
      setEditingSuplemento(null);
      setFormData({
        nome: "",
        marca: "",
        categoria: "",
        descricao: "",
        preco: 0,
        estoque: 0,
        estoqueMinimo: 0,
        unidade: "un",
        dataValidade: "",
        fornecedor: "",
        contatoFornecedor: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingSuplemento(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      const updated = suplementos.filter((s) => s.id !== deletingId);
      saveSuplementos(updated);
      toast.success("Suplemento excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const totalEstoque = suplementos.reduce((acc, s) => acc + s.estoque, 0);
  const totalVendas = vendas.reduce((acc, v) => acc + v.total, 0);
  const suplementosBaixoEstoque = suplementos.filter((s) => s.estoque <= s.estoqueMinimo);

  const categorias = ["Whey Protein", "BCAA", "Creatina", "Pré-Treino", "Vitaminas", "Outros"];
  const unidades = ["un", "kg", "g", "ml", "L"];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Suplementos</h1>
            <p className="text-muted-foreground">Gestão de estoque e vendas</p>
          </div>
          <Button
            onClick={() => openDialog()}
            className="brutal-button bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Suplemento
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total em Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{totalEstoque}</p>
              <p className="text-xs text-muted-foreground mt-1">unidades</p>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">R$ {totalVendas.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{vendas.length} vendas</p>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-card border-destructive/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-destructive" />
                Baixo Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">{suplementosBaixoEstoque.length}</p>
              <p className="text-xs text-muted-foreground mt-1">produtos</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerta de Baixo Estoque */}
        {suplementosBaixoEstoque.length > 0 && (
          <Card className="brutal-card bg-destructive/10 border-destructive/50 mb-8">
            <CardHeader>
              <CardTitle className="text-destructive">Atenção: Produtos com Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suplementosBaixoEstoque.map((s) => (
                  <p key={s.id} className="text-sm">
                    <strong>{s.nome}</strong> - {s.estoque} {s.unidade} (mínimo: {s.estoqueMinimo})
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {suplementos.length === 0 ? (
          <Card className="brutal-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Pill className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Nenhum suplemento cadastrado</p>
              <p className="text-sm text-muted-foreground">
                Clique em "Novo Suplemento" para começar
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suplementos.map((suplemento) => (
              <Card
                key={suplemento.id}
                className={`brutal-card ${
                  suplemento.estoque <= suplemento.estoqueMinimo
                    ? "border-destructive/50 bg-destructive/5"
                    : "bg-card"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{suplemento.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Marca</p>
                    <p className="text-sm font-medium">{suplemento.marca}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Categoria</p>
                    <p className="text-sm font-medium">{suplemento.categoria}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Preço</p>
                      <p className="text-sm font-bold text-accent">R$ {suplemento.preco.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Estoque</p>
                      <p
                        className={`text-sm font-bold ${
                          suplemento.estoque <= suplemento.estoqueMinimo
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        {suplemento.estoque} {suplemento.unidade}
                      </p>
                    </div>
                  </div>
                  {suplemento.dataValidade && (
                    <div>
                      <p className="text-xs text-muted-foreground">Validade</p>
                      <p className="text-sm font-medium">
                        {new Date(suplemento.dataValidade).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => {
                        setSelectedSuplemento(suplemento);
                        setIsVendaDialogOpen(true);
                      }}
                      className="flex-1 brutal-button bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Vender
                    </Button>
                    <Button
                      onClick={() => openDialog(suplemento)}
                      variant="outline"
                      size="sm"
                      className="flex-1 brutal-button"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(suplemento.id)}
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
                {editingSuplemento ? "Editar Suplemento" : "Novo Suplemento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-3">
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
                    <Label htmlFor="marca">Marca *</Label>
                    <Input
                      id="marca"
                      value={formData.marca}
                      onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição do suplemento..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="preco">Preço (R$) *</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      value={formData.preco || ""}
                      onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unidade">Unidade</Label>
                    <Select value={formData.unidade} onValueChange={(value) => setFormData({ ...formData, unidade: value })}>
                      <SelectTrigger id="unidade">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unidades.map((un) => (
                          <SelectItem key={un} value={un}>
                            {un}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="estoque">Estoque *</Label>
                    <Input
                      id="estoque"
                      type="number"
                      value={formData.estoque || ""}
                      onChange={(e) => setFormData({ ...formData, estoque: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                    <Input
                      id="estoqueMinimo"
                      type="number"
                      value={formData.estoqueMinimo || ""}
                      onChange={(e) => setFormData({ ...formData, estoqueMinimo: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dataValidade">Data de Validade</Label>
                  <Input
                    id="dataValidade"
                    type="date"
                    value={formData.dataValidade}
                    onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fornecedor">Fornecedor</Label>
                    <Input
                      id="fornecedor"
                      value={formData.fornecedor}
                      onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contatoFornecedor">Contato Fornecedor</Label>
                    <Input
                      id="contatoFornecedor"
                      value={formData.contatoFornecedor}
                      onChange={(e) => setFormData({ ...formData, contatoFornecedor: e.target.value })}
                    />
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
                  {editingSuplemento ? "Salvar Alterações" : "Cadastrar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog de Venda */}
        <Dialog open={isVendaDialogOpen} onOpenChange={setIsVendaDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Venda</DialogTitle>
            </DialogHeader>
            {selectedSuplemento && (
              <form onSubmit={handleVenda}>
                <div className="space-y-4 py-4">
                  <div>
                    <p className="text-sm font-medium">{selectedSuplemento.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      R$ {selectedSuplemento.preco.toFixed(2)} - Estoque: {selectedSuplemento.estoque} {selectedSuplemento.unidade}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade *</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={vendaFormData.quantidade || ""}
                      onChange={(e) =>
                        setVendaFormData({
                          ...vendaFormData,
                          quantidade: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                      id="cliente"
                      value={vendaFormData.cliente}
                      onChange={(e) =>
                        setVendaFormData({ ...vendaFormData, cliente: e.target.value })
                      }
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={vendaFormData.observacoes}
                      onChange={(e) =>
                        setVendaFormData({ ...vendaFormData, observacoes: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  {vendaFormData.quantidade > 0 && (
                    <div className="bg-muted p-3 rounded">
                      <p className="text-sm font-medium">
                        Total: R$ {(vendaFormData.quantidade * selectedSuplemento.preco).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsVendaDialogOpen(false)}
                    className="brutal-button"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="brutal-button bg-primary">
                    Confirmar Venda
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este suplemento? Esta ação não pode ser desfeita.
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
