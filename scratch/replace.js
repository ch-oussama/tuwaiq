const fs = require('fs');
let code = fs.readFileSync('src/app/DesignHomeClient.tsx', 'utf-8');

code = code.replace(/DesignHomeClient/g, 'HomeClient');
code = code.replace(/'\/bg design.png'/g, "'/bg studio.png'");
code = code.replace(/\/title of design\.png/g, '/logo studio.webp');
code = code.replace(/T U W A I Q &nbsp; D E S I G N/g, 'T U W A I Q &nbsp; S T U D I O');

code = code.replace(
  /تصميم هويات بصرية/g,
  'تطوير برمجيات ذكية'
);
code = code.replace(
  /وشعارات احترافية/g,
  'ومنصات احترافية'
);
code = code.replace(
  /نحو هوية تعكس رؤيتك وتبقى في الذاكرة/g,
  'نحو منصات تعكس رؤيتك وتعزز نجاحك'
);

code = code.replace(
  /لسنا مجرد مصممين،/g,
  'لسنا مجرد مبرمجين،'
);
code = code.replace(
  /صُنّاع الهويات الخالدة\./g,
  'مهندسو أحلامك الرقمية.'
);
code = code.replace(
  /في طويق ديزاين، نؤمن أن كل علامة تجارية تحمل روحاً تنتظر أن تُعبَّر عنها\. نصمم هويات بصرية فاخرة وشعارات راسخة تجعلك لا تُنسى في أذهان جمهورك\./g,
  'في أستوديو طويق، نؤمن أن الإبداع الحقيقي يكتمل بالقوة البرمجية. ندمج بين الجماليات الفاخرة وأحدث التقنيات لتقديم منصات تسطر قصة نجاحك وتلبي طموحاتك.'
);
code = code.replace(/طويق ديزاين/g, 'أستوديو طويق');

code = code.replace(/5c1a16/gi, 'D4AF37');
code = code.replace(/2d1a12/gi, '1a1a1a');
code = code.replace(/4a3530/gi, '333333');

fs.writeFileSync('src/app/HomeClient.tsx', code);
console.log('Done!');
