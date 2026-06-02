
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EraSelector } from "@/components/history-canvas/EraSelector";
import { CreationView } from "@/components/history-canvas/CreationView";
import { Creation, HistoricalCharacter, ERAS } from "@/lib/types";
import { generateHistoricalCharacterIdeas } from "@/ai/flows/generate-historical-character-ideas-flow";
import { generateHistoricalSceneOrPrompt } from "@/ai/flows/generate-historical-scene-or-prompt-flow";
import { ArrowLeft, Save, Sparkles, Loader2, Home, Library, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

type Step = "era" | "characters" | "scene" | "result";

export default function CreatePage() {
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("era");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [characterIdeas, setCharacterIdeas] = useState("");
  const [generatedCharacters, setGeneratedCharacters] = useState<HistoricalCharacter[]>([]);
  const [sceneDescription, setSceneDescription] = useState("");
  const [generatedScenePrompt, setGeneratedScenePrompt] = useState("");

  const [finalCreation, setFinalCreation] = useState<Creation | null>(null);

  const resetFlow = () => {
    setStep("era");
    setSelectedEra(null);
    setCharacterIdeas("");
    setGeneratedCharacters([]);
    setSceneDescription("");
    setGeneratedScenePrompt("");
    setFinalCreation(null);
  };

  const handleEraSelect = (eraId: string) => {
    setSelectedEra(eraId);
    setStep("characters");
  };

  const generateCharacters = async () => {
    if (!selectedEra) return;
    setLoading(true);
    try {
      const eraName = ERAS.find(e => e.id === selectedEra)?.name || selectedEra;
      const result = await generateHistoricalCharacterIdeas({ 
        era: eraName, 
        userIdeas: characterIdeas 
      });
      setGeneratedCharacters(result);
      setStep("scene");
    } catch (error) {
      toast({ 
        title: "Oh No!", 
        description: "The AI was busy daydreaming. Let's try again! 🌈",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateScene = async () => {
    if (!selectedEra || generatedCharacters.length === 0) return;
    setLoading(true);
    try {
      const eraName = ERAS.find(e => e.id === selectedEra)?.name || selectedEra;
      const charsString = generatedCharacters.map(c => `${c.name} (${c.role})`).join(", ");
      const result = await generateHistoricalSceneOrPrompt({
        era: eraName,
        characterIdeas: charsString,
        sceneDescription: sceneDescription,
      });
      setGeneratedScenePrompt(result.scenePrompt);
      
      const creation: Creation = {
        id: crypto.randomUUID(),
        title: sceneDescription.slice(0, 30) || "My Historical Adventure",
        era: selectedEra,
        characterIdeas,
        generatedCharacters,
        sceneDescription,
        generatedScenePrompt: result.scenePrompt,
        timestamp: Date.now(),
      };
      setFinalCreation(creation);
      setStep("result");
    } catch (error) {
      toast({ 
        title: "Oops!", 
        description: "The story magic faded for a second. Press the button again! ✨",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCreation = () => {
    if (!finalCreation || !db) return;
    setSaving(true);
    
    const creationsRef = collection(db, "creations");
    addDoc(creationsRef, {
      title: finalCreation.title,
      era: finalCreation.era,
      characterIdeas: finalCreation.characterIdeas,
      generatedCharacters: finalCreation.generatedCharacters,
      sceneDescription: finalCreation.sceneDescription,
      generatedScenePrompt: finalCreation.generatedScenePrompt,
      timestamp: finalCreation.timestamp,
    })
    .then(() => {
      toast({ title: "Saved! 📚", description: "Your adventure is now in the Magic Library!" });
      router.push("/library");
    })
    .catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: creationsRef.path,
        operation: 'create',
        requestResourceData: finalCreation,
      });
      errorEmitter.emit('permission-error', permissionError);
    })
    .finally(() => {
      setSaving(false);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="p-4 border-b border-primary/10 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <Image 
            src="https://i.ibb.co/NgtRP6Bt/Chit-Chat.png" 
            alt="Chit-Chat Logo" 
            width={40} 
            height={40} 
            className="rounded-full"
          />
          <span className="text-xl font-headline font-bold text-primary hidden sm:block">Chit-Chat</span>
        </Link>
        <div className="flex gap-2 sm:gap-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2 font-bold text-primary rounded-full">
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <Link href="/library">
            <Button variant="ghost" className="gap-2 font-bold text-secondary rounded-full">
              <Library className="w-5 h-5" />
              <span className="hidden sm:inline">Library</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-12">
        {step === "era" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold font-headline text-primary">Choose Your Era</h2>
              <p className="text-xl text-muted-foreground">Which period of history should we explore today?</p>
            </div>
            <EraSelector selectedEra={selectedEra} onSelect={handleEraSelect} />
          </div>
        )}

        {step === "characters" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setStep("era")} className="rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h2 className="text-4xl font-bold font-headline text-primary">Meet Your People</h2>
            </div>
            <div className="bg-white/80 p-8 rounded-3xl shadow-xl border-4 border-primary/20 space-y-6">
              <label className="text-xl font-bold block">
                Any ideas for characters? (e.g. "a brave knight" or "a funny baker")
              </label>
              <Textarea 
                placeholder="Type your ideas here... or leave it blank for a surprise!"
                className="text-lg h-32 rounded-2xl p-6 focus:ring-accent bg-white/50"
                value={characterIdeas}
                onChange={(e) => setCharacterIdeas(e.target.value)}
              />
              <Button 
                onClick={generateCharacters} 
                disabled={loading}
                className="w-full h-16 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-lg active:scale-[0.98] transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Sparkles className="w-6 h-6 mr-2" />}
                {loading ? "Thinking..." : "Generate Characters"}
              </Button>
            </div>
          </div>
        )}

        {step === "scene" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setStep("characters")} className="rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h2 className="text-4xl font-bold font-headline text-primary">Set the Scene</h2>
            </div>
            <div className="bg-white/80 p-8 rounded-3xl shadow-xl border-4 border-accent/20 space-y-6">
              <label className="text-xl font-bold block">
                What's happening in this scene?
              </label>
              <Input 
                placeholder="e.g. A hidden treasure under a pyramid..."
                className="text-lg h-16 rounded-2xl px-6 focus:ring-accent bg-white/50"
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
              />
              <p className="text-sm text-muted-foreground italic">
                We'll use your {generatedCharacters.length} characters in this story!
              </p>
              <Button 
                onClick={generateScene} 
                disabled={loading || !sceneDescription}
                className="w-full h-16 text-xl font-bold rounded-2xl bg-accent hover:bg-accent/90 shadow-lg active:scale-[0.98] transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Sparkles className="w-6 h-6 mr-2" />}
                {loading ? "Writing your story..." : "Create My Scene"}
              </Button>
            </div>
          </div>
        )}

        {step === "result" && finalCreation && (
          <div className="space-y-12 animate-in zoom-in duration-500">
             <CreationView creation={finalCreation} />
             <div className="flex flex-col sm:flex-row gap-4 pt-8">
               <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 h-16 text-xl font-bold rounded-2xl border-4 border-muted bg-white/50 hover:bg-white/80"
                onClick={resetFlow}
               >
                 <RotateCcw className="w-6 h-6 mr-2" />
                 Start Over
               </Button>
               <Button 
                size="lg" 
                disabled={saving}
                className="flex-1 h-16 text-xl font-bold rounded-2xl bg-accent hover:bg-accent/90 shadow-xl active:scale-[0.98] transition-all"
                onClick={saveCreation}
               >
                 {saving ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                 {saving ? "Saving..." : "Save to Library"}
               </Button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
