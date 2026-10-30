'use client';

import React, { useState, useEffect } from 'react';
import { getCmsNavigation, saveCmsNavigation } from '../../../../actions';
import type { CmsMenuNode } from '../../../../../lib/cms';

export default function NavigationBuilder() {
  const [menu, setMenu] = useState<CmsMenuNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    const data = await getCmsNavigation();
    setMenu(data.length ? data : [
      { id: '1', label: 'Home', link: '/', isMega: false, children: [] },
      { id: '2', label: 'Shop', link: '/shop', isMega: true, children: [] },
    ]);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveCmsNavigation(menu);
    setSaving(false);
    alert('Menu saved successfully!');
  };

  const addTopLevel = () => {
    setMenu([...menu, {
      id: Date.now().toString(),
      label: 'New Item',
      link: '#',
      isMega: false,
      children: [],
    }]);
  };

  const updateNode = (id: string, patch: Partial<CmsMenuNode>, list = menu): CmsMenuNode[] => {
    return list.map(node => {
      if (node.id === id) return { ...node, ...patch };
      if (node.children) return { ...node, children: updateNode(id, patch, node.children) };
      return node;
    });
  };

  const removeNode = (id: string, list = menu): CmsMenuNode[] => {
    return list.filter(node => {
      if (node.id === id) return false;
      if (node.children) node.children = removeNode(id, node.children);
      return true;
    });
  };

  const addChild = (parentId: string, list = menu): CmsMenuNode[] => {
    return list.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, { id: Date.now().toString(), label: 'Sub Item', link: '#', isMega: false, children: [] }]
        };
      }
      if (node.children) return { ...node, children: addChild(parentId, node.children) };
      return node;
    });
  };

  const moveNode = (index: number, direction: 'up' | 'down') => {
    const arr = [...menu];
    if (direction === 'up' && index > 0) {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
    } else if (direction === 'down' && index < arr.length - 1) {
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    }
    setMenu(arr);
  };

  const renderNode = (node: CmsMenuNode, depth = 0, index = 0, isRoot = true) => {
    return (
      <div key={node.id} className="card shadow-sm mb-2 border">
        <div className="card-body p-3 bg-white d-flex align-items-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: '200px' }}>
            <iconify-icon icon="solar:reorder-bold" className="text-muted fs-18" style={{ cursor: 'grab' }}></iconify-icon>
            <input 
              type="text" 
              className="form-control form-control-sm fw-bold" 
              value={node.label} 
              onChange={e => setMenu(updateNode(node.id, { label: e.target.value }))} 
              style={{ width: '150px' }}
            />
            <input 
              type="text" 
              className="form-control form-control-sm" 
              value={node.link} 
              onChange={e => setMenu(updateNode(node.id, { link: e.target.value }))} 
              placeholder="/link"
              style={{ width: '150px' }}
            />
            {isRoot && (
              <div className="form-check form-switch ms-2 mb-0 d-flex align-items-center gap-2">
                <input 
                  className="form-check-input mt-0" 
                  type="checkbox" 
                  checked={node.isMega} 
                  onChange={e => setMenu(updateNode(node.id, { isMega: e.target.checked }))} 
                />
                <label className="form-check-label fs-13 mb-0">Mega Menu</label>
              </div>
            )}
            <input 
              type="text" 
              className="form-control form-control-sm ms-2" 
              value={node.badge || ''} 
              onChange={e => setMenu(updateNode(node.id, { badge: e.target.value }))} 
              placeholder="Badge (e.g. Sale)"
              style={{ width: '120px' }}
            />
          </div>
          
          <div className="d-flex gap-1 align-items-center">
            {isRoot && (
              <>
                <button className="btn btn-sm btn-light py-0 px-1" onClick={() => moveNode(index, 'up')} disabled={index === 0}><i className="bx bx-chevron-up fs-18 align-middle"></i></button>
                <button className="btn btn-sm btn-light py-0 px-1" onClick={() => moveNode(index, 'down')} disabled={index === menu.length - 1}><i className="bx bx-chevron-down fs-18 align-middle"></i></button>
              </>
            )}
            {depth === 0 && (
              <button className="btn btn-sm btn-soft-primary" onClick={() => setMenu(addChild(node.id))}>+ Add Sub-Item</button>
            )}
            <button className="btn btn-sm btn-soft-danger" onClick={() => setMenu(removeNode(node.id))}>Remove</button>
          </div>
        </div>
        
        {node.children?.length > 0 && (
          <div className="bg-light p-3 border-top">
            <div className="d-flex flex-column gap-2 ps-4" style={{ borderLeft: '2px solid #e2e8f0' }}>
              {node.children.map((child, i) => renderNode(child, depth + 1, i, false))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Main Navigation Menu</h5>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={addTopLevel}>
                <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Menu Item
              </button>
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave} disabled={saving}>
                <iconify-icon icon="solar:diskette-bold"></iconify-icon> {saving ? 'Saving...' : 'Save Menu'}
              </button>
            </div>
          </div>
          <div className="card-body bg-light-subtle">
            {loading ? (
              <div className="text-center p-5 text-muted">Loading menu...</div>
            ) : (
              <div className="d-flex flex-column gap-2 mx-auto" style={{ maxWidth: '900px' }}>
                {menu.map((node, i) => renderNode(node, 0, i, true))}
                {menu.length === 0 && (
                  <div className="text-center p-5 text-muted bg-white border rounded">No menu items found. Click 'Add Menu Item' to start.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
