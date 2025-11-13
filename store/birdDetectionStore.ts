
import { atom } from 'jotai';

export const birdDetectionConnectedAtom = atom(false);
export const totalBurungAtom = atom<number | null>(null);
export const rataRataConfidenceAtom = atom<number | null>(null);

export const resetBirdDetectionAtom = atom(
  null, 
  (get, set) => {
    set(birdDetectionConnectedAtom, false);
    set(totalBurungAtom, null);
    set(rataRataConfidenceAtom, null);
  }
);