import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Project, projectApi } from "../lib/api";
import { toast } from "sonner@2.0.3";

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectApi.getAll();
      // Asegurarse de que data sea un array
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data && typeof data === 'object') {
        const projectsArray = (data as any).data || (data as any).proyectos || (data as any).projects || [];
        setProjects(Array.isArray(projectsArray) ? projectsArray : []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      toast.error("Error al cargar proyectos");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      titulo: "",
      ubicacion: "",
      fecha: "",
      descripcionCorta: "",
      urlImagen: "",
      categoria: "",
      estado: "En Proceso",
      descripcionCompleta: "",
      cliente: "",
      duracion: "",
      area: "",
      equipo: "",
      desafios: "",
      soluciones: "",
      resultados: "",
      productosUtilizados: ""
    });
  };

  const handleEdit = (project: Project) => {
    const projectId = project._id || project.id || "";
    setEditingId(projectId as any);
    setFormData(project);
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const { _id, id, ...projectData } = formData as any;
        await projectApi.create(projectData);
        toast.success("Proyecto creado exitosamente");
      } else if (editingId) {
        const { _id, id, ...projectData } = formData as any;
        await projectApi.update(editingId.toString(), projectData);
        toast.success("Proyecto actualizado exitosamente");
      }
      await loadProjects();
      handleCancel();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el proyecto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
    
    try {
      await projectApi.delete(id);
      toast.success("Proyecto eliminado exitosamente");
      await loadProjects();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el proyecto");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({});
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // No necesitamos convertir a arrays, la API espera strings
  const updateTextField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="text-center py-8">Cargando proyectos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Gestión de Proyectos</h2>
        {!isCreating && !editingId && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? "Crear Nuevo Proyecto" : "Editar Proyecto"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Proyecto</Label>
                <Input
                  id="titulo"
                  value={(formData as any).titulo || ""}
                  onChange={(e) => updateField("titulo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  value={(formData as any).ubicacion || ""}
                  onChange={(e) => updateField("ubicacion", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  value={(formData as any).fecha || ""}
                  onChange={(e) => updateField("fecha", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Input
                  id="categoria"
                  value={(formData as any).categoria || ""}
                  onChange={(e) => updateField("categoria", e.target.value)}
                  placeholder="Industrial, Residencial, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={(formData as any).estado || ""}
                  onChange={(e) => updateField("estado", e.target.value)}
                  placeholder="Completado, En Proceso, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Input
                  id="cliente"
                  value={(formData as any).cliente || ""}
                  onChange={(e) => updateField("cliente", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracion">Duración</Label>
                <Input
                  id="duracion"
                  value={(formData as any).duracion || ""}
                  onChange={(e) => updateField("duracion", e.target.value)}
                  placeholder="3 meses, 6 meses, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área</Label>
                <Input
                  id="area"
                  value={(formData as any).area || ""}
                  onChange={(e) => updateField("area", e.target.value)}
                  placeholder="2,500 m², etc."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="equipo">Equipo</Label>
                <Input
                  id="equipo"
                  value={(formData as any).equipo || ""}
                  onChange={(e) => updateField("equipo", e.target.value)}
                  placeholder="12 especialistas, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urlImagen">URL de Imagen</Label>
              <Input
                id="urlImagen"
                value={(formData as any).urlImagen || ""}
                onChange={(e) => updateField("urlImagen", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcionCorta">Descripción Corta</Label>
              <Textarea
                id="descripcionCorta"
                value={(formData as any).descripcionCorta || ""}
                onChange={(e) => updateField("descripcionCorta", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcionCompleta">Descripción Completa</Label>
              <Textarea
                id="descripcionCompleta"
                value={(formData as any).descripcionCompleta || ""}
                onChange={(e) => updateField("descripcionCompleta", e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="desafios">Desafíos</Label>
                <Textarea
                  id="desafios"
                  value={(formData as any).desafios || ""}
                  onChange={(e) => updateTextField("desafios", e.target.value)}
                  rows={5}
                  placeholder="Desafíos del proyecto..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soluciones">Soluciones</Label>
                <Textarea
                  id="soluciones"
                  value={(formData as any).soluciones || ""}
                  onChange={(e) => updateTextField("soluciones", e.target.value)}
                  rows={5}
                  placeholder="Soluciones implementadas..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resultados">Resultados</Label>
                <Textarea
                  id="resultados"
                  value={(formData as any).resultados || ""}
                  onChange={(e) => updateTextField("resultados", e.target.value)}
                  rows={5}
                  placeholder="Resultados obtenidos..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productosUtilizados">Productos Utilizados</Label>
                <Textarea
                  id="productosUtilizados"
                  value={(formData as any).productosUtilizados || ""}
                  onChange={(e) => updateTextField("productosUtilizados", e.target.value)}
                  rows={5}
                  placeholder="Productos utilizados en el proyecto..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Guardar
              </Button>
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project._id || project.id} className="overflow-hidden">
            {project.urlImagen ? (
              <img
                src={project.urlImagen}
                alt={project.titulo}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-muted-foreground">Sin imagen</span>
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{project.titulo}</h3>
                  <div className="flex gap-2 mb-2">
                    <Badge variant={project.estado === "Completado" ? "default" : "secondary"}>
                      {project.estado}
                    </Badge>
                    <Badge variant="outline">{project.categoria}</Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                📍 {project.ubicacion}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {project.descripcionCorta}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(project)}
                  className="flex-1 gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(project._id || project.id || "")}
                  className="gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !isCreating && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay proyectos registrados</p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Primer Proyecto
          </Button>
        </Card>
      )}
    </div>
  );
}
