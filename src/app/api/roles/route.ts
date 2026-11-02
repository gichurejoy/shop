import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MODULES = [
  'Storefront Builder',
  'Product Catalog',
  'Inventory Management',
  'Order Processing',
  'Customers',
  'Marketing & SEO',
  'Communications & Chat',
  'Reports & Analytics',
  'Settings & Staff',
];

const ACTIONS = ['Create', 'Read', 'Update', 'Delete'];

const DEFAULT_ROLES = [
  'Super Admin',
  'Store Manager',
  'Inventory Manager',
  'Order Fulfillment',
  'Marketing',
  'Support Agent',
];

const getDefaultPerms = (role: string) => {
  const m: Record<string, Record<string, boolean>> = {};
  MODULES.forEach((mod) => {
    m[mod] = { Create: false, Read: true, Update: false, Delete: false };
  });

  if (role === 'Super Admin') {
    MODULES.forEach((mod) => {
      m[mod] = { Create: true, Read: true, Update: true, Delete: true };
    });
  } else if (role === 'Store Manager') {
    MODULES.forEach((mod) => {
      m[mod] = { Create: true, Read: true, Update: true, Delete: false };
    });
    m['Settings & Staff'] = { Create: false, Read: true, Update: false, Delete: false };
  } else if (role === 'Inventory Manager') {
    m['Inventory Management'] = { Create: true, Read: true, Update: true, Delete: true };
    m['Product Catalog'] = { Create: false, Read: true, Update: true, Delete: false };
  } else if (role === 'Order Fulfillment') {
    m['Order Processing'] = { Create: true, Read: true, Update: true, Delete: false };
    m['Customers'] = { Create: false, Read: true, Update: false, Delete: false };
    m['Inventory Management'] = { Create: false, Read: true, Update: true, Delete: false };
  } else if (role === 'Marketing') {
    m['Storefront Builder'] = { Create: true, Read: true, Update: true, Delete: true };
    m['Marketing & SEO'] = { Create: true, Read: true, Update: true, Delete: true };
    m['Communications & Chat'] = { Create: true, Read: true, Update: true, Delete: false };
  } else if (role === 'Support Agent') {
    m['Customers'] = { Create: true, Read: true, Update: true, Delete: false };
    m['Order Processing'] = { Create: false, Read: true, Update: true, Delete: false };
  }
  return m;
};

const getDefaultMatrix = () => {
  const matrix: Record<string, any> = {};
  DEFAULT_ROLES.forEach((r) => {
    matrix[r] = getDefaultPerms(r);
  });
  return matrix;
};

export async function GET() {
  try {
    const row = await prisma.cmsSetting.findUnique({
      where: { key: 'store_role_permissions' },
    });
    if (row && typeof row.value === 'object' && row.value !== null) {
      return NextResponse.json({
        roles: Object.keys(row.value as object),
        matrix: row.value,
        modules: MODULES,
        actions: ACTIONS,
      });
    }
    const def = getDefaultMatrix();
    return NextResponse.json({
      roles: DEFAULT_ROLES,
      matrix: def,
      modules: MODULES,
      actions: ACTIONS,
    });
  } catch (error) {
    const def = getDefaultMatrix();
    return NextResponse.json({
      roles: DEFAULT_ROLES,
      matrix: def,
      modules: MODULES,
      actions: ACTIONS,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, permissions, allMatrix } = body;

    let updatedMatrix: Record<string, any> = {};

    if (allMatrix) {
      updatedMatrix = allMatrix;
    } else if (role && permissions) {
      const current = await prisma.cmsSetting.findUnique({
        where: { key: 'store_role_permissions' },
      });
      const existing = (current?.value as Record<string, any>) || getDefaultMatrix();
      updatedMatrix = { ...existing, [role]: permissions };
    }

    await prisma.cmsSetting.upsert({
      where: { key: 'store_role_permissions' },
      update: { value: updatedMatrix },
      create: { key: 'store_role_permissions', value: updatedMatrix },
    });

    return NextResponse.json({ success: true, matrix: updatedMatrix });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save role permissions' }, { status: 500 });
  }
}

