import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { addOrder, getOrders, updateOrderStatus } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(8);
  return Array.from(bytes).map(b => chars[b % chars.length]).join('');
}

async function sendToDiscord(order: Record<string, unknown>) {
  if (!DISCORD_WEBHOOK_URL) return;
  const embed = {
    embeds: [{
      title: '📦 طلب جديد | New Order',
      color: 0xF0C040,
      fields: [
        { name: '📋 الكود | Code', value: String(order.code), inline: true },
        { name: '💰 المجموع | Total', value: `$${order.total}`, inline: true },
        { name: '👤 الاسم | Name', value: String(order.fullName), inline: false },
        { name: '📧 البريد | Email', value: String(order.email), inline: true },
        { name: '📞 الجوال | Phone', value: String(order.phone), inline: true },
        { name: '🆔 الديسكورد | Discord', value: String(order.discordUsername), inline: true },
      ],
      timestamp: new Date().toISOString(),
    }],
  };
  try {
    await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(embed) });
  } catch (e) {
    console.error('Discord webhook failed:', e);
  }
}

export async function GET() {
  try {
    await getAdminSession();
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    const { fullName, email, phone, items, total, branch } = body;
    if (!fullName || typeof fullName !== 'string' || fullName.length > 200) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 300) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || phone.length > 20) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }
    if (typeof total !== 'number' || total < 0 || total > 100000) {
      return NextResponse.json({ error: 'Invalid total' }, { status: 400 });
    }

    const code = generateCode();
    const order = await addOrder({
      code,
      items,
      total,
      discordUsername: body.discordUsername || '',
      fullName,
      email,
      phone,
      status: 'pending',
      createdAt: Date.now(),
      branch: branch || 'studio',
    });
    await sendToDiscord({ ...order, code });
    return NextResponse.json({ code, orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await getAdminSession();
    const { id, status } = await req.json();

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await updateOrderStatus(id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
