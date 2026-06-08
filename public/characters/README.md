# public/characters

여기에 수호 캐릭터 일러스트를 넣습니다. 파일명은 캐릭터 id와 동일해야 합니다.

| 별자리 | 파일명 |
|--------|--------|
| 양자리 | `char-aries.png` |
| 황소자리 | `char-taurus.png` |
| 쌍둥이자리 | `char-gemini.png` |
| 게자리 | `char-cancer.png` |
| 사자자리 | `char-leo.png` |
| 처녀자리 | `char-virgo.png` |
| 천칭자리 | `char-libra.png` |
| 전갈자리 | `char-scorpio.png` |
| 사수자리 | `char-sagittarius.png` |
| 염소자리 | `char-capricorn.png` |
| 물병자리 | `char-aquarius.png` |
| 물고기자리 | `char-pisces.png` |

## 채우는 방법 2가지

### A. AI 자동 생성 (OpenAI, 권장)
```bash
# .env.local 에 OPENAI_API_KEY=sk-... 추가 후
npm run gen:characters          # 없는 것만 생성
npm run gen:characters -- --force  # 전부 다시 생성
```

### B. 직접 업로드
정사각형 PNG(투명 배경 권장, 512px 이상)를 위 파일명으로 이 폴더에 저장하면 됩니다.

> 파일이 없으면 앱은 자동으로 테마색 그라데이션 플레이스홀더를 표시합니다. (깨지지 않음)
