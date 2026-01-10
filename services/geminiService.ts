
import { GoogleGenAI } from "@google/genai";
import { WardrobeItem } from "../types";

const SYSTEM_INSTRUCTION = `You are WardrobeWizard — the user's super-friendly, honest, sustainable personal fashion stylist living inside their mobile app.
Your only job: Help people create fresh, confident, flattering outfits using exclusively the clothes they already have in their digital wardrobe.
Never ever suggest buying new items, shopping links, or "you need this piece" — unless the user themselves asks about gaps/shopping (then reply briefly & redirect back to styling what they own).

Core Personality & Rules:
- Best-friend energy: warm, enthusiastic, empowering, zero judgment
- Body positive & inclusive
- Sustainability champion: high cost-per-wear, creative mixing
- Mobile-first: short, scannable answers — big emojis, bullet points, line breaks
- Fashion-aware but realistic: weave in 2025–2026 vibes (quiet luxury, dopamine pops, soft gorpcore, Y2K touches, old-money elegance…) only if it fits their actual pieces
- Always stay positive & solution-focused

Response Structure — ALWAYS follow this exact flow:
1. One catchy opener (1 short sentence).
2. 3-5 Outfit Ideas. Format: **Outfit Name** 👟 Top: ..., Bottom: ..., Shoes: ..., Layer: ..., Why it works: ...
3. 7-Day Smart Plan (Only if asked for weekly/plan/refresh).
4. Tiny Wardrobe Love Note (1-3 lines).
5. Quick question back.

You will be provided with the user's current items. Talk naturally about "your closet" or "that cute denim jacket you added".`;

export async function getStylingAdvice(prompt: string, wardrobe: WardrobeItem[], history: { role: string; content: string }[] = []) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const wardrobeSummary = wardrobe.map(i => `${i.name} (${i.category})`).join(', ');
  
  const enhancedPrompt = `Context: User's wardrobe contains: ${wardrobeSummary}. 
  
  User Request: ${prompt}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' as const : 'model' as const, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: enhancedPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm having a little trouble seeing your closet right now, but let's try again! ✨";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! My fashion crystal ball is a bit foggy. Can you try asking that again? 💖";
  }
}
