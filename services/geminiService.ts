
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";
import { DEVELOPER } from "../constants";

export const getRobotResponse = async (
  prompt: string,
  userProfile: UserProfile,
  history: { role: 'user' | 'model'; text: string }[] = []
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const botName = userProfile.robotName || 'علي';
  
  // تعليمات صارمة لضبط "علي" ليكون مباشراً جداً ومتناغماً مع شعار AliTech الفخم وموقع المستخدم
  let instruction = `أنت "${botName}"، الرفيق الذكي لتطبيق 'صديقك المسلم' من تطوير ${DEVELOPER}.
قواعد الانضباط القصوى:
1. أنت تعلم أن المستخدم يتواجد حالياً في مدينة "${userProfile.location.city}" بدولة "${userProfile.nationality}". قدم نصائحك بخصوص أوقات الصلاة والطقس بناءً على هذا الموقع إذا لزم الأمر.
2. ممنوع الترحيب: بما أنك في محادثة مستمرة، ابدأ بالإجابة مباشرة. لا تقل "أهلاً" أو "مرحباً" أو "كيف حالك" أبداً إذا كان هناك سياق سابق.
3. الاختصار الإجباري: إجابتك يجب أن تكون (جملتين إلى 3 جمل كحد أقصى). ممنوع كتابة نصوص طويلة (جرائد).
4. التركيز الموضوعي: أجب فقط على السؤال المطروح. لا تقترح مواضيع جديدة ولا تفتح نقاشات جانبية.
5. الرسم التوضيحي الذكي: استخدم <drawing>SVG</drawing> فقط إذا طلب المستخدم شرحاً بصرياً (مثل "ارسم لي الكعبة" أو "كيف أتوضأ").
6. الهوية البصرية: أنت تمثل AliTech، لذا يجب أن تكون إجابتك بجودة عالية وفخامة في الأسلوب.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.slice(-6).map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: instruction,
        temperature: 0.3,
        topP: 0.8,
        topK: 40
      }
    });

    return response.text || "أسمعك، تفضل بسؤالك المباشر.";
  } catch (error) {
    return "عذراً، أحتاج لحظة للتركيز. أعد سؤالك باختصار.";
  }
};
