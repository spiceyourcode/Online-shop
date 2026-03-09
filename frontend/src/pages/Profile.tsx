import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/api/services";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Star, LogOut, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) { setName(user.name); setPhone(user.phone_number); }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authAPI.updateProfile({ name, phone_number: phone });
      await refreshProfile();
      toast.success("Profile updated!");
      setEditing(false);
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate("/"); toast.success("Logged out"); };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle>{user?.name || "User"}</CardTitle>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex gap-2 mt-1">
                {user?.is_seller && <Badge className="bg-primary text-primary-foreground">Seller</Badge>}
                {user?.is_customer && <Badge variant="secondary">Customer</Badge>}
                {user?.is_staff && <Badge className="bg-accent text-accent-foreground">Staff</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Member since {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}</p>
            <Separator />
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Phone Number</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div><p className="text-sm font-medium">Name</p><p className="text-muted-foreground">{user?.name || "Not set"}</p></div>
                <div><p className="text-sm font-medium">Phone</p><p className="text-muted-foreground">{user?.phone_number || "Not set"}</p></div>
                <Button variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <div className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild><Link to="/orders"><Package className="h-4 w-4 mr-2" /> My Orders</Link></Button>
            <Button variant="outline" className="justify-start" asChild><Link to="/"><Star className="h-4 w-4 mr-2" /> Browse Products</Link></Button>
            {(user?.is_seller || user?.is_staff) && (
              <Button variant="outline" className="justify-start" asChild><Link to="/seller/dashboard"><Package className="h-4 w-4 mr-2" /> Seller Dashboard</Link></Button>
            )}
            <Button variant="destructive" className="justify-start" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
