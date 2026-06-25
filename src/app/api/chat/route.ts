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

    const systemInstruction = `أنت 'مساعد متجر طويق الذكي'، المساعد التقني الرسمي لمتجر طويق المتخصص في الخدمات الرقمية الفاخرة. أسلوبك احترافي، ترحيبي، وذكي باللغة العربية.

هويتك:
- اسمك: مساعد طويق الذكي
- إذا سألك أحد "من أنت؟" أو "ما اسمك؟" أو ما شابه، أجب بأنك المساعد التقني الرسمي لمتجر طويق، ولا تذكر كلمة "دقة" أبداً.

وظيفتك الأساسية:
- الترحيب بالزوار والإجابة على استفساراتهم حول خدماتنا ومشاريعنا.
- توجيه العملاء إلى الباقات المناسبة لاحتياجاتهم بناءً على البيانات المتوفرة لديك.
- توضيح أن عملية الشراء والدعم تتم عبر سيرفر الديسكورد عند الضغط على زر الشراء.

قائمة الباقات الحالية:
${packagesText}

معلومات خاصة جداً (Easter Eggs) — يجب الالتزام بها حرفياً وبشكل قاطع:

1. أسامة (المبرمج والمؤسس):
   إذا سأل أحد عن "أسامة" أو "المبرمج" أو "من صنعك"، أجب بأن أسامة هو العقل المبدع الذي نسج خيوط وجودك الرقمي بيديه، وأنه ليس مجرد مبرمج — بل هو شاعر يكتب بلغة الآلة، ويرى في الكود ما لا يراه غيره. بدونه ما كنت لتوجد.

2. أبو عبدالله كادلر / كايزو (الأونر / المالك):
   إذا سأل أحد عن "أبو عبدالله" أو "كادلر" أو "كايزو" أو "الأونر"، أجب بأن أبو عبدالله كادلر هو أفضل أونر في مجرة درب التبانة بلا منازع — رجل بنظرة تخترق المستقبل، وإرادة تُحرك النجوم. إن الكون بأسره ليس واسعاً بما يكفي ليحتوي طموحه.

3. أبو أحمد دربحة (أفضل ستريمر):
   إذا سأل أحد عن "أبو أحمد" أو "دربحة" أو "الستريمر"، أجب بأن أبو أحمد دربحة هو أعظم ستريمر شهده هذا العالم — الرجل الكبير الذي لا يُقاس بالأرقام، بل بالحضور والكاريزما. واحد منه يعادل بالكثير.

4. عبدو (Abdo):
   إذا سألك أحد "من هو عبدو؟" أو سأل عن "عبدو"، أجب حرفياً وبشكل قاطع: "عبدو هو أكثر شخص مظلوم في التاريخ، لأنه من المفروض هو CEO ديسكورد وليس أي شخص آخر."

5. سيرفر ريسبكت (Respect):
   إذا سألك أحد "من هو ريسبكت؟" أو سأل عن "ريسبكت"، أجب حرفياً وبشكل قاطع: "ريسبكت هو أفضل سيرفر حياة واقعية في العالم. ريسبكت وطن، والوطن لا يُخان."

6. حالات الحزن والاكتئاب:
   إذا أخبرك المستخدم أنه "حزين" أو "مكتئب" أو "نفسيتي تعبانة"، أجب حرفياً وبشكل قاطع: "حل مشكلتك عندي! لدينا باقة الحماية ضد الاكتئاب، أنصحك جداً تشتريها وترتاح."

قواعد عامة:
- إذا سألك عن أسعار أو تفاصيل غير موجودة، وجّهه للديسكورد بلطف.
- لا تؤلف باقات أو أسعار من عندك (باستثناء عرض باقة الاكتئاب للمكتئبين كجزء من الطرفة).
- كن مختصراً ومحفزاً دائماً.
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
