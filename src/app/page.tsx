"use client";

import { MY_PROJECTS, MY_SUPERPOWERS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Star, Heart, Send, Rocket, Brain, Palette, Library, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleContactMessage } from "@/ai/flows/handle-contact-message-flow";

export default function Home() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: "", message: "" });

  const handleSendMessage = async () => {
    if (!formData.message.trim()) return;
    
    setSending(true);
    try {
      const result = await handleContactMessage({
        name: formData.name || "A Secret Friend",
        message: formData.message,
      });

      if (result.success) {
        toast({ 
          title: "Message Sent! 🎉", 
          description: result.reply 
        });
        setFormData({ name: "", message: "" });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive",
        title: "Oh No!", 
        description: error.message || "The magic mailbox is stuck. Try again! 🌈" 
      });
    } finally {
      setSending(false);
    }
  };

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      {/* Playful Header */}
      <nav className="p-4 flex justify-between items-center max-w-6xl mx-auto bg-white/60 backdrop-blur-md rounded-full mt-4 sticky top-4 z-50 border border-white/50 shadow-sm">
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <Image 
            src="https://i.ibb.co/NgtRP6Bt/Chit-Chat.png" 
            alt="Chit-Chat Logo" 
            width={48} 
            height={48} 
            className="rounded-full"
          />
          <span className="text-2xl font-headline font-bold text-primary hidden sm:block">Chit-Chat</span>
        </Link>
        <div className="flex gap-2 sm:gap-4 items-center">
          <Link href="#projects">
            <Button variant="ghost" className="rounded-full font-bold text-primary">Creations</Button>
          </Link>
          <Link href="/library">
            <Button variant="ghost" className="rounded-full font-bold flex gap-2 text-primary">
              <Library className="w-4 h-4" />
              Library
            </Button>
          </Link>
          <a href="#contact" onClick={handleScrollToContact}>
            <Button className="rounded-full bg-primary hover:bg-primary/90 font-bold shadow-lg">Say Hi!</Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center space-y-8 overflow-hidden">
        <div className="relative inline-block">
          <div className="w-48 h-48 bg-accent rounded-full mx-auto flex items-center justify-center text-7xl shadow-2xl floating border-8 border-white overflow-hidden">
            <Image 
              src="https://i.ibb.co/NgtRP6Bt/Chit-Chat.png" 
              alt="Profile" 
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -top-4 -right-4 animate-bounce">
            <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-headline font-black text-primary leading-tight">
            Hi! I'm <span className="rainbow-text">Vivanta</span>
          </h1>
          <p className="text-2xl font-medium text-muted-foreground leading-relaxed">
            I'm a young creator and explorer. I love building cool things with pixels and big ideas!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-6">
          <div className="flex items-center gap-2 bg-white/80 px-6 py-3 rounded-full shadow-md font-bold text-lg border-2 border-primary/20">
            <Rocket className="w-6 h-6 text-primary" /> Storyteller
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-6 py-3 rounded-full shadow-md font-bold text-lg border-2 border-secondary/20">
            <Brain className="w-6 h-6 text-secondary" /> Dreamer
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-6 py-3 rounded-full shadow-md font-bold text-lg border-2 border-accent/20">
            <Palette className="w-6 h-6 text-accent" /> Creator
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 rounded-[4rem] mx-4 md:mx-10 px-8 shadow-inner border border-primary/5 bg-white/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-primary rounded-full font-bold uppercase tracking-wider text-sm border border-pink-200">
              <Sparkles className="w-4 h-4" /> My Creations
            </div>
            <h2 className="text-5xl font-headline font-black">Cool Things I Made</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MY_PROJECTS.map((project) => (
              <Card 
                key={project.id} 
                className={`group border-4 ${project.color} rounded-[2.5rem] shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden bg-white/80`}
              >
                <div className="h-48 flex items-center justify-center text-8xl bg-white/50 group-hover:scale-110 transition-transform">
                  {project.emoji}
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-headline font-bold">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <p className="text-lg font-medium opacity-80 leading-relaxed italic">
                    {project.description}
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {project.tags.map(tag => (
                      <Badge key={tag} className="rounded-full bg-white text-foreground hover:bg-white/80 border">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {project.link ? (
                    <Link href={project.link}>
                      <Button className="w-full rounded-2xl bg-primary hover:bg-primary/90 shadow-lg font-bold h-12">
                        Check it out!
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      onClick={() => toast({ 
                        title: "Coming Soon! 🛠️", 
                        description: "I'm still building this awesome adventure. Check back later!" 
                      })}
                      className="w-full rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 shadow-lg font-bold h-12"
                    >
                      Coming Soon!
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Superpowers Section */}
      <section id="skills" className="py-24 px-8 overflow-hidden bg-background">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-secondary rounded-full font-bold uppercase tracking-wider text-sm border border-blue-200">
              <Star className="w-4 h-4" /> My Superpowers
            </div>
            <h2 className="text-5xl font-headline font-black">What I'm Good At</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MY_SUPERPOWERS.map((skill) => (
              <div key={skill.name} className="bg-white/80 p-8 rounded-[2rem] shadow-lg border-2 border-muted hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{skill.emoji}</span>
                    <span className="text-2xl font-bold font-headline">{skill.name}</span>
                  </div>
                  <span className="text-primary font-black text-xl">{skill.level}%</span>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden p-1 border">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-primary text-white py-24 px-8 mt-20 relative rounded-t-[5rem]">
        {/* Floating elements decoration */}
        <div className="absolute top-10 left-10 opacity-20 floating">
           <Star className="w-20 h-20 fill-white" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20 floating animate-pulse">
           <Heart className="w-24 h-24 fill-white" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <h2 className="text-6xl font-headline font-black">Let's Be Friends!</h2>
          <p className="text-2xl font-medium opacity-90 leading-relaxed max-w-xl mx-auto">
            I love meeting new people and sharing ideas. Send me a message and let's build something awesome together!
          </p>
          
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-[3rem] border border-white/20 max-w-lg mx-auto space-y-4">
            <Input 
              placeholder="What's your name?" 
              className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/60 rounded-2xl text-lg focus:bg-white/20 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Textarea 
              placeholder="Tell me something cool!" 
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 rounded-2xl text-lg h-32 focus:bg-white/20 transition-all"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <Button 
              size="lg" 
              disabled={sending || !formData.message}
              onClick={handleSendMessage}
              className="w-full h-16 text-xl font-bold rounded-2xl bg-white text-primary hover:bg-white/90 gap-3 shadow-2xl active:scale-95 transition-transform"
            >
              {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Send Message <Send className="w-6 h-6" /></>}
            </Button>
          </div>

          <div className="pt-20 border-t border-white/20 text-lg font-bold opacity-80 flex flex-col items-center gap-4">
            <Image 
              src="https://i.ibb.co/NgtRP6Bt/Chit-Chat.png" 
              alt="Chit-Chat Logo" 
              width={60} 
              height={60} 
              className="rounded-full"
            />
            <p>© 2024 Chit-Chat World. Made with love and pixels by Vivanta.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
