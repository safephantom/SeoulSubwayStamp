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
  const color = getLineColor(lineName);
  
  // Let's resolve the actual colors in hex to be safe when stored as static SVG strings in LocalStorage!
  const hexColors = {
    "1호선": "#0052A4",
    "2호선": "#00A84D",
    "3호선": "#EF7C1C",
    "4호선": "#00A2D1",
    "5호선": "#996CAC",
    "6호선": "#CD7C2F",
    "7호선": "#747F28",
    "8호선": "#E6186C",
    "9호선": "#BDB092",
    "수인분당선": "#F2A900",
    "신분당선": "#D4003B",
    "경의중앙선": "#77C4A3",
    "공항철도": "#0090D2",
    "경춘선": "#0C8E72",
    "우이신설선": "#B0C4DE",
    "신림선": "#6789CA",
    "김포골드라인": "#AD8600",
    "용인경전철": "#509F3D",
    "의정부경전철": "#FDA600",
    "경강선": "#0054A6",
    "서해선": "#81A914",
    "GTX-A": "#A17800",
    "인천1호선": "#7CA8D5",
    "인천2호선": "#FD8100",
  };
  
  const strokeColor = hexColors[lineName] || "#6366f1";
  
  // Draw a circular postmark stamp
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="46" fill="none" stroke="${strokeColor}" stroke-width="3" />
    <circle cx="50" cy="50" r="41" fill="none" stroke="${strokeColor}" stroke-width="1.2" stroke-dasharray="3 2" />
    <circle cx="50" cy="50" r="32" fill="none" stroke="${strokeColor}" stroke-width="1" />
    
    <!-- Central Subway Icon -->
    <path d="M42 42 H58 M42 48 H58 M44 38 L42 42 V54 L44 58 H56 L58 54 V42 L56 38 Z" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="46" cy="52" r="1.5" fill="${strokeColor}"/>
    <circle cx="54" cy="52" r="1.5" fill="${strokeColor}"/>
    <path d="M46 58 L44 63 M54 58 L56 63" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round"/>
    
    <!-- Station Text in Middle -->
    <rect x="20" y="62" width="60" height="10" rx="3" fill="#101118" stroke="${strokeColor}" stroke-width="1"/>
    <text x="50" y="69" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="800" fill="${strokeColor}" text-anchor="middle" letter-spacing="0.5">${stationName}</text>
    
    <!-- Outer Curved Text -->
    <path id="curveTop" d="M 18 50 A 32 32 0 0 1 82 50" fill="none" stroke="none" />
    <path id="curveBottom" d="M 82 50 A 32 32 0 0 1 18 50" fill="none" stroke="none" />
    
    <text font-family="'Plus Jakarta Sans', sans-serif" font-size="5.5" font-weight="600" fill="${strokeColor}">
      <textPath href="#curveTop" startOffset="50%" text-anchor="middle">${lineName}</textPath>
    </text>
    <text font-family="'Plus Jakarta Sans', sans-serif" font-size="5" font-weight="600" fill="${strokeColor}">
      <textPath href="#curveBottom" startOffset="50%" text-anchor="middle">${dateString}</textPath>
    </text>
  </svg>`;
};

// Direct Client-Side Call to Gemini API to generate custom SVG Stamp
export const generateGeminiAIStamp = async (apiKey, model = "gemini-2.5-flash", stationName, lineName) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const prompt = `지하철역 이름: ${stationName} (${lineName})
이 역의 역사, 문화, 주변 유명한 랜드마크, 혹은 지역적 특색을 상징하는 동그란 모양의 '클래식 지하철 도장(Stamp)'의 중앙에 들어갈 벡터 일러스트(Symbol)를 SVG 요소로 그려줘.

[시각적 스타일 요구사항 - 정교한 동판화 및 펜 선화 스타일]
1. **디테일한 묘사와 단순함 배제**: 
   - 단순한 원, 직사각형 한두 개로 구성된 성의 없는 디자인(어린이 그림 수준)은 절대 피해야 해.
   - 오래된 지폐나 클래식 동판화(copperplate print)에 들어가는 정교한 **세밀 라인 아트(Engraving / Fine Line Art)** 스타일로 그려줘.
   - 선으로만 그리는 것이 아니라, 기단이나 지붕, 상징물의 주요 단면에 색을 채워 시각적 무게감(면 분할)을 주고 싶다면 \`fill="black"\`을 적극적으로 사용해줘.
   - 선(Outline)만 표현할 영역은 \`fill="none" stroke="black"\`으로 지정하고, 색을 채울(Fill) 영역은 \`fill="black" stroke="none"\`(또는 stroke="black")으로 표현해줘.
   - (중요) 스타일 속성(\`style="..."\`)은 파싱 오류를 일으키므로 절대 사용하지 말고, \`stroke\`, \`fill\`, \`stroke-width\` 등 개별 속성을 직접 사용할 것.
2. **반복 생성 루프 방지**:
   - 디테일을 살리되, 빗금선(Hatching)을 무한히 그리는 반복 루프에 빠져 출력이 중간에 끊기지 않도록 해줘. 전체 패스(\`<path>\` 등) 개수는 최대 25~35개 내외로 조절하여 1,200토큰 이내로 간결하면서도 완성도 있게 표현해줘.
3. **구도 및 중앙 정렬**:
   - 뷰박스는 0 0 100 100 기준이야.
   - 일러스트의 모든 구성 요소는 중앙 (50, 50)을 기준으로 모여야 하며, 반경 22 이내의 보이지 않는 가상 원 영역 안에 꽉 차되 이를 절대 벗어나지 않도록 조밀하게 그려줘.
4. **반환할 SVG 태그**:
   - 최상위 <svg> 태그나 <style>, <metadata> 등은 절대 생성하지 마. 우리가 제공하는 고정 템플릿의 <g> 그룹 태그 안에 바로 삽입될 거야.
   - 오직 <path>, <circle>, <rect>, <line>, <polygon> 등 디자인을 구성하는 순수 도형 태그들만 반환해줘.

[출력 형식 및 스토리 요구사항]
1. 다른 설명 텍스트 없이 오직 마크다운 코드 블록(\`\`\`xml ... \`\`\`)으로 감싸서 생성된 도형 태그들만 출력해줘.
2. **스토리(Story) 규격**:
   - 도장의 맨 마지막 라인에 주석 형식으로 이 도장의 상징적 의미와 역의 스토리를 담아줘.
   - 예시: <!-- story: 성수역의 오랜 수제화 거리 역사와 장인정신을 클래식한 가죽 구두 실루엣으로 담아내고, 빈티지한 레드 잉크 레이아웃으로 도시의 산업 문화적 가치를 우아하게 표현한 도장입니다. -->
   - 위 예시처럼 역의 역사/문화적 가치와 도장 속 상징물의 의미를 엮어 품격 있는 2~3문장(100자 내외)으로 작성해줘.`;
  
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      topP: 0.95,
      maxOutputTokens: 8192
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error (${response.status})`);
    }

    const data = await response.json();
    console.log("Gemini API Full Response:", data);
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Gemini Raw Response Text:", generatedText);
    
    if (data.candidates?.[0]?.finishReason && data.candidates[0].finishReason !== "STOP") {
      console.warn("Gemini generation finished with non-STOP reason:", data.candidates[0].finishReason);
    }

    // Extract inside elements from XML markdown block
    let innerSvgContent = "";
    const blockStart = generatedText.indexOf("```xml");
    const blockEnd = generatedText.lastIndexOf("```");
    
    if (blockStart !== -1 && blockEnd !== -1 && blockEnd > blockStart) {
      innerSvgContent = generatedText.substring(blockStart + 6, blockEnd).trim();
    } else {
      const genericStart = generatedText.indexOf("```");
      const genericEnd = generatedText.lastIndexOf("```");
      if (genericStart !== -1 && genericEnd !== -1 && genericEnd > genericStart) {
        innerSvgContent = generatedText.substring(genericStart + 3, genericEnd).trim();
      } else {
        innerSvgContent = generatedText.trim();
      }
    }
    
    // Strip root <svg> tag if Gemini still generated it
    const lowerInner = innerSvgContent.toLowerCase();
    const svgOpenIdx = lowerInner.indexOf("<svg");
    if (svgOpenIdx !== -1) {
      const openTagEnd = innerSvgContent.indexOf(">", svgOpenIdx);
      const svgCloseIdx = lowerInner.lastIndexOf("</svg>");
      if (openTagEnd !== -1 && svgCloseIdx !== -1 && svgCloseIdx > openTagEnd) {
        innerSvgContent = innerSvgContent.substring(openTagEnd + 1, svgCloseIdx).trim();
      }
    }
    
    // Remove DOCTYPE or XML declarations
    innerSvgContent = innerSvgContent.replace(/<\?xml[\s\S]*?\?>/g, "");
    innerSvgContent = innerSvgContent.replace(/<!DOCTYPE[\s\S]*?>/g, "");
    
    // Parse line colors to combine inside the local template
    const hexColors = {
      "1호선": "#0052A4",
      "2호선": "#00A84D",
      "3호선": "#EF7C1C",
      "4호선": "#00A2D1",
      "5호선": "#996CAC",
      "6호선": "#CD7C2F",
      "7호선": "#747F28",
      "8호선": "#E6186C",
      "9호선": "#BDB092",
      "수인분당선": "#F2A900",
      "신분당선": "#D4003B",
      "경의중앙선": "#77C4A3",
      "공항철도": "#0090D2",
      "경춘선": "#0C8E72",
      "우이신설선": "#B0C4DE",
      "신림선": "#6789CA",
      "김포골드라인": "#AD8600",
      "용인경전철": "#509F3D",
      "의정부경전철": "#FDA600",
      "경강선": "#0054A6",
      "서해선": "#81A914",
      "GTX-A": "#A17800",
      "인천1호선": "#7CA8D5",
      "인천2호선": "#FD8100",
    };
    
    const strokeColor = hexColors[lineName] || "#6366f1";

    // Dynamic replacement: replace black/dark colors in AI code with the official line color
    innerSvgContent = innerSvgContent
      .replace(/stroke="black"/gi, `stroke="${strokeColor}"`)
      .replace(/stroke="#000000"/gi, `stroke="${strokeColor}"`)
      .replace(/stroke="#000"/gi, `stroke="${strokeColor}"`)
      .replace(/fill="black"/gi, `fill="${strokeColor}"`)
      .replace(/fill="#000000"/gi, `fill="${strokeColor}"`)
      .replace(/fill="#000"/gi, `fill="${strokeColor}"`);
    
    // Construct the ultimate hybrid SVG stamp
    const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Outer Borders -->
  <circle cx="50" cy="50" r="46" fill="none" stroke="${strokeColor}" stroke-width="2.5" />
  <circle cx="50" cy="50" r="41" fill="none" stroke="${strokeColor}" stroke-width="1" stroke-dasharray="2 1.5" />
  <circle cx="50" cy="50" r="30" fill="none" stroke="${strokeColor}" stroke-width="0.8" />
  
  <!-- Outer Curved Text -->
  <path id="curveTop" d="M 18 50 A 32 32 0 0 1 82 50" fill="none" stroke="none" />
  <path id="curveBottom" d="M 82 50 A 32 32 0 0 1 18 50" fill="none" stroke="none" />
  
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="5" font-weight="800" fill="${strokeColor}">
    <textPath href="#curveTop" startOffset="50%" text-anchor="middle">SEOUL SUBWAY STAMP</textPath>
  </text>
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="5.5" font-weight="800" fill="${strokeColor}">
    <textPath href="#curveBottom" startOffset="50%" text-anchor="middle">${stationName}역</textPath>
  </text>
  
  <!-- Central Symbol (AI Generated Engraving) -->
  <g stroke="${strokeColor}" stroke-width="1.2" fill="none" stroke-linejoin="round" stroke-linecap="round">
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
