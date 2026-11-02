import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_CONVERSATIONS = [
  {
    id: 'c1',
    customerName: 'Alice Freeman',
    customerEmail: 'alice@example.com',
    status: 'open',
    lastMessageTime: '10m ago',
    unread: 1,
    avatar: 'https://i.pravatar.cc/150?u=a',
    messages: [
      { id: 'm1', sender: 'user', text: 'Good day, I would like to inquire about the delivery timeline for my order #LK-2024-5412.', timestamp: '10:00 AM' },
      { id: 'm2', sender: 'agent', text: 'Hello Alice! I would be pleased to assist. Let me verify the warehouse courier tracking for you.', timestamp: '10:02 AM' },
      { id: 'm3', sender: 'user', text: 'Thank you, please let me know if signature on delivery is required.', timestamp: '10:04 AM' },
    ],
  },
  {
    id: 'c2',
    customerName: 'Mark Johnson',
    customerEmail: 'mark.j@example.com',
    status: 'open',
    lastMessageTime: '25m ago',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?u=m',
    messages: [
      { id: 'm1', sender: 'user', text: 'Do you offer insured international courier shipping to Canada?', timestamp: '09:40 AM' },
      { id: 'm2', sender: 'agent', text: 'Yes, we do. Complimentary insured air express arrives within 4-6 business days.', timestamp: '09:45 AM' },
    ],
  },
  {
    id: 'c3',
    customerName: 'Sophie Williams',
    customerEmail: 'swills@example.com',
    status: 'closed',
    lastMessageTime: '1d ago',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?u=s',
    messages: [
      { id: 'm1', sender: 'user', text: 'My package arrived in pristine condition, the presentation box is stunning. Thank you!', timestamp: 'Yesterday' },
      { id: 'm2', sender: 'agent', text: 'It has been an absolute pleasure assisting you, Sophie. Enjoy your atelier piece!', timestamp: 'Yesterday' },
    ],
  },
];

export async function GET() {
  try {
    const row = await prisma.cmsSetting.findUnique({
      where: { key: 'store_support_chats' },
    });
    if (row && Array.isArray(row.value) && row.value.length > 0) {
      return NextResponse.json({ conversations: row.value });
    }
    return NextResponse.json({ conversations: DEFAULT_CONVERSATIONS });
  } catch (error) {
    return NextResponse.json({ conversations: DEFAULT_CONVERSATIONS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, message, status, allConversations } = body;

    let updatedList: any[] = allConversations;

    if (!updatedList) {
      const current = await prisma.cmsSetting.findUnique({
        where: { key: 'store_support_chats' },
      });
      const list: any[] = (current?.value as any[]) || DEFAULT_CONVERSATIONS;

      const conv = list.find((c: any) => c.id === conversationId);
      if (conv) {
        if (message) {
          conv.messages.push({
            id: `m-${Date.now()}`,
            sender: message.sender || 'agent',
            text: message.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          conv.lastMessageTime = 'Just now';
          conv.unread = 0;
        }
        if (status) {
          conv.status = status;
        }
      }
      updatedList = list;
    }

    await prisma.cmsSetting.upsert({
      where: { key: 'store_support_chats' },
      update: { value: updatedList },
      create: { key: 'store_support_chats', value: updatedList },
    });

    return NextResponse.json({ success: true, conversations: updatedList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save chat message' }, { status: 500 });
  }
}

