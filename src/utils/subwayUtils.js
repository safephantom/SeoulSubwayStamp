// Subway Line Colors matching index.css variables
export const LINE_COLORS = {
  "1호선": "var(--line-1)",
  "2호선": "var(--line-2)",
  "3호선": "var(--line-3)",
  "4호선": "var(--line-4)",
  "5호선": "var(--line-5)",
  "6호선": "var(--line-6)",
  "7호선": "var(--line-7)",
  "8호선": "var(--line-8)",
  "9호선": "var(--line-9)",
  "수인분당선": "var(--line-suin)",
  "신분당선": "var(--line-shinbundang)",
  "경의중앙선": "var(--line-gyeongui)",
  "공항철도": "var(--line-airport)",
  "경춘선": "var(--line-gyeongchun)",
  "우이신설선": "var(--line-ui)",
  "신림선": "var(--line-sillim)",
  "김포골드라인": "var(--line-gimpo)",
  "용인경전철": "var(--line-ever)",
  "의정부경전철": "var(--line-uijeongbu)",
  "경강선": "var(--line-gyeonggang)",
  "서해선": "var(--line-seohae)",
  "GTX-A": "var(--line-gtx)",
  "인천1호선": "var(--line-incheon1)",
  "인천2호선": "var(--line-incheon2)",
};

export const getLineColor = (lineName) => {
  return LINE_COLORS[lineName] || "var(--line-default)";
};

// Design cues map for key Seoul Subway Stations to ensure visually stunning and relevant stamps
export const STATION_DESIGN_HINTS = {
  "홍대입구": "인디 음악과 버스킹을 상징하는 정교한 어쿠스틱 통기타와 그 주변을 흐르듯 감싸는 작은 음표들",
  "경복궁": "경복궁 근정전 기와지붕의 우아한 이중 처마 곡선과 은은한 전통 문창살 패턴",
  "안국": "북촌 한옥마을의 전통 기와 지붕과 정갈한 한글 격자 창살 문양",
  "성수": "성수동 수제화 거리를 나타내는 가죽 구두 실루엣과 장인의 가위, 그리고 공장 톱니바퀴 조각",
  "잠실": "석촌호수의 잔물결 위에 우뚝 서서 하늘을 찌르는 롯데월드타워의 초고층 실루엣",
  "시청": "서울 도서관(구 시청사) 건물의 고풍스러운 전면 석조 기둥 외관과 서울광장의 둥근 곡선 라인",
  "여의도": "공원에 흩날리는 벚꽃 꽃잎들과 국회의사당의 상징적인 둥근 돔 지붕 실루엣",
  "동대문역사문화공원": "DDP(동대문디자인플라자)의 우주선 같은 독특하고 미래지향적인 은빛 유선형 빌딩 외곽선",
  "명동": "남산 서울타워(N서울타워)의 높은 전경 실루엣과 쇼핑백/선물상자의 단순한 디자인 조화",
  "강남": "빽빽하게 솟은 강남대로의 고층 현대식 빌딩 숲과 바쁘게 흐르는 교차로 도로 선들",
  "혜화": "대학로 극장가를 상징하는 무대의 반쯤 열린 벨벳 커튼과 슬픔/기쁨을 상징하는 연극 가면",
  "신도림": "디큐브시티의 현대식 구형 유리 돔 건축물과 바쁘게 뻗어나가는 기차 철로 철길 무늬",
  "왕십리": "철도 교통의 중심지를 상징하는 오거리 방향 표지판과 교차하는 철길 궤도, 그리고 열차 바퀴",
  "독립문": "우뚝 솟은 석조 독립문 아치교 기단과 그 뒤로 은은하게 들어간 태극 문양 무늬",
  "고속터미널": "사방으로 뻗어 나가는 고속도로 차선들과 버스 바퀴, 그리고 이정표 화살표들",
  "국회의사당": "국회의사당 건물의 상징적인 웅장한 둥근 돔 지붕 실루엣과 평화와 협치를 상징하는 둥근 기둥 기단 무늬",
  "여의나루": "여의도 한강공원 물결 위에 둥둥 떠가는 낭만적인 오리배와 한강의 잔물결, 그리고 흩날리는 벚꽃 잎",
  "마포": "마포나루 황포돛배의 커다란 돛과 한강 물결, 그리고 마포 주물럭/갈비를 상징하는 숯불 화로의 기하학적 심볼 대비",
  "중앙보훈병원": "나라를 위해 헌신한 유공자들의 숭고한 희생을 기리는 보훈의 따뜻한 하트와 치유의 나뭇잎, 그리고 태극기 문양 조화"
};


// Calculate distance between two GPS coordinates using Haversine formula (returns meters)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};

// Generate a beautiful default (fallback) SVG stamp programmatically
export const generateDefaultStampSVG = (stationName, lineName, dateString = "UNLOCKED") => {
  const hexColors = {
    "1호선": "#0052A4", "2호선": "#00A84D", "3호선": "#EF7C1C", "4호선": "#00A2D1",
    "5호선": "#996CAC", "6호선": "#CD7C2F", "7호선": "#747F28", "8호선": "#E6186C",
    "9호선": "#BDB092", "수인분당선": "#F2A900", "신분당선": "#D4003B", "경의중앙선": "#77C4A3",
    "공항철도": "#0090D2", "경춘선": "#0C8E72", "우이신설선": "#B0C4DE", "신림선": "#6789CA",
    "김포골드라인": "#AD8600", "용인경전철": "#509F3D", "의정부경전철": "#FDA600",
    "경강선": "#0054A6", "서해선": "#81A914", "GTX-A": "#A17800", "인천1호선": "#7CA8D5", "인천2호선": "#FD8100",
  };
  
  const strokeColor = hexColors[lineName] || "#6366f1";
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
    <circle cx="100" cy="100" r="96" fill="none" stroke="${strokeColor}" stroke-width="5" />
    <circle cx="100" cy="100" r="87" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="6 4" />
    <circle cx="100" cy="100" r="64" fill="none" stroke="${strokeColor}" stroke-width="2" />
    <path d="M84 84 H116 M84 96 H116 M88 76 L84 84 V108 L88 116 H112 L116 108 V84 L112 76 Z" fill="none" stroke="${strokeColor}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="92" cy="104" r="3" fill="${strokeColor}"/>
    <circle cx="108" cy="104" r="3" fill="${strokeColor}"/>
    <path d="M92 116 L88 126 M108 116 L112 126" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round"/>
    <rect x="40" y="124" width="120" height="20" rx="6" fill="#101118" stroke="${strokeColor}" stroke-width="2"/>
    <text x="100" y="138" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="${strokeColor}" text-anchor="middle" letter-spacing="1">${stationName}</text>
    <path id="curveTop" d="M 28 100 A 72 72 0 0 1 172 100" fill="none" stroke="none" />
    <path id="curveBottom" d="M 21 100 A 79 79 0 0 0 179 100" fill="none" stroke="none" />
    <text font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="${strokeColor}"><textPath href="#curveTop" startOffset="50%" text-anchor="middle">${lineName}</textPath></text>
    <text font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="600" fill="${strokeColor}"><textPath href="#curveBottom" startOffset="50%" text-anchor="middle">${dateString}</textPath></text>
  </svg>`;
};

// Direct Client-Side Call to Gemini API to generate custom SVG Stamp
export const generateGeminiAIStamp = async (apiKey, model = "gemini-2.5-flash", stationName, lineName, temperature = 0.4) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const hint = STATION_DESIGN_HINTS[stationName] || "이 역의 역사, 문화, 주변 유명한 랜드마크, 혹은 지역적 특색을 담은 단순하고 강렬한 대표 심볼";

  const prompt = `지하철역 이름: ${stationName} (${lineName})
그려야 할 핵심 상징: **${hint}**
동그란 모양의 '지하철 기념 도장'의 중앙에 들어갈 유려하고 밀도 높은 일러스트를 SVG 도형 태그(최상위 <svg> 제외)들로만 반환해줘.

[디자인 요구사항]
1. **풍성하고 대칭적인 레이아웃**: 상징물 주변에 자연스럽게 어울리는 배경 요소(구름, 별빛, 물결, 철길 등)를 배치하여 시각 밀도를 높여줘. 유려한 대칭성과 곡선(C,S,Q) 및 직선을 융합하고, 선이 끊어지지 않게 닫힌 경로(Z) 위주로 설계해줘.
2. **면(Fill)과 선(Stroke)의 대비**: 강조할 부위(기와지붕 등)는 단색 면(\`fill="black" stroke="none"\`)으로 채우고, 묘사 선은 굵게(\`fill="none" stroke="black" stroke-width="10"\`) 처리하여 선명하고 묵직한 스탬프 잉크 느낌을 구현해줘.
3. **창의적 재해석 허용**: 단순히 1차원적인 묘사를 넘어, 역 지명의 유래나 특징에서 얻은 영감을 기하학적 엠블럼이나 은유적이고 예술적인 구도로 위트 있게 표현해도 좋아.
4. **중앙 정렬 규격**: viewBox 0 0 1000 1000 기준, 모든 일러스트는 중심(500,500) 반경 280 이내(좌표값 220~780 영역)에 온전히 배치해줘.

[출력 형식 및 스토리]
- 마크다운 코드 블록(\`\`\`xml ... \`\`\`) 내에 생성된 SVG 태그들만 출력해줘.
- 도장 맨 아래에 이 도장의 주석 스토리(예: <!-- story: ... -->)를 반드시 포함해줘.`;
  
  const requestBody = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: temperature, topP: 0.95, maxOutputTokens: 8192 } };

  try {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestBody) });
    if (!response.ok) throw new Error(`API error (${response.status})`);
    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    let innerSvgContent = generatedText.substring(generatedText.indexOf("```xml") + 6, generatedText.lastIndexOf("```")).trim();
    innerSvgContent = innerSvgContent.replace(/<\?xml[\s\S]*?\?>/g, "").replace(/<!DOCTYPE[\s\S]*?>/g, "").replace(/<svg[\s\S]*?>/g, "").replace(/<\/svg>/g, "");
    
    const hexColors = { "1호선": "#0052A4", "2호선": "#00A84D", "3호선": "#EF7C1C", "4호선": "#00A2D1", "5호선": "#996CAC", "6호선": "#CD7C2F", "7호선": "#747F28", "8호선": "#E6186C", "9호선": "#BDB092", "수인분당선": "#F2A900", "신분당선": "#D4003B", "경의중앙선": "#77C4A3", "공항철도": "#0090D2", "경춘선": "#0C8E72", "우이신설선": "#B0C4DE", "신림선": "#6789CA", "김포골드라인": "#AD8600", "용인경전철": "#509F3D", "의정부경전철": "#FDA600", "경강선": "#0054A6", "서해선": "#81A914", "GTX-A": "#A17800", "인천1호선": "#7CA8D5", "인천2호선": "#FD8100" };
    const strokeColor = hexColors[lineName] || "#6366f1";
    innerSvgContent = innerSvgContent.replace(/stroke="black"/gi, `stroke="${strokeColor}"`).replace(/stroke="#000000"/gi, `stroke="${strokeColor}"`).replace(/stroke="#000"/gi, `stroke="${strokeColor}"`).replace(/fill="black"/gi, `fill="${strokeColor}"`).replace(/fill="#000000"/gi, `fill="${strokeColor}"`).replace(/fill="#000"/gi, `fill="${strokeColor}"`);
    
    const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <circle cx="500" cy="500" r="480" fill="none" stroke="${strokeColor}" stroke-width="25" />
  <circle cx="500" cy="500" r="435" fill="none" stroke="${strokeColor}" stroke-width="10" stroke-dasharray="30 20" />
  <circle cx="500" cy="500" r="320" fill="none" stroke="${strokeColor}" stroke-width="10" />
  <path id="curveTop" d="M 140 500 A 360 360 0 0 1 860 500" fill="none" stroke="none" />
  <path id="curveBottom" d="M 105 500 A 395 395 0 0 0 895 500" fill="none" stroke="none" />
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="55" font-weight="800" fill="${strokeColor}"><textPath href="#curveTop" startOffset="50%" text-anchor="middle">SEOUL SUBWAY STAMP</textPath></text>
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="55" font-weight="800" fill="${strokeColor}"><textPath href="#curveBottom" startOffset="50%" text-anchor="middle">${stationName}역</textPath></text>
  <g stroke="${strokeColor}" stroke-width="12" fill="none" stroke-linejoin="round" stroke-linecap="round">
    ${innerSvgContent}
  </g>
</svg>`;

    // Try to extract a short description/story from comments
    let story = `${stationName}의 역사를 담은 AI 맞춤형 도장입니다.`;
    const commentMatch = generatedText.match(/<!--\s*story:\s*([\s\S]*?)\s*-->/);
    if (commentMatch) {
      story = commentMatch[1].trim();
    } else {
      const cleanText = generatedText.replace(/```[\s\S]*?```/g, "").trim();
      if (cleanText && cleanText.length > 10 && cleanText.length < 200) {
        story = cleanText.replace(/<!--[\s\S]*?-->/g, "").trim();
      }
    }

    return {
      svg: finalSvg,
      story: story
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
