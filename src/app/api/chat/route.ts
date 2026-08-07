import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ text: 'عذراً، يرجى كتابة رسالة.' });
    }

    const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop();
    if (!lastUserMsg) {
      return NextResponse.json({ text: 'عذراً، يرجى كتابة رسالة.' });
    }

    const systemPrompt = `أنت مستشار أعمال ذكي ومتخصص في تقديم الاستشارات لشركة "طويق" الرائدة في مجال التقنية والتطوير.

معلومات عن طويق:
- شركة سعودية رائدة في تقديم الحلول التقنية والتطوير
- تقدم خدمات: تطوير مواقع وتطبيقات، تصميم UI/UX، تحسين محركات البحث (SEO)، إدارة وسائل التواصل الاجتماعي، التصميم الجرافيكي
- مقسمة لفرعين: Studio و Design
- باقات تبدأ من 999 ريال

تعليمات:
- أجب باللغة العربية الفصحى السهلة
- كن ودوداً ومحترفاً
- قدم معلومات دقيقة عن خدمات طويق
- إذا لم تكن متأكداً، وجه العميل للتواصل مع فريق الدعم`;

    const userText = lastUserMsg.parts?.[0]?.text || '';

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userText }
        ],
        temperature: 0.8,
        seed: Math.floor(Math.random() * 999999),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pollinations error:', response.status, errorText);
      return NextResponse.json({ text: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.' });
    }

    const data = await response.text();
    const text = data?.trim() || '';

    if (!text) {
      return NextResponse.json({ text: 'عذراً، لم أتمكن من فهم استفسارك.' });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ text: 'عذراً، حدث خطأ أثناء الاتصال.' });
  }
}
