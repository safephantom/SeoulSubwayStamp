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

[출력 요구사항]
1. 다른 텍스트나 설명 없이 오직 유효한 SVG 코드만 반환해야 하며, 마크다운 코드 블록(\`\`\`xml ... \`\`\`)으로 감싸서 출력해줘.
2. SVG 내부에는 다음 요소가 필수로 포함되어야 해:
   - 외부 테두리 (점선이나 이중 원으로 클래식한 아날로그 우체국 도장/스탬프 디자인)
   - 지하철역 이름 '${stationName}'과 호선 이름 '${lineName}' 텍스트 (곡선 가이드라인을 타는 텍스트 <textPath>나 반듯하게 배치된 <text>)
   - 중앙의 심볼 아이콘 (예: 성수역이면 수제화 구두 모양, 여의도역이면 63빌딩과 벚꽃, 동대문역이면 성곽 모양 등)을 SVG 도형패스(<path>, <circle>, <rect> 등)로 아기자기하고 디테일하게 묘사
3. 색상은 해당 호선의 상징색 또는 스탬프에 어울리는 색상 1~2개만 사용해서 잉크가 번지거나 찍힌 듯한 아날로그 빈티지 질감 느낌이 나도록 단색/투톤 스타일로 디자인해줘.
4. 반응형 뷰박스(viewBox="0 0 100 100")를 사용하고 가로세로 비율을 1:1로 유지해줘.
5. XML 선언 태그(<?xml ...?>)나 <!DOCTYPE ...> 태그는 웹 임베드 오류를 일으키므로 절대 포함하지 말아줘.
6. 이 도장의 상징과 테마에 대한 짧은 한 줄 설명(40자 내외)을 주석(예: <!-- story: 성수동 구두 골목의 역사와 장인 정신을 표현한 클래식 도장 -->) 형식으로 SVG 코드 맨 끝에 포함시켜줘.
7. SVG 코드의 크기가 과도하게 커져 생성 중간에 응답이 잘리지 않도록, 불필요하게 복잡하고 긴 패스 데이터(수천 자리의 d 속성 값 등)는 피하고 미니멀하고 아름답게 표현해줘.`;
  
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

