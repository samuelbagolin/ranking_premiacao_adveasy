
import { Employee, Sector } from './types';

// Usando identificadores visuais robustos e cores baseadas nas imagens enviadas
export const EMPLOYEES: Employee[] = [
  {
    id: 'adriele',
    name: 'Adriele',
    sector: Sector.ONBOARDING,
    weight: 1.0,
    avatar: 'https://i.postimg.cc/DwSjCKcq/Chat-GPT-Image-19-de-jan-de-2026-14-36-21.png', 
    color: 'text-cyan-400',
    borderColor: 'neon-border-blue',
    glowColor: 'glow-text-blue',
    themeColor: '#22d3ee'
  },
  {
    id: 'jeniffer',
    name: 'Jeniffer',
    sector: Sector.ONGOING,
    weight: 0.5,
    avatar: 'https://i.postimg.cc/t4sSrHzV/Chat-GPT-Image-19-de-jan-de-2026-14-41-15.png',
    color: 'text-fuchsia-500',
    borderColor: 'neon-border-purple',
    glowColor: 'glow-text-purple',
    themeColor: '#d946ef'
  },
  {
    id: 'esdras',
    name: 'Esdras',
    sector: Sector.RETENCAO,
    weight: 1.5,
    avatar: 'https://i.postimg.cc/YCvnXwxY/Esdras-em-acao-com-chamas-intensas.png',
    color: 'text-orange-500',
    borderColor: 'neon-border-orange',
    glowColor: 'glow-text-orange',
    themeColor: '#f97316'
  }
];

export const ACTION_LABELS: Record<Sector, string> = {
  [Sector.ONBOARDING]: 'CONVERSÃO',
  [Sector.ONGOING]: 'CONVERSÃO',
  [Sector.RETENCAO]: 'RECUPERAÇÃO'
};

export const STORAGE_KEY = 'adveasy_submissions_v2';
