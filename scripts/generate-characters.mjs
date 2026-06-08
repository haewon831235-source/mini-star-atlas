#!/usr/bin/env node
/**
 * MINI STAR ATLAS — 캐릭터 일러스트 자동 생성 (OpenAI Images, BYOK)
 *
 * 사용법:
 *   1) .env.local 에 OPENAI_API_KEY=sk-... 추가 (또는 환경변수로 전달)
 *   2) npm run gen:characters            # 없는 것만 생성
 *      npm run gen:characters -- --force  # 전부 다시 생성
 *
 * 결과: public/characters/{id}.png (1024x1024, 투명 배경)
 * 비용: gpt-image-1 기준 이미지당 약 $0.04~0.17 (총 12장)
 */

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "characters");

const MODEL = "gpt-image-1";
const SIZE = "1024x1024";
const FORCE = process.argv.includes("--force");

// 12 수호 캐릭터 (src/data/characters.ts 와 동일한 id 사용)
const CHARACTERS = [
  { id: "char-aries", name: "Arion", title: "불꽃의 기사", element: "fire", color: "#FB7185", desc: "두려움을 모르는 불꽃의 화신, 붉은 갑옷을 입은 양자리 기사" },
  { id: "char-taurus", name: "Tauri", title: "대지의 수호자", element: "earth", color: "#86C28B", desc: "동료를 지키는 황소자리의 든든한 방패, 자연석 갑옷" },
  { id: "char-gemini", name: "Mira", title: "바람의 쌍성", element: "air", color: "#93C5FD", desc: "바람을 타고 소식을 나르는 쌍둥이자리 전령, 가벼운 깃털 장식" },
  { id: "char-cancer", name: "Cara", title: "달빛 수호자", element: "water", color: "#7B61FF", desc: "달빛으로 상처를 어루만지는 게자리 치유사, 진주빛 의상" },
  { id: "char-leo", name: "Leo", title: "태양의 사자", element: "fire", color: "#E8C76A", desc: "태양의 갈기를 두른 사자자리 영웅, 황금 왕관과 망토" },
  { id: "char-virgo", name: "Vira", title: "별의 사서", element: "earth", color: "#86C28B", desc: "은하의 기록을 정리하는 처녀자리 현자, 빛나는 책과 안경" },
  { id: "char-libra", name: "Astra", title: "균형의 천사", element: "air", color: "#93C5FD", desc: "빛과 그림자를 저울질하는 천칭자리 천사, 황금 저울과 날개" },
  { id: "char-scorpio", name: "Nox", title: "심연의 파수꾼", element: "water", color: "#7B61FF", desc: "진실을 꿰뚫는 전갈자리 추적자, 어두운 후드와 보라빛 독침 장식" },
  { id: "char-sagittarius", name: "Arlo", title: "폭풍의 궁수", element: "fire", color: "#FB7185", desc: "지평선 너머로 화살을 쏘는 사수자리 모험가, 별빛 활" },
  { id: "char-capricorn", name: "Cairn", title: "산정의 현자", element: "earth", color: "#86C28B", desc: "설산 정상에 선 염소자리 인내자, 두꺼운 망토와 지팡이" },
  { id: "char-aquarius", name: "Vela", title: "은하의 항해사", element: "air", color: "#93C5FD", desc: "별 사이 길을 그리는 물병자리 개척자, 미래적인 항해사 의상" },
  { id: "char-pisces", name: "Luna", title: "심해의 수호자", element: "water", color: "#7B61FF", desc: "상상의 바다를 다스리는 물고기자리 몽상가, 흐르는 보라빛 머리카락" },
];

const STYLE = [
  "high-quality mobile gacha game character art",
  "inspired by Genshin Impact and Honkai Star Rail, with a touch of Disney charm",
  "semi-chibi proportions, cute yet elegant, single character, bust/upper-body, centered",
  "soft cel shading, clean line art, glowing rim light, sparkling starlight particles",
  "transparent background, no text, no watermark, no border",
].join(", ");

function loadEnv() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  return readFile(join(ROOT, ".env.local"), "utf8")
    .then((txt) => {
      const m = txt.match(/^OPENAI_API_KEY=(.+)$/m);
      return m ? m[1].trim() : null;
    })
    .catch(() => null);
}

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function generateOne(apiKey, c) {
  const prompt =
    `A guardian spirit character named ${c.name}, "${c.title}". ` +
    `${c.desc}. Zodiac ${c.element} element, dominant theme color ${c.color}. ` +
    `Art style: ${STYLE}.`;

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      size: SIZE,
      n: 1,
      background: "transparent",
      output_format: "png",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("응답에 이미지 데이터가 없습니다.");
  await writeFile(join(OUT_DIR, `${c.id}.png`), Buffer.from(b64, "base64"));
}

async function main() {
  const apiKey = await loadEnv();
  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY 가 없습니다. .env.local 에 추가하거나 환경변수로 전달하세요.");
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  console.log(`🎨 캐릭터 일러스트 생성 시작 (model: ${MODEL}, ${SIZE})\n`);

  let done = 0;
  let skipped = 0;
  for (const c of CHARACTERS) {
    const out = join(OUT_DIR, `${c.id}.png`);
    if (!FORCE && (await exists(out))) {
      console.log(`⏭️  건너뜀 (이미 존재): ${c.id}.png`);
      skipped++;
      continue;
    }
    process.stdout.write(`⏳ 생성 중: ${c.name} (${c.title}) ... `);
    try {
      await generateOne(apiKey, c);
      console.log("✅");
      done++;
    } catch (err) {
      console.log("❌");
      console.error(`   → ${err.message}`);
    }
  }

  console.log(`\n완료: 생성 ${done}장 · 건너뜀 ${skipped}장`);
  console.log("이미지는 public/characters/ 에 저장됐습니다. 앱을 새로고침하면 반영됩니다.");
}

main();
