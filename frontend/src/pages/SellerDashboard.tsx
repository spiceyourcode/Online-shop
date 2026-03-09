import { useEffect, useState } from "react";
import { productsAPI, categoriesAPI } from "@/api/services";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category_id: "", brand: "", description: "", price: "", stock: "", image: null as File | null });
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await productsAPI.list();
      const allProducts = Array.isArray(data) ? data : data.results || [];
      setProducts(user?.is_staff ? allProducts : allProducts.filter((p: any) => p.seller === user?.id));
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    fetchProducts();
    categoriesAPI.list().then(({ data }) => setCategories(Array.isArray(data) ? data : data.results || [])).catch(() => {});
  }, []);

  const resetForm = () => {
    setForm({ name: "", category_id: "", brand: "", description: "", price: "", stock: "", image: null });
    setEditingSlug(null);
  };

  const openEdit = (product: any) => {
    setForm({
      name: product.name, category_id: String(product.category.id), brand: product.brand || "",
      description: product.description || "", price: product.price, stock: String(product.stock), image: null,
    });
    setEditingSlug(product.slug);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category_id || !form.price) { toast.error("Name, category, and price are required"); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category_id", form.category_id);
      if (form.brand) formData.append("brand", form.brand);
      if (form.description) formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock || "0");
      if (form.image) formData.append("image", form.image);

      if (editingSlug) {
        await productsAPI.update(editingSlug, formData);
        toast.success("Product updated!");
      } else {
        await productsAPI.create(formData);
        toast.success("Product created!");
      }
      setDialogOpen(false);
      resetForm();
      await fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to save product");
    } finally { setSaving(false); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(slug);
      toast.success("Product deleted");
      await fetchProducts();
    } catch { toast.error("Failed to delete product"); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your products</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingSlug ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Brand</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Price (KSH) *</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
                </div>
                <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving..." : editingSlug ? "Update Product" : "Create Product"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-bold">No products yet</h2>
            <p className="text-muted-foreground">Create your first product to start selling</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((p: any) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex gap-4 items-center">
                  <img src={getImageUrl(p.image)} alt={p.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.brand} • {p.category.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold">{formatPrice(p.price)}</span>
                      <Badge variant={p.stock > 0 ? "secondary" : "destructive"}>{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(p.slug)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
