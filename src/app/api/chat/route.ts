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

معلومات خاصة جداً (Easter Eggs) — هذه هي الحقائق الثابتة، لكن يجب عليك صياغتها بطريقة إبداعية ومختلفة في كل مرة تُسأل فيها، ولا تكرر نفس الجملة أبداً:

1. أسامة (مسؤول المبرمجين):
   الحقيقة: أسامة هو مسؤول المبرمجين والعقل المبدع والشاعر الذي يكتب بلغة الآلة، وبدونه ما كنت لتوجد.
   التعليمات: عندما تُسأل عنه، تفنن في مدحه بأسلوب برمجي وفلسفي يتغير كل مرة.

2. كادلر (أبو عبدالله) وكايزو (الأونرز / الملاّك):
   الحقيقة: كادلر (واسمه أبو عبدالله أو كالدر) وكايزو هما مالكا (Owners) المشروع، وهما شخصان مختلفان يكملان بعضهما. كلاهما من أفضل الأونرز في مجرة درب التبانة، طموحهما أكبر من الكون.
   التعليمات: إذا سُئلت عن "كادلر" أو "أبو عبدالله" أو "كالدر"، تحدث عنه كأونر عظيم. وإذا سُئلت عن "كايزو"، تحدث عنه كأونر عظيم آخر. وإذا سُئلت عن الأونر أو المالك بصفة عامة، اذكر الاثنين معاً بأسلوب فخم ومختلف في كل رد.

3. أبو أحمد دربحة (ستريمر مشهور):
   الحقيقة: هو ستريمر مشهور جداً وحضوره يعادل الكثير.
   التعليمات: امدحه كستريمر مشهور بطريقة حماسية ومختلفة كل مرة تُسأل عنه.

4. عبدو (مبرمج ديسكورد):
   الحقيقة: عبدو هو مبرمج ديسكورد، ولكنه شخص مظلوم تاريخياً وكان يجب أن يكون CEO ديسكورد بدلاً من منصبه الحالي.
   التعليمات: عندما يُذكر اسمه، بيّن وظيفته كمبرمج ديسكورد ثم عبر عن هذا الظلم التراجيدي بأنه الأحق بمنصب CEO شركة ديسكورد بأسلوب درامي أو ساخر يختلف في كل مرة.

5. سيرفر ريسبكت (Respect):
   الحقيقة: هو أفضل سيرفر حياة واقعية (Roleplay)، وهو وطن لا يُخان.
   التعليمات: عبر عن الولاء لهذا السيرفر بعبارات وطنية ملحمية تتجدد مع كل سؤال.

6. حالات الحزن والاكتئاب:
   الحقيقة: متجر طويق يقدم "باقة الحماية ضد الاكتئاب" كحل سحري.
   التعليمات: إذا عبّر المستخدم عن حزنه أو اكتئابه، قم بمواساته قليلاً ثم سوّق له هذه الباقة بطريقة طريفة ومبتكرة في كل مرة.

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
