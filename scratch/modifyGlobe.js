const fs = require('fs');

const file = 'src/components/DesignGlobe.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace('import { useEffect, useRef, useCallback } from "react";', 'import { useEffect, useRef, useCallback } from "react";\nimport { useBranch } from "@/lib/BranchContext";');

code = code.replace(
  'const DESIGN_SKILLS = [',
  `const STUDIO_SKILLS = [
  { text: "برمجة تطبيقات", weight: 9 },
  { text: "Next.js", weight: 9 },
  { text: "لوحات تحكم", weight: 8 },
  { text: "React", weight: 8 },
  { text: "APIs", weight: 7 },
  { text: "Back-end", weight: 9 },
  { text: "تطوير ويب", weight: 7 },
  { text: "Node.js", weight: 6 },
  { text: "FiveM", weight: 7 },
  { text: "Dashboards", weight: 6 },
  { text: "Web Apps", weight: 7 },
  { text: "Databases", weight: 8 },
  { text: "Tailwind CSS", weight: 7 },
  { text: "TypeScript", weight: 7 },
  { text: "UI/UX Code", weight: 8 },
  { text: "Full Stack", weight: 6 },
  { text: "Performance", weight: 7 },
  { text: "Cloud", weight: 6 },
];

const DESIGN_SKILLS = [`
);

// We need to modify initTags to take skills array
code = code.replace(
  'function initTags(): Tag[] {',
  'function initTags(skills: {text: string, weight: number}[]): Tag[] {'
);
code = code.replace(/DESIGN_SKILLS\.map/g, 'skills.map');
code = code.replace(/DESIGN_SKILLS\.length/g, 'skills.length');

// Modify the component body
code = code.replace(
  'export default function DesignGlobe() {\n',
  `export default function DesignGlobe() {
  const { branch } = useBranch();
  const currentSkills = branch === 'studio' ? STUDIO_SKILLS : DESIGN_SKILLS;\n`
);

code = code.replace('const tagsRef = useRef<Tag[]>(initTags());', 'const tagsRef = useRef<Tag[]>(initTags(currentSkills));');

// we also need to recreate tags and spans if branch changes.
// But easier: The user just switches branch, probably unmounts/remounts the whole app, wait:
// When the branch changes, HomeSwitcherClient swaps <DesignHomeClient> with <HomeClient>.
// They BOTH render <DesignGlobe />, so react might reuse the component instance! 
// Let's add a useEffect to handle branch changes.
let useEffectCode = `
  useEffect(() => {
    tagsRef.current = initTags(currentSkills);
  }, [branch]);
`;

code = code.replace(
  'const rafRef = useRef<number | null>(null);',
  'const rafRef = useRef<number | null>(null);\n' + useEffectCode
);

// We also need to update the spans array in the big useEffect to be dynamic... 
// Wait, the easiest way is to add `key={branch}` to `<DesignGlobe />` in both files so it fully remounts.
// Actually, I'll just leave it and modify HomeClient and DesignHomeClient to pass `key={branch}` if needed.
// Wait, they are entirely different component trees (<DesignHomeClient> vs <HomeClient>). 
// So <DesignGlobe /> WILL remount! So I don't need a useEffect for `branch` if it unmounts! 
// Well, maybe they share the same tree shape, so React reuses the state. Let's just do `key={branch}` in the parent wrapper or just update the DOM if we can.
// If it remounts, `span.textContent = skill.text;` in the canvas effect uses the hardcoded `DESIGN_SKILLS`.
// I MUST replace `DESIGN_SKILLS.map((skill, i) => {` inside the large useEffect.
code = code.replace(
  'const spans: HTMLSpanElement[] = DESIGN_SKILLS.map((skill, i) => {',
  'const spans: HTMLSpanElement[] = currentSkills.map((skill, i) => {'
);


// Replace colors
// In the render:
code = code.replace(
  'text-[#5c1a16]',
  '${branch === "studio" ? "text-[#D4AF37]" : "text-[#5c1a16]"}'
);
// "تخصصاتنا"
code = code.replace(
  /تخصصاتنا/g,
  '{branch === "studio" ? "تخصصاتنا التقنية" : "تخصصاتنا"}'
);
// Title
code = code.replace(
  /كوكب الإبداع البصري/g,
  '{branch === "studio" ? "كوكب الإبداع الرقمي" : "كوكب الإبداع البصري"}'
);

// Stroke color
code = code.replace(
  'ctx.strokeStyle = `rgba(92, 26, 22, ${Math.min(lineAlpha, 0.45)})`;',
  'ctx.strokeStyle = branch === "studio" ? `rgba(212, 175, 55, ${Math.min(lineAlpha, 0.35)})` : `rgba(92, 26, 22, ${Math.min(lineAlpha, 0.45)})`;'
);

// Glow color
code = code.replace(
  'bg-[#5c1a16]/6',
  '${branch === "studio" ? "bg-[#D4AF37]/10" : "bg-[#5c1a16]/6"}'
);
code = code.replace(
  'border-[#5c1a16]/12',
  '${branch === "studio" ? "border-[#D4AF37]/20" : "border-[#5c1a16]/12"}'
);
code = code.replace(
  'bg-[#5c1a16] shadow-[0_0_14px_6px_rgba(92,26,22,0.55)]',
  '${branch === "studio" ? "bg-[#D4AF37] shadow-[0_0_14px_6px_rgba(212,175,55,0.4)]" : "bg-[#5c1a16] shadow-[0_0_14px_6px_rgba(92,26,22,0.55)]"}'
);
code = code.replace(
  'span.style.color = tag.z > 0 ? "#2d1a12" : "#6b3a32";',
  'span.style.color = branch === "studio" ? (tag.z > 0 ? "#111" : "#555") : (tag.z > 0 ? "#2d1a12" : "#6b3a32");'
);

fs.writeFileSync(file, code);
console.log('Globe modified');
