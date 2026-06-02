export interface Project {
  id: string;
  title: string;
  description: string;
  emoji: string;
  tags: string[];
  color: string;
  link?: string;
}

export interface Skill {
  name: string;
  emoji: string;
  level: number; // 0-100
}

export interface HistoricalCharacter {
  name: string;
  appearance: string;
  role: string;
  personalityTraits: string[];
}

export interface Creation {
  id: string;
  title: string;
  era: string;
  characterIdeas: string;
  generatedCharacters: HistoricalCharacter[];
  sceneDescription: string;
  generatedScenePrompt: string;
  timestamp: number;
}

export const ERAS = [
  { id: 'ancient-egypt', name: 'Ancient Egypt', icon: 'Pyramid', image: 'https://picsum.photos/seed/egypt/600/400' },
  { id: 'roman-empire', name: 'Roman Empire', icon: 'Columns', image: 'https://picsum.photos/seed/rome/600/400' },
  { id: 'medieval-knights', name: 'Medieval Knights', icon: 'Shield', image: 'https://picsum.photos/seed/knights/600/400' },
  { id: 'samurai-japan', name: 'Samurai Japan', icon: 'Sword', image: 'https://picsum.photos/seed/samurai/600/400' },
  { id: 'renaissance', name: 'Renaissance', icon: 'Palette', image: 'https://picsum.photos/seed/renaissance/600/400' },
  { id: 'viking-age', name: 'Viking Age', icon: 'Ship', image: 'https://picsum.photos/seed/viking/600/400' },
];

export const MY_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'History Canvas',
    description: 'A magic tool that lets you talk to people from the past! I made this with my AI friends.',
    emoji: '🎨',
    tags: ['AI', 'History', 'Art'],
    color: 'bg-pink-100 border-pink-200',
    link: '/create',
  },
  {
    id: '2',
    title: 'Space Explorer',
    description: 'A map of the stars where you can find hidden planets and aliens!',
    emoji: '🚀',
    tags: ['Games', 'Space'],
    color: 'bg-blue-100 border-blue-200',
  },
  {
    id: '3',
    title: 'Dino World',
    description: 'A library of every dinosaur that ever lived, even the really fast ones.',
    emoji: '🦖',
    tags: ['Science', 'Dinos'],
    color: 'bg-green-100 border-green-200',
  },
];

export const MY_SUPERPOWERS: Skill[] = [
  { name: 'Storytelling', emoji: '📚', level: 90 },
  { name: 'Drawing', emoji: '🖍️', level: 85 },
  { name: 'Building Legos', emoji: '🧱', level: 100 },
  { name: 'Asking Why', emoji: '❓', level: 95 },
  { name: 'Coding Stuff', emoji: '💻', level: 80 },
];
