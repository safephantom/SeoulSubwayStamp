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
  
  // Clean color for inline svg presentation (since CSS variables don't always resolve inside img or some contexts,
  // we use standard hex mapping or inline style. Here we pass the variable directly which works if rendered as raw JSX/inline SVG)
  
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
이 역의 역사, 문화, 주변 유명한 랜드마크, 혹은 지역적 특색을 상징하는 동그란 모양의 '클래식 지하철 도장(Stamp)'의 SVG 코드를 작성해줘.

[시각적 구성 및 디자인 요구사항]
1. **클래식 스탬프 레이아웃**:
   - 외부 테두리: 두꺼운 외각 원(stroke-width: 2.5)과 안쪽의 얇은 점선 원(stroke-dasharray: 2 1.5)이 겹쳐진 이중 원 구조로 아날로그 스탬프 느낌을 극대화해줘.
   - 텍스트 배치: 상단 곡선에는 "SEOUL SUBWAY STAMP"를, 하단 곡선에는 "${stationName}역" 또는 영문 역명을 배치해줘. (<path id="textPath-top/bottom">와 <textPath> 요소를 활용하여 글자가 원형 테두리를 따라 예쁘게 흐르도록 구현할 것)
   - 중앙 심볼: 중앙 영역(50, 50)에 해당 역의 랜드마크나 상징물(예: 성수역은 정교한 수제화 구두, 경복궁역은 세련된 광화문/한옥 기와 실루엣 등)을 단순 원/네모가 아닌 여러 패스(<path>)의 조화로운 조합으로 정성스럽게 묘사해줘. 모든 중앙 심볼은 <g transform="translate(50, 50) scale(...)"> 등으로 묶어 크기와 위치를 중앙에 정확히 맞춰줘.
2. **색상 및 스타일**:
   - 해당 지하철 노선 상징색(${lineName}) 또는 스탬프 감성에 어울리는 단색(Monochrome) 또는 투톤(Two-tone)만 사용하여 아날로그 잉크 도장의 느낌을 살려줘.

[출력 형식 및 스토리 요구사항]
1. 다른 설명 텍스트 없이 오직 마크다운 코드 블록(\`\`\`xml ... \`\`\`)으로 감싼 SVG 코드만 출력해줘.
2. **스토리(Story) 예시 규격**:
   - 도장의 맨 마지막 라인에 주석 형식으로 이 도장의 상징적 의미와 역의 스토리를 담아줘.
   - 예시: <!-- story: 성수역의 오랜 수제화 거리 역사와 장인정신을 클래식한 가죽 구두 실루엣으로 담아내고, 빈티지한 레드 잉크 레이아웃으로 도시의 산업 문화적 가치를 우아하게 표현한 도장입니다. -->
   - 위 예시처럼 역의 역사/문화적 가치와 도장 속 상징물의 의미를 엮어 품격 있는 2~3문장(100자 내외)으로 작성해줘.
3. SVG 내부의 XML 선언(<?xml...?>)이나 <!DOCTYPE>은 절대 포함하지 말아줘.`;
  
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

    // Multi-fallback super robust SVG parsing
    let svgContent = "";
    const lowerText = generatedText.toLowerCase();
    const startIdx = lowerText.indexOf("<svg");
    const endIdx = lowerText.lastIndexOf("</svg>");

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      svgContent = generatedText.substring(startIdx, endIdx + 6);
      
      // Clean up markdown block wrappers if they got parsed inside
      svgContent = svgContent.replace(/```[a-zA-Z0-9]*/g, "").trim();
      
      // Trim any trailing/leading whitespaces
      const cleanStartIdx = svgContent.toLowerCase().indexOf("<svg");
      if (cleanStartIdx !== -1) {
        svgContent = svgContent.substring(cleanStartIdx);
      }
    } else {
      throw new Error("올바른 SVG 코드를 찾을 수 없습니다. API 응답을 확인하세요.");
    }

    // Try to extract a short description/story from comments
    let story = `${stationName}의 역사를 담은 AI 맞춤형 도장입니다.`;
    const commentMatch = generatedText.match(/<!--\s*story:\s*([\s\S]*?)\s*-->/);
    if (commentMatch) {
      story = commentMatch[1].trim();
    } else {
      // Fallback: Find any commentary text around the blocks
      const cleanText = generatedText.replace(/```[\s\S]*?```/g, "").trim();
      if (cleanText && cleanText.length > 10 && cleanText.length < 200) {
        story = cleanText.replace(/<!--[\s\S]*?-->/g, "").trim();
      }
    }

    return {
      svg: svgContent,
      story: story
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

