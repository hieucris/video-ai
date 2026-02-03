/**
 * AI Scene Generator Service
 * Uses Groq API to generate detailed scene descriptions for video generation
 */

interface GenerateScenesParams {
  prompt: string;
  sceneCount: number;
}

/**
 * Generate scene descriptions using Groq AI
 * @param params - Prompt and scene count
 * @returns Array of detailed scene descriptions
 */
export const generateScenes = async (params: GenerateScenesParams): Promise<string[]> => {
  const { prompt, sceneCount } = params;
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

  // If no API key, generate basic scenes locally
  if (!groqApiKey || groqApiKey === '') {
    return generateScenesLocally(prompt, sceneCount);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `
        Bạn là chuyên gia xây dựng kịch bản cho AI tạo video (Veo3).
        Nhiệm vụ của bạn là tạo ra các mô tả cảnh QUAY VIDEO chi tiết, dùng trực tiếp làm prompt cho hệ thống tạo video AI.
        
        QUY TẮC BẮT BUỘC:
        1. Mỗi cảnh phải mô tả rõ: góc máy (cận cảnh, trung cảnh, toàn cảnh), chuyển động camera, ánh sáng, nhịp điệu và không khí
        2. Mô tả theo hướng ĐỘNG (video), không mô tả ảnh tĩnh
        3. Các cảnh phải liên kết logic với nhau thành một mạch kể chuyện liền mạch
        4. Sử dụng thuật ngữ điện ảnh chuyên nghiệp
        5. Trả về CHÍNH XÁC ${sceneCount} cảnh, mỗi cảnh trên MỘT DÒNG
        6. Mỗi cảnh dài từ 2–4 câu, tập trung vào hình ảnh và chuyển động
        
        FORMAT TRẢ VỀ (BẮT BUỘC):
        Scene 1: [Mô tả chi tiết cảnh quay video]. LƯU Ý: KHÔNG CÓ VĂN BẢN HAY PHỤ ĐỀ XUẤT HIỆN TRÊN VIDEO.
        Scene 2: [Mô tả chi tiết cảnh quay video]. LƯU Ý: KHÔNG CÓ VĂN BẢN HAY PHỤ ĐỀ XUẤT HIỆN TRÊN VIDEO.
        ...`
          },
          {
            role: 'user',
            content: `Tạo ${sceneCount} cảnh video cho chủ đề: "${prompt}". Phong cách điện ảnh, chuyển động mượt, phù hợp để tạo video bằng Veo3.`
          }
        ],        
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', response.status, errorData);
      
      if (response.status === 401) {
        console.warn('⚠️ Groq API Key không hợp lệ. Sử dụng chế độ tạo cảnh cơ bản...');
        return generateScenesLocally(prompt, sceneCount);
      }
      
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      console.warn('⚠️ Không nhận được kết quả từ Groq AI. Sử dụng chế độ tạo cảnh cơ bản...');
      return generateScenesLocally(prompt, sceneCount);
    }

    // Parse the generated scenes
    const scenes = parseScenes(generatedText, sceneCount);
    
    console.log(`✅ Generated ${scenes.length} scenes using Groq AI`);
    return scenes;

  } catch (error) {
    console.error('❌ Error generating scenes with Groq AI:', error);
    console.warn('⚠️ Falling back to local scene generation...');
    return generateScenesLocally(prompt, sceneCount);
  }
};

/**
 * Parse scene text from AI response
 */
const parseScenes = (text: string, expectedCount: number): string[] => {
  // Try to extract scenes from the response
  const lines = text.split('\n').filter(line => line.trim());
  const scenes: string[] = [];

  for (const line of lines) {
    // Remove "Scene X:" prefix if exists
    const cleaned = line.replace(/^Scene\s+\d+:\s*/i, '').trim();
    if (cleaned) {
      scenes.push(cleaned);
    }
  }

  // If we got the expected number of scenes, return them
  if (scenes.length === expectedCount) {
    return scenes;
  }

  // If not enough scenes, split by double newlines or periods
  if (scenes.length === 1) {
    const splitScenes = scenes[0].split(/\.\s+LƯU Ý/).map((s, idx, arr) => {
      if (idx < arr.length - 1) {
        return s.trim() + '. LƯU Ý: KHÔNG CÓ VĂN BẢN HAY PHỤ ĐỀ XUẤT HIỆN TRÊN VIDEO.';
      }
      return s.trim();
    }).filter(s => s.length > 20);
    
    if (splitScenes.length >= expectedCount) {
      return splitScenes.slice(0, expectedCount);
    }
  }

  // Return what we have, or pad with basic scenes
  while (scenes.length < expectedCount) {
    scenes.push(`Cảnh ${scenes.length + 1}: Góc máy toàn cảnh, chất lượng cao, ánh sáng tự nhiên đẹp. LƯU Ý: KHÔNG CÓ VĂN BẢN HAY PHỤ ĐỀ XUẤT HIỆN TRÊN VIDEO.`);
  }

  return scenes.slice(0, expectedCount);
};

/**
 * Fallback: Generate scenes locally without AI
 */
const generateScenesLocally = (prompt: string, sceneCount: number): string[] => {
  const scenes: string[] = [];
  
  const cameraAngles = [
    'Góc máy cận cảnh từ dưới lên',
    'Góc máy toàn cảnh',
    'Góc máy ngang tầm mắt',
    'Góc máy từ trên xuống (bird eye view)',
    'Góc máy nghiêng động (dutch angle)',
    'Góc máy chuyển động theo chủ thể',
  ];

  const lighting = [
    'ánh nắng vàng ấm chiếu sáng tự nhiên',
    'ánh sáng mềm mại tạo bầu không khí dịu dàng',
    'ánh sáng tương phản mạnh tạo chiều sâu',
    'ánh sáng đẹp từ phía sau (backlight)',
    'ánh sáng vàng golden hour',
    'ánh sáng xanh blue hour',
  ];

  const movements = [
    'camera di chuyển mượt mà theo chủ thể',
    'zoom từ từ vào chi tiết quan trọng',
    'pan ngang theo chuyển động',
    'tilt lên từ từ tạo cảm giác hùng vĩ',
    'dolly in tạo cảm giác gần gũi',
    'chuyển động camera ổn định với gimbal',
  ];

  const atmosphere = [
    'không khí yên bình và thư giãn',
    'bầu không khí năng động và sôi nổi',
    'cảm giác bí ẩn và hấp dẫn',
    'tâm trạng vui vẻ và tươi sáng',
    'không khí trang nghiêm và chuyên nghiệp',
    'bầu không khí ấm áp và thân thiện',
  ];

  for (let i = 0; i < sceneCount; i++) {
    const angle = cameraAngles[i % cameraAngles.length];
    const light = lighting[i % lighting.length];
    const movement = movements[i % movements.length];
    const mood = atmosphere[i % atmosphere.length];

    const scene = `${angle}, tập trung vào ${prompt}, ${light} tạo nên ${mood}, ${movement}, chất lượng điện ảnh cao với chi tiết sắc nét và màu sắc rực rỡ. LƯU Ý: KHÔNG CÓ VĂN BẢN HAY PHỤ ĐỀ XUẤT HIỆN TRÊN VIDEO.`;
    
    scenes.push(scene);
  }

  console.log(`✅ Generated ${scenes.length} scenes locally (basic mode)`);
  return scenes;
};

