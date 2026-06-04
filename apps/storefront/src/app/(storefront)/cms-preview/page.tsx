'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CmsSection } from '../../../lib/cms-types';
import { RenderSection } from '../../../components/cms/SectionRenderer';

export default function CmsPreviewPage() {
  const [sections, setSections] = useState<CmsSection[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'INIT' || e.data?.type === 'UPDATE') {
        setSections(e.data.sections || []);
      }
      if (e.data?.type === 'SET_ACTIVE') {
        setActiveId(e.data.id);
      }
    };
    window.addEventListener('message', handler);
    // Tell parent we are ready
    window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleSectionClick = (id: string) => {
    window.parent.postMessage({ type: 'SECTION_CLICKED', id }, '*');
  };

  const handleSectionUpdate = (id: string, patch: Partial<CmsSection>) => {
    const updated = sections.map(s => s.id === id ? { ...s, ...patch } as CmsSection : s);
    setSections(updated);
    window.parent.postMessage({ type: 'SECTION_UPDATED', id, patch }, '*');
  };

  // Reordering handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const isAbove = relativeY < rect.height / 2;

    setDragOverIndex(index);
    setDropPosition(isAbove ? 'above' : 'below');
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    let insertIndex = targetIndex;
    if (dropPosition === 'below') {
      insertIndex = targetIndex + 1;
    }

    const updated = [...sections];
    const [draggedItem] = updated.splice(draggedIndex, 1);

    let finalInsertIndex = insertIndex;
    if (draggedIndex < insertIndex) {
      finalInsertIndex = insertIndex - 1;
    }

    updated.splice(finalInsertIndex, 0, draggedItem);
    setSections(updated);
    window.parent.postMessage({ type: 'SECTIONS_REORDERED', sections: updated }, '*');

    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
    setSections(updated);
    window.parent.postMessage({ type: 'SECTIONS_REORDERED', sections: updated }, '*');
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setSections(updated);
    window.parent.postMessage({ type: 'SECTIONS_REORDERED', sections: updated }, '*');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const updated = sections.filter(s => s.id !== id);
      setSections(updated);
      window.parent.postMessage({ type: 'SECTION_DELETED', id }, '*');
    }
  };

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 animate-pulse">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <p className="text-lg font-medium">Add sections on the left to start building</p>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {sections.map((s, idx) => {
        const isActive = s.id === activeId;
        const isDragTarget = dragOverIndex === idx;

        return (
          <div
            key={s.id}
            onDragOver={e => handleDragOver(e, idx)}
            onDrop={e => handleDrop(e, idx)}
            className="relative group transition-all duration-200"
            style={{
              outline: isActive 
                ? '3px solid #3b82f6' 
                : '2px dashed transparent',
              outlineOffset: '-2px',
            }}
          >
            {/* Visual Drag Over Insert Line Indicator */}
            {isDragTarget && dropPosition && (
              <div 
                className="absolute left-0 right-0 h-1.5 bg-blue-500 z-50 pointer-events-none rounded transition-all duration-100"
                style={{
                  top: dropPosition === 'above' ? '-3px' : 'auto',
                  bottom: dropPosition === 'below' ? '-3px' : 'auto',
                  boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)'
                }}
              />
            )}

            {/* Canvas Section Interactive Toolbar */}
            <div 
              className="absolute top-3 left-3 z-40 flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-lg p-1.5 shadow-xl backdrop-blur-md border border-slate-700/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none text-xs"
              onClick={e => {
                e.stopPropagation();
                handleSectionClick(s.id);
              }}
            >
              {/* Drag Handle */}
              <div
                draggable
                onDragStart={e => handleDragStart(e, idx)}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing px-2 py-0.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white flex items-center gap-1.5 font-semibold text-[10px] tracking-wider uppercase"
                title="Drag to reorder section"
              >
                <span className="flex text-slate-400">☰</span>
                <span>{s.type.replace('-', ' ')}</span>
              </div>
              
              <div className="w-[1px] h-3.5 bg-slate-700" />
              
              {/* Up Button */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleMoveUp(idx);
                }}
                disabled={idx === 0}
                className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 hover:text-white flex items-center"
                title="Move Up"
              >
                ▲
              </button>

              {/* Down Button */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleMoveDown(idx);
                }}
                disabled={idx === sections.length - 1}
                className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 hover:text-white flex items-center"
                title="Move Down"
              >
                ▼
              </button>

              <div className="w-[1px] h-3.5 bg-slate-700" />

              {/* Delete Button */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleDelete(s.id);
                }}
                className="p-1 hover:bg-red-600/30 hover:text-red-400 rounded text-slate-300 flex items-center"
                title="Delete Section"
              >
                🗑
              </button>
            </div>

            <div className="relative">
              <RenderSection 
                s={s} 
                activeId={activeId} 
                onClick={handleSectionClick} 
                onUpdateSection={handleSectionUpdate} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
