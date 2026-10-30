'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { CmsSection, SectionType, createDefaultSection } from '../../../lib/cms-types';

// ─── Types ──────────────────────────────────────────────────────────────────
type State = {
  sections: CmsSection[];
  activeId: string | null;
  isDirty: boolean;
};

type Action =
  | { type: 'SET_SECTIONS'; sections: CmsSection[] }
  | { type: 'ADD_SECTION'; sectionType: SectionType }
  | { type: 'REMOVE_SECTION'; id: string }
  | { type: 'UPDATE_SECTION'; id: string; patch: Partial<CmsSection> }
  | { type: 'MOVE_SECTION'; id: string; direction: 'up' | 'down' }
  | { type: 'DUPLICATE_SECTION'; id: string }
  | { type: 'SET_ACTIVE'; id: string | null }
  | { type: 'MARK_SAVED' };

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SECTIONS':
      return { ...state, sections: action.sections, isDirty: false };
    case 'ADD_SECTION': {
      const id = `section-${Date.now()}`;
      const newSection = createDefaultSection(action.sectionType, id);
      return { ...state, sections: [...state.sections, newSection], activeId: id, isDirty: true };
    }
    case 'REMOVE_SECTION':
      return {
        ...state,
        sections: state.sections.filter(s => s.id !== action.id),
        activeId: state.activeId === action.id ? null : state.activeId,
        isDirty: true,
      };
    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map(s => s.id === action.id ? { ...s, ...action.patch } as CmsSection : s),
        isDirty: true,
      };
    case 'MOVE_SECTION': {
      const idx = state.sections.findIndex(s => s.id === action.id);
      if (idx === -1) return state;
      const arr = [...state.sections];
      const target = action.direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= arr.length) return state;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...state, sections: arr, isDirty: true };
    }
    case 'DUPLICATE_SECTION': {
      const src = state.sections.find(s => s.id === action.id);
      if (!src) return state;
      const newId = `section-${Date.now()}`;
      const dup = { ...src, id: newId };
      const idx = state.sections.findIndex(s => s.id === action.id);
      const arr = [...state.sections];
      arr.splice(idx + 1, 0, dup);
      return { ...state, sections: arr, isDirty: true };
    }
    case 'SET_ACTIVE':
      return { ...state, activeId: action.id };
    case 'MARK_SAVED':
      return { ...state, isDirty: false };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
type CmsCtx = State & {
  dispatch: React.Dispatch<Action>;
  setSections: (s: CmsSection[]) => void;
  addSection: (t: SectionType) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, patch: Partial<CmsSection>) => void;
  moveSection: (id: string, dir: 'up' | 'down') => void;
  duplicateSection: (id: string) => void;
  setActive: (id: string | null) => void;
  markSaved: () => void;
};

const CmsContext = createContext<CmsCtx | null>(null);

export function CmsProvider({ children, initial }: { children: React.ReactNode; initial: CmsSection[] }) {
  const [state, dispatch] = useReducer(reducer, { sections: initial, activeId: null, isDirty: false });

  const setSections = useCallback((s: CmsSection[]) => dispatch({ type: 'SET_SECTIONS', sections: s }), []);
  const addSection = useCallback((t: SectionType) => dispatch({ type: 'ADD_SECTION', sectionType: t }), []);
  const removeSection = useCallback((id: string) => dispatch({ type: 'REMOVE_SECTION', id }), []);
  const updateSection = useCallback((id: string, patch: Partial<CmsSection>) => dispatch({ type: 'UPDATE_SECTION', id, patch }), []);
  const moveSection = useCallback((id: string, dir: 'up' | 'down') => dispatch({ type: 'MOVE_SECTION', id, direction: dir }), []);
  const duplicateSection = useCallback((id: string) => dispatch({ type: 'DUPLICATE_SECTION', id }), []);
  const setActive = useCallback((id: string | null) => dispatch({ type: 'SET_ACTIVE', id }), []);
  const markSaved = useCallback(() => dispatch({ type: 'MARK_SAVED' }), []);

  return (
    <CmsContext.Provider value={{ ...state, dispatch, setSections, addSection, removeSection, updateSection, moveSection, duplicateSection, setActive, markSaved }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be inside CmsProvider');
  return ctx;
}
