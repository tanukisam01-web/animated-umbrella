import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getItems, saveItems, EventOrMission } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { LogOut, Plus, Users, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function Professor() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [items, setItems] = useState<EventOrMission[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem("user_role") !== "professor") {
      setLocation("/login");
    } else {
      setItems(getItems().filter(i => i.createdBy === "professor"));
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    sessionStorage.removeItem("user_role");
    setLocation("/");
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !desc || !date) {
      toast({ variant: "destructive", title: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      return;
    }

    const newItem: EventOrMission = {
      id: Date.now().toString(),
      type: "mission",
      name,
      description: desc,
      startDate: new Date(date).toISOString(),
      createdBy: "professor",
      createdAt: new Date().toISOString(),
      attendees: []
    };

    const allItems = getItems();
    const newItems = [...allItems, newItem];
    saveItems(newItems);
    setItems(newItems.filter(i => i.createdBy === "professor"));
    setCreateOpen(false);
    setName(""); setDesc(""); setDate("");
    toast({ title: "สร้างภารกิจสำเร็จ" });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-3">
              <span className="p-2 bg-purple-500/10 rounded-md"><GraduationCap className="w-6 h-6" /></span>
              Professor Panel
            </h1>
            <p className="text-muted-foreground mt-1">จัดการภารกิจของศาสตราจารย์</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="w-4 h-4 mr-2" />
            ออกจากระบบ
          </Button>
        </header>

        <div className="flex justify-end">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                สร้างภารกิจใหม่
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>สร้างภารกิจ</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>ชื่อภารกิจ</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อภารกิจ" />
                </div>
                <div className="space-y-2">
                  <Label>รายละเอียด</Label>
                  <Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="คำอธิบาย..." />
                </div>
                <div className="space-y-2">
                  <Label>วันที่เริ่ม</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">บันทึก</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-purple-500/20">
          <CardHeader>
            <CardTitle>ภารกิจของคุณ ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">ยังไม่มีภารกิจที่คุณสร้าง</div>
            ) : (
              <div className="space-y-4">
                {items.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border border-border bg-card/50 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-orange-400 border-orange-400/50">
                          ภารกิจ
                        </Badge>
                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-3">
                        <span>เริ่ม: {format(new Date(item.startDate), 'dd MMM yyyy')}</span>
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                          <Users className="w-4 h-4 mr-2" />
                          ดูรายชื่อ ({item.attendees.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>รายชื่อผู้เข้าร่วม: {item.name}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] mt-4">
                          {item.attendees.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">ไม่มีผู้เข้าร่วม</p>
                          ) : (
                            <div className="space-y-2">
                              {item.attendees.map(a => (
                                <div key={a.id} className="p-3 bg-secondary/30 rounded border border-border flex justify-between items-center">
                                  <div>
                                    <div className="font-bold">{a.characterName}</div>
                                    <div className="text-xs text-muted-foreground">Discord: {a.discordName}</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {format(new Date(a.registeredAt), 'dd/MM/yyyy HH:mm')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
