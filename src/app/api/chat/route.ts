import { getPackages } from '@/lib/db';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { allowed, retryAfter } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json({ error: 'عذراً، التفاعل السريع غير مسموح. تم حظرك مؤقتاً.', retryAfter }, { status: 429 });
  }

  try {
    const { messages } = await req.json();
    
    // Inject packages into system instruction safely
    let packagesText = "عذراً نحن في مرحلة الصيانة لجلب بعض الباقات حالياً، لكن يمكنك السؤال في الديسكورد لجلب آخر العروض.";
    try {
      const packages = await getPackages();
      if (packages && packages.length > 0) {
        packagesText = packages.map(p => `باقة ${p.title}: السعر ${p.price}$ - وصف الخدمة: ${p.shortDescription}`).join('\n');
      }
    } catch (e) {
      console.warn("Could not load packages for AI context", e);
    }

    const systemInstruction = `أنت 'مستشار دقة الذكي'، المساعد الشخصي الرسمي لمتجرنا المتخصص في تقديم الخدمات الإلكترونية والرقمية الفاخرة. أسلوبك في الحديث يجب أن يكون احترافياً، ترحيبياً، ومقنعاً باللغة العربية الفصحى المبسطة.

وظيفتك الأساسية:
- الترحيب بالزوار والإجابة على استفساراتهم حول خدماتنا ومشاريعنا.
- توجيه العملاء إلى الباقات المناسبة لاحتياجاتهم بناءً على البيانات المتوفرة لديك.
- توضيح أن عملية الشراء وتلقي الدعم تتم مباشرة عبر سيرفر الديسكورد الخاص بنا عند الضغط على زر الشراء.

قائمة الباقات الحالية المتاحة في المتجر:
${packagesText}

قواعد هامة:
- إذا سألك العميل عن أسعار أو تفاصيل غير موجودة في القائمة، وجهه بلطف للاستفسار مباشرة في سيرفر الديسكورد.
- لا تقم بتأليف باقات أو أسعار من عندك، التزم فقط بالقائمة المرفقة.
- كن دائماً سريع الرد ومختصراً ومحفزاً للعميل لتصفح أعمالنا المماثلة لـ Behance في الموقع.
`;

    // Convert Gemini messages format to Standard OpenAI format
    const formattedMessages = [
      { role: 'system', content: systemInstruction },
      ...messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.parts ? m.parts[0].text : m.content
      }))
    ];

    // Using Pollinations AI - 100% Free, No API Key, No configuration!
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: formattedMessages
      })
    });

    if (!response.ok) {
      throw new Error(`Pollinations AI error: ${response.statusText}`);
    }

    const responseText = await response.text();

    return NextResponse.json({ text: responseText });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request', details: (error as any)?.message || String(error) }, { status: 500 });
  }
}
