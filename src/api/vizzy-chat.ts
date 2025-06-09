
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const callGeminiAPI = async (message: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const prompt = `You are Vizzy, a friendly AI assistant for Simulix - an interactive web platform for data science and statistical mathematics visualizations. 

ABOUT SIMULIX:
Simulix is an educational platform that offers interactive visualizations for:
- Simulated Annealing (TSP & toy examples)
- Alias Method for discrete sampling
- Bootstrapping with statistical resampling
- Huber M-Estimator for robust statistics
- Importance Sampling for Monte Carlo methods
- Random Forest analysis and tree visualization
- Bias-Variance Tradeoff exploration
- Deep Reinforcement Learning visualization
- Neural Network training and visualization
- Low-Rank VAE with MM optimization

The platform is designed for students, educators, and beginners to explore applied statistical mathematics through hands-on, interactive experiences. Each visualization includes educational content, parameter controls, and real-time feedback.

PLATFORM FEATURES:
- Interactive parameter controls with real-time visualization updates
- Educational tabs with theory explanations and methodology
- Professional dark theme with blue gradients
- Responsive design for all devices
- Built-in feedback and contribution forms
- Modern React/TypeScript architecture

Your role is to:
1. Answer questions about data science, statistics, and machine learning concepts
2. Explain how the Simulix visualizations work
3. Help users understand the mathematical concepts behind the algorithms
4. Provide guidance on using the platform effectively
5. Be encouraging and educational in your responses

Keep responses concise, friendly, and educational. Use simple language when explaining complex concepts.

User question: ${message}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
};
