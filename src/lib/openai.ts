import type { Fortune, CompatibilityResult } from "@/types";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

/** 브라우저에서 OpenAI Chat Completions 호출 (BYOK). */
async function chat(apiKey: string, system: string, user: string): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.9,
      max_tokens: 320,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) throw new Error("API 키가 올바르지 않아요. 설정에서 다시 확인해 주세요.");
    if (res.status === 429) throw new Error("요청이 많거나 크레딧이 부족해요. 잠시 후 다시 시도해 주세요.");
    throw new Error(`OpenAI 오류 (${res.status}): ${text.slice(0, 160)}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}

/** AI 운세 풀이 */
export function aiFortune(apiKey: string, zodiacKo: string, f: Fortune) {
  return chat(
    apiKey,
    "너는 따뜻하고 감성적인 별자리 운세 상담가야. 한국어로, 너무 길지 않게 3~4문장으로 풀이해.",
    `별자리: ${zodiacKo}\n오늘 운세 점수 - 총운 ${f.total}, 애정 ${f.love}, 금전 ${f.money}, 건강 ${f.health}, 행운 ${f.luck}\n행운의 아이템: ${f.luckyItem}, 행운의 색: ${f.luckyColor}\n이 정보를 바탕으로 오늘 하루를 위한 따뜻한 운세 조언을 들려줘.`,
  );
}

/** AI 궁합 코멘트 */
export function aiCompatibility(apiKey: string, zodiacA: string, zodiacB: string, r: CompatibilityResult) {
  return chat(
    apiKey,
    "너는 센스 있는 별자리 궁합 상담가야. 한국어로, 너무 길지 않게 3문장으로 코멘트해.",
    `${zodiacA}와 ${zodiacB}의 ${r.title} (점수 ${r.score}/100). 두 별자리의 매력 포인트와 관계를 더 좋게 만들 한마디를 들려줘.`,
  );
}
