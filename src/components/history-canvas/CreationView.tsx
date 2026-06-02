
"use client";

import { Creation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Sparkles } from "lucide-react";

interface CreationViewProps {
  creation: Creation;
}

export function CreationView({ creation }: CreationViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-headline text-primary">Your History Canvas</h2>
        <Badge variant="secondary" className="px-4 py-1 text-lg">
          {creation.era.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Users className="w-6 h-6" />
            <h3>Characters</h3>
          </div>
          {creation.generatedCharacters.map((char, idx) => (
            <Card key={idx} className="overflow-hidden border-2 border-primary/20 bg-white/50 backdrop-blur-sm">
              <CardHeader className="bg-primary/10 pb-2">
                <CardTitle className="text-xl font-headline">{char.name}</CardTitle>
                <p className="text-sm font-medium text-primary uppercase tracking-wider">{char.role}</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm italic text-muted-foreground">"{char.appearance}"</p>
                <div className="flex flex-wrap gap-2">
                  {char.personalityTraits.map((trait, tIdx) => (
                    <Badge key={tIdx} variant="outline" className="bg-background">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-accent font-bold text-xl">
            <Sparkles className="w-6 h-6" />
            <h3>The Story Prompt</h3>
          </div>
          <Card className="border-4 border-primary/30 shadow-2xl relative overflow-hidden min-h-[400px]">
             {/* Thematic background pattern mock */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" />
            
            <CardContent className="p-10 relative space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />
                  Your Scene Idea
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed italic border-l-4 border-accent pl-4">
                  "{creation.sceneDescription}"
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="h-px bg-border w-full" />
                <p className="text-2xl font-medium leading-relaxed font-body first-letter:text-5xl first-letter:font-bold first-letter:text-accent first-letter:mr-3 first-letter:float-left">
                  {creation.generatedScenePrompt}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
