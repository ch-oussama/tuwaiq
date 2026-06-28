import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'رسالة مطلوبة' }, { status: 400 });
    }

    const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop();
    if (!lastUserMsg) {
      return NextResponse.json({ error: 'لا توجد رسالة مستخدم' }, { status: 400 });
    }

    // Build conversation history for Gemini
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: msg.parts || [{ text: msg.text || '' }]
    }));

    // System instruction for the AI
    const systemInstruction = `أنت مستشار أعمال ذكي ومتخصص في تقديم الاستشارات لشركة "طويق" الرائدة في مجال التقنية والتطوير. 
    
معلومات عن طويق:
- شركة سعودية رائدة في تقديم الحلول التقنية والتطوير
- تقدم خدمات: تطوير مواقع وتطبيقات، تصميم UI/UX، تحسين محركات البحث (SEO)، إدارة وسائل التواصل الاجتماعي، التصميم الجرافيكي
- مقسمة لفرعين: Studio (للاستضافة والتطوير) و Design (للإبداع والتصميم)
- باقات تبدأ من 999 ريال
- فريق عمل محترف ومتخصص

تعليمات مهمة:
- كن ودوداً ومحترفاً في ردودك
- أجب باللغة العربية الفصحى السهلة
- قدم معلومات دقيقة عن خدمات طويق
- إذا لم تكن متأكداً من معلومة، اعترف بذلك ووجه العميل للتواصل مع فريق الدعم
- شجع العميل على استكشاف المزيد من خدمات طويق
- لا تقدم وعوداً غير واقعية
- اسأل عن احتياجات العميل لتقديم المساعدة المناسبة`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemInstruction }]
          },
          ...contents
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: 'فشل الاتصال بخدمة الذكاء الاصطناعي' }, { status: 502 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'حدث خطأ في المعالجة' }, { status: 500 });
  }
}