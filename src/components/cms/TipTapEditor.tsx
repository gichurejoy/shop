'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

const MenuBar = ({ editor }: { editor: any }) => {
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [showImageInput, setShowImageInput] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');

  if (!editor) return null;

  const btnStyle = (isActive: boolean) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    background: isActive ? '#e2e8f0' : 'transparent',
    color: isActive ? '#0f172a' : '#64748b',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  });

  const handleApplyLink = () => {
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const handleApplyImage = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
    }
    setShowImageInput(false);
    setImageUrl('');
  };

  return (
    <div style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
      <div style={{ padding: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={btnStyle(editor.isActive('heading', { level: 1 }))}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive('heading', { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive('heading', { level: 3 }))}>H3</button>
        
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 4px', height: '20px' }} />
        
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive('bold'))}><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive('italic'))}><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} style={btnStyle(editor.isActive('underline'))}><u>U</u></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} style={btnStyle(editor.isActive('strike'))}><s>S</s></button>
        
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 4px', height: '20px' }} />
        
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} style={btnStyle(editor.isActive({ textAlign: 'left' }))}>Left</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} style={btnStyle(editor.isActive({ textAlign: 'center' }))}>Center</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} style={btnStyle(editor.isActive({ textAlign: 'right' }))}>Right</button>
        
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 4px', height: '20px' }} />
        
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive('bulletList'))}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive('orderedList'))}>1. List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive('blockquote'))}>Quote</button>
        
        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 4px', height: '20px' }} />
        
        <button 
          type="button"
          onClick={() => {
            setShowImageInput(false);
            setLinkUrl(editor.getAttributes('link').href || '');
            setShowLinkInput(!showLinkInput);
          }} 
          style={btnStyle(editor.isActive('link') || showLinkInput)}
        >
          Link
        </button>
        
        <button 
          type="button"
          onClick={() => {
            setShowLinkInput(false);
            setShowImageInput(!showImageInput);
          }} 
          style={btnStyle(showImageInput)}
        >
          Image
        </button>
      </div>

      {/* Inline Link Bar (No popups) */}
      {showLinkInput && (
        <div style={{ padding: '6px 12px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>URL:</span>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyLink(); } }}
            placeholder="https://example.com"
            autoFocus
            style={{ flex: 1, padding: '4px 8px', fontSize: '13px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
          <button
            type="button"
            onClick={handleApplyLink}
            style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 600, borderRadius: '4px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}
          >
            Apply
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 500, borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', color: '#ef4444', cursor: 'pointer' }}
            >
              Remove
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 500, borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Inline Image Bar (No popups) */}
      {showImageInput && (
        <div style={{ padding: '6px 12px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Image URL:</span>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyImage(); } }}
            placeholder="https://images.unsplash.com/..."
            autoFocus
            style={{ flex: 1, padding: '4px 8px', fontSize: '13px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
          <button
            type="button"
            onClick={handleApplyImage}
            style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 600, borderRadius: '4px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer' }}
          >
            Insert Image
          </button>
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 500, borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export function TipTapEditor({ value, onChange }: { value: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[300px] max-w-none p-4',
      },
    },
  });

  return (
    <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
