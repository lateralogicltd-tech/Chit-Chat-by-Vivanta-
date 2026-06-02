"use client";

import { useCollection, useFirestore } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { CreationView } from "@/components/history-canvas/CreationView";
import { Creation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Home, Plus, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";

export default function LibraryPage() {
  const db = useFirestore();
  
  const creationsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "creations"), orderBy("timestamp", "desc"));
  }, [db]);

  const { data: creations, loading } = useCollection<Creation>(creationsQuery);

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
          <Link href="/create">
            <Button className="gap-2 font-bold bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create New</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <div className="text-2xl font-headline font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span>Magic Library</span>
          </div>
          <p className="text-muted-foreground">All your historical adventures in one place!</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-xl font-bold text-muted-foreground">Opening the library doors...</p>
          </div>
        ) : creations && creations.length > 0 ? (
          <div className="space-y-24">
            {creations.map((creation) => (
              <div key={creation.id} className="pb-12 border-b border-dashed border-primary/20 last:border-0">
                <CreationView creation={creation} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-8">
            <div className="text-9xl">📚</div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold font-headline text-primary">The Library is Empty!</h2>
              <p className="text-xl text-muted-foreground">Go ahead and create your first historical adventure.</p>
            </div>
            <Link href="/create">
              <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-2xl bg-accent hover:bg-accent/90 shadow-xl">
                Start Creating!
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
