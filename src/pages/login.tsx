import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Shield, GraduationCap, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  
  const [profOpen, setProfOpen] = useState(false);
  const [profPwd, setProfPwd] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPwd === "AdminEvent") {
      sessionStorage.setItem("user_role", "admin");
      setLocation("/admin");
    } else {
      toast({ variant: "destructive", title: "รหัสผ่านไม่ถูกต้อง" });
    }
  };

  const handleProfLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (profPwd === "Tmission") {
      sessionStorage.setItem("user_role", "professor");
      setLocation("/professor");
    } else {
      toast({ variant: "destructive", title: "รหัสผ่านไม่ถูกต้อง" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold">เข้าสู่ระบบจัดการ</CardTitle>
          <CardDescription>เลือกระดับสิทธิ์ของคุณเพื่อเข้าใช้งาน</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-24 text-lg border-primary/50 hover:bg-primary/10 flex flex-col gap-2">
                <Shield className="w-6 h-6 text-primary" />
                เข้าสู่ระบบแอดมิน
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ยืนยันตัวตนแอดมิน</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdminLogin} className="space-y-4 pt-4">
                <Input 
                  type="password" 
                  placeholder="รหัสผ่าน" 
                  value={adminPwd} 
                  onChange={(e) => setAdminPwd(e.target.value)} 
                  autoFocus
                />
                <Button type="submit" className="w-full">เข้าสู่ระบบ</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={profOpen} onOpenChange={setProfOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-24 text-lg border-purple-500/50 hover:bg-purple-500/10 flex flex-col gap-2">
                <GraduationCap className="w-6 h-6 text-purple-400" />
                เข้าสู่ระบบศาสตราจารย์
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ยืนยันตัวตนศาสตราจารย์</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProfLogin} className="space-y-4 pt-4">
                <Input 
                  type="password" 
                  placeholder="รหัสผ่าน" 
                  value={profPwd} 
                  onChange={(e) => setProfPwd(e.target.value)} 
                  autoFocus
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">เข้าสู่ระบบ</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="pt-4 text-center">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับหน้าหลัก
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
