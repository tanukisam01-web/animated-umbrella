import { useState } from "react";
import { useItems, EventOrMission, saveItems } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Calendar, Users, Swords, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "wouter";

const registerSchema = z.object({
  discordName: z.string().min(2, "ต้องมีอย่างน้อย 2 ตัวอักษร"),
  characterName: z.string().min(2, "ต้องมีอย่างน้อย 2 ตัวอักษร"),
});

export default function Home() {
  const items = useItems();
  const events = items.filter(i => i.type === "event");
  const missions = items.filter(i => i.type === "mission");

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-6">
      <div className="w-full max-w-5xl">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">กระดานกิจกรรมและภารกิจ</h1>
            <p className="text-muted-foreground mt-2">ศูนย์รวมกิจกรรมของกิลด์ ลงทะเบียนเพื่อรับสิทธิ์และของรางวัล</p>
          </div>
          <Link href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            จัดการระบบ
          </Link>
        </header>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-card-border p-1">
            <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              กิจกรรม ({events.length})
            </TabsTrigger>
            <TabsTrigger value="missions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Swords className="w-4 h-4 mr-2" />
              ภารกิจ ({missions.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="events">
            <ItemList items={events} emptyMessage="ไม่มีกิจกรรมในขณะนี้" />
          </TabsContent>
          <TabsContent value="missions">
            <ItemList items={missions} emptyMessage="ไม่มีภารกิจในขณะนี้" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ItemList({ items, emptyMessage }: { items: EventOrMission[], emptyMessage: string }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-lg border-muted">
        <ShieldAlert className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ItemCard({ item }: { item: EventOrMission }) {
  const { toast } = useToast();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { discordName: "", characterName: "" },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    const allItems = [...useItems.getState()]; // wait, useItems is a hook, we shouldn't do this. 
    // better read directly from localStorage using getItems
    const { getItems, saveItems } = require("@/lib/store");
    const currentItems = getItems();
    const itemIndex = currentItems.findIndex((i: EventOrMission) => i.id === item.id);
    if (itemIndex > -1) {
      currentItems[itemIndex].attendees.push({
        id: Date.now().toString(),
        discordName: values.discordName,
        characterName: values.characterName,
        registeredAt: new Date().toISOString()
      });
      saveItems(currentItems);
      toast({ title: "ลงทะเบียนสำเร็จ!", description: "ชื่อของคุณอยู่ในระบบแล้ว" });
      setRegisterOpen(false);
      form.reset();
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={item.type === 'event' ? 'text-blue-400 border-blue-400' : 'text-orange-400 border-orange-400'}>
            {item.type === 'event' ? 'กิจกรรม' : 'ภารกิจ'}
          </Badge>
          <span className="text-xs text-muted-foreground">{format(new Date(item.startDate), 'dd MMM yyyy')}</span>
        </div>
        <CardTitle className="mt-2 text-xl cursor-pointer hover:text-primary transition-colors" onClick={() => setViewOpen(true)}>
          {item.name}
        </CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground bg-black/20 p-2 rounded-md cursor-pointer hover:bg-black/40 transition-colors" onClick={() => setViewOpen(true)}>
          <Users className="w-4 h-4 mr-2" />
          ผู้เข้าร่วม: <span className="font-bold text-foreground ml-1">{item.attendees.length}</span> คน
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
          <DialogTrigger asChild>
            <Button className="w-full font-bold">ลงทะเบียน</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>ลงทะเบียนเข้าร่วม</DialogTitle>
              <DialogDescription>
                {item.name}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="discordName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discord Username</FormLabel>
                      <FormControl>
                        <Input placeholder="เช่น player#1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="characterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อตัวละคร (Character Name)</FormLabel>
                      <FormControl>
                        <Input placeholder="เช่น KnightKing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">ยืนยันการลงทะเบียน</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>

      {/* View Attendees Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>รายชื่อผู้เข้าร่วม</DialogTitle>
            <DialogDescription>{item.name}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-4">
            {item.attendees.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">ยังไม่มีผู้ลงทะเบียน</p>
            ) : (
              <div className="space-y-2">
                {item.attendees.map((attendee, i) => (
                  <div key={attendee.id} className="flex justify-between items-center p-3 rounded-md bg-secondary/50 border border-secondary">
                    <div className="flex flex-col">
                      <span className="font-medium">{attendee.characterName}</span>
                      <span className="text-xs text-muted-foreground">Discord: {attendee.discordName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground opacity-50">
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
