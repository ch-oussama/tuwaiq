import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addOrder, getOrders, updateOrderStatus } from '@/lib/db';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function sendToDiscord(order: any) {
  if (!DISCORD_WEBHOOK_URL) return;
  const embed = {
    embeds: [{
      title: '📦 طلب جديد | New Order',
      color: 0xF0C040,
      fields: [
        { name: '📋 الكود | Code', value: order.code, inline: true },
        { name: '💰 المجموع | Total', value: `$${order.total}`, inline: true },
        { name: '👤 الاسم | Name', value: order.fullName, inline: false },
        { name: '📧 البريد | Email', value: order.email, inline: true },
        { name: '📞 الجوال | Phone', value: order.phone, inline: true },
        { name: '🆔 الديسكورد | Discord', value: order.discordUsername, inline: true },
        { name: '📦 المكونات | Items', value: order.items.map((i: any) => `- ${i.optionName} ($${i.price})`).join('\n'), inline: false },
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
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = generateCode();
    const order = await addOrder({
      code,
      items: body.items,
      total: body.total,
      discordUsername: body.discordUsername,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      status: 'pending',
      createdAt: Date.now(),
      branch: body.branch,
    });
    await sendToDiscord({ ...order, code });
    return NextResponse.json({ code, orderId: order.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const adminAuth = (await cookies()).get('admin_auth')?.value;
  if (adminAuth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, status } = await req.json();
    await updateOrderStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
