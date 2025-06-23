import { templates } from "@/consts/templates";

/**
 * Core data structure for concert memory information
 */
export interface ConcertMemory {
  /** Name of the performing artist or band (required) */
  artist: string;
  /** Name of the concert venue (required) */
  venue: string;
  /** Date of the concert in YYYY-MM-DD format */
  date: string;
  /** Personal notes and feelings about the concert */
  notes: string;
  /** Optional setlist or song list */
  setlist: string;
  /** Mood rating from 1-5 scale */
  moodRating: number;
}

/**
 * Visual customization options for the memory card
 */
export interface CustomizationOptions {
  /** Color scheme theme */
  colorScheme: (typeof templates)[number]["id"];
  /** Font style selection */
  font: "typewriter" | "zine" | "handwritten" | "creepy" | "mono";
  /** Card layout orientation */
  layout: "vertical" | "horizontal";
  /** Whether to apply polaroid-style frame */
  polaroidFrame: boolean;
}

/**
 * Form validation errors
 */
export interface FormErrors {
  artist?: string;
  venue?: string;
  date?: string;
  notes?: string;
  setlist?: string;
  moodRating?: string;
}
