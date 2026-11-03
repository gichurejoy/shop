'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { CmsSection, SectionType, createDefaultSection } from '@/lib/cms-types';

// ─── Types ──────────────────────────────────────────────────────────────────
type State = {
  sections: CmsSection[];
  initialSections: CmsSection[];
  activeId: string | null;
  activeTab: 'blocks' | 'customize';
  isDirty: boolean;
  past: CmsSection[][];
  future: CmsSection[][];
};

type Action =
  | { type: 'SET_SECTIONS'; sections: CmsSection[] }
  | { type: 'ADD_SECTION'; sectionType: SectionType }
  | { type: 'INSERT_SECTION_AT'; sectionType: SectionType; index: number }
  | { type: 'REMOVE_SECTION'; id: string }
  | { type: 'UPDATE_SECTION'; id: string; patch: Partial<CmsSection> }
  | { type: 'MOVE_SECTION'; id: string; direction: 'up' | 'down' }
  | { type: 'DUPLICATE_SECTION'; id: string }
  | { type: 'SET_ACTIVE'; id: string | null }
  | { type: 'SET_ACTIVE_TAB'; tab: 'blocks' | 'customize' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'DISCARD' }
  | { type: 'MARK_SAVED' };

const MAX_HISTORY = 30;

function pushHistory(state: State): { past: CmsSection[][]; future: CmsSection[][] } {
  const newPast = [...state.past, state.sections];
  if (newPast.length > MAX_HISTORY) newPast.shift();
  return { past: newPast, future: [] };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SECTIONS':
      return { ...state, sections: action.sections, isDirty: false };

    case 'ADD_SECTION': {
      const id = `section-${Date.now()}`;
      const newSection = createDefaultSection(action.sectionType, id);
      const hist = pushHistory(state);
      return {
        ...state,
        ...hist,
        sections: [...state.sections, newSection],
        activeId: id,
        activeTab: 'customize',
        isDirty: true,
      };
    }

    case 'INSERT_SECTION_AT': {
      const id = `section-${Date.now()}`;
      const newSection = createDefaultSection(action.sectionType, id);
      const arr = [...state.sections];
      const targetIndex = Math.max(0, Math.min(action.index, arr.length));
      arr.splice(targetIndex, 0, newSection);
      const hist = pushHistory(state);
      return {
        ...state,
        ...hist,
        sections: arr,
        activeId: id,
        activeTab: 'customize',
        isDirty: true,
      };
    }

    case 'REMOVE_SECTION': {
      const hist = pushHistory(state);
      return {
        ...state,
        ...hist,
        sections: state.sections.filter(s => s.id !== action.id),
        activeId: state.activeId === action.id ? null : state.activeId,
        isDirty: true,
      };
    }

    case 'UPDATE_SECTION': {
      const hist = pushHistory(state);
      return {
        ...state,
        ...hist,
        sections: state.sections.map(s => s.id === action.id ? { ...s, ...action.patch } as CmsSection : s),
        isDirty: true,
      };
    }

    case 'MOVE_SECTION': {
      const idx = state.sections.findIndex(s => s.id === action.id);
      if (idx === -1) return state;
      const arr = [...state.sections];
      const target = action.direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= arr.length) return state;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      const hist = pushHistory(state);
      return { ...state, ...hist, sections: arr, isDirty: true };
    }

    case 'DUPLICATE_SECTION': {
      const src = state.sections.find(s => s.id === action.id);
      if (!src) return state;
      const newId = `section-${Date.now()}`;
      const dup = { ...src, id: newId };
      const idx = state.sections.findIndex(s => s.id === action.id);
      const arr = [...state.sections];
      arr.splice(idx + 1, 0, dup);
      const hist = pushHistory(state);
      return { ...state, ...hist, sections: arr, activeId: newId, activeTab: 'customize', isDirty: true };
    }

    case 'SET_ACTIVE':
      return {
        ...state,
        activeId: action.id,
        activeTab: action.id ? 'customize' : state.activeTab,
      };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab };

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        ...state,
        past: newPast,
        future: [state.sections, ...state.future],
        sections: prev,
        isDirty: true,
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        past: [...state.past, state.sections],
        future: newFuture,
        sections: next,
        isDirty: true,
      };
    }

    case 'DISCARD':
      return {
        ...state,
        sections: state.initialSections,
        past: [],
        future: [],
        activeId: null,
        isDirty: false,
      };

    case 'MARK_SAVED':
      return { ...state, initialSections: state.sections, isDirty: false };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
type CmsCtx = State & {
  dispatch: React.Dispatch<Action>;
  canUndo: boolean;
  canRedo: boolean;
  setSections: (s: CmsSection[]) => void;
  addSection: (t: SectionType) => void;
  insertSectionAt: (t: SectionType, index: number) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, patch: Partial<CmsSection>) => void;
  moveSection: (id: string, dir: 'up' | 'down') => void;
  duplicateSection: (id: string) => void;
  setActive: (id: string | null) => void;
  setActiveTab: (tab: 'blocks' | 'customize') => void;
  undo: () => void;
  redo: () => void;
  discardChanges: () => void;
  markSaved: () => void;
};

const CmsContext = createContext<CmsCtx | null>(null);

export function CmsProvider({ children, initial }: { children: React.ReactNode; initial: CmsSection[] }) {
  const [state, dispatch] = useReducer(reducer, {
    sections: initial,
    initialSections: initial,
    activeId: null,
    activeTab: 'blocks',
    isDirty: false,
    past: [],
    future: [],
  });

  const setSections = useCallback((s: CmsSection[]) => dispatch({ type: 'SET_SECTIONS', sections: s }), []);
  const addSection = useCallback((t: SectionType) => dispatch({ type: 'ADD_SECTION', sectionType: t }), []);
  const insertSectionAt = useCallback((t: SectionType, index: number) => dispatch({ type: 'INSERT_SECTION_AT', sectionType: t, index }), []);
  const removeSection = useCallback((id: string) => dispatch({ type: 'REMOVE_SECTION', id }), []);
  const updateSection = useCallback((id: string, patch: Partial<CmsSection>) => dispatch({ type: 'UPDATE_SECTION', id, patch }), []);
  const moveSection = useCallback((id: string, dir: 'up' | 'down') => dispatch({ type: 'MOVE_SECTION', id, direction: dir }), []);
  const duplicateSection = useCallback((id: string) => dispatch({ type: 'DUPLICATE_SECTION', id }), []);
  const setActive = useCallback((id: string | null) => dispatch({ type: 'SET_ACTIVE', id }), []);
  const setActiveTab = useCallback((tab: 'blocks' | 'customize') => dispatch({ type: 'SET_ACTIVE_TAB', tab }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  const discardChanges = useCallback(() => dispatch({ type: 'DISCARD' }), []);
  const markSaved = useCallback(() => dispatch({ type: 'MARK_SAVED' }), []);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return (
    <CmsContext.Provider
      value={{
        ...state,
        dispatch,
        canUndo,
        canRedo,
        setSections,
        addSection,
        insertSectionAt,
        removeSection,
        updateSection,
        moveSection,
        duplicateSection,
        setActive,
        setActiveTab,
        undo,
        redo,
        discardChanges,
        markSaved,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be inside CmsProvider');
  return ctx;
}
