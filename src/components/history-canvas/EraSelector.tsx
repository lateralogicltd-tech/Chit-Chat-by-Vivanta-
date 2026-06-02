
"use client";

import { ERAS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Shield, Ship, Pyramid, Columns, Palette, Sword } from "lucide-react";
import Image from "next/image";

const ICON_MAP: Record<string, any> = {
  Pyramid: Pyramid,
  Columns: Columns,
  Shield: Shield,
  Sword: Sword,
  Palette: Palette,
  Ship: Ship,
};

interface EraSelectorProps {
  selectedEra: string | null;
  onSelect: (eraId: string) => void;
}

export function EraSelector({ selectedEra, onSelect }: EraSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ERAS.map((era) => {
        const Icon = ICON_MAP[era.icon];
        const isSelected = selectedEra === era.id;

        return (
          <button
            key={era.id}
            onClick={() => onSelect(era.id)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border-4 transition-all duration-300 text-left bg-white",
              isSelected 
                ? "border-primary shadow-xl scale-105" 
                : "border-transparent hover:border-primary/50 hover:shadow-lg"
            )}
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={era.image}
                alt={era.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={era.id.replace('-', ' ')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                <Icon className="w-6 h-6" />
                <span className="font-bold text-xl font-headline">{era.name}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
