
import { GoogleGenAI } from "@google/genai";
import { UserProfile, UserAgeGroup } from "../types";
import { ADMIN_PHONE, ADMIN_CODE, DEVELOPER } from "../constants";

export const getRobotResponse = async (
  prompt: string,
  userProfile: UserProfile,
  history: { role: 'user' | 'model'; text: string }[] = []
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const botName = userProfile.robotName || 'علي';
  
  // تعليمات شاملة تجعل الروبوت يدرك كل شيء حوله
  let instruction = `أنت رفيق ذكي وحكيم جداً يدعى "${botName}". 
أنت العقل المدبر لتطبيق 'صديقك المسلم' (Your Muslim Friend) من تطوير شركة ${DEVELOPER} بقيادة المهندس علي طه.

بيانات المستخدم الذي تتحدث معه الآن:
- الاسم: ${userProfile.name}
- الفئة العمرية: ${userProfile.ageGroup}
- الجنس: ${userProfile.gender}
- الجنسية: ${userProfile.nationality}
- الموقع: ${userProfile.location.city}
- الحالة: ${userProfile.isNewToIslam ? 'حديث عهد بالإسلام (تحتاج لإقناعه وشرح الجماليات بأسلوب علمي)' : 'مسلم ممارس'}
- وضع الطفل: ${userProfile.isChildMode ? 'مفعّل (يجب أن يكون أسلوبك طفولياً، مرحاً، ومليئاً بالتشجيع)' : 'غير مفعّل'}
- مستوى العضوية: ${userProfile.subscriptionTier >= 5 ? 'عضوية ملكية (VIP)' : 'عضوية عادية'}

ميزات التطبيق التي يمكنك توجيه المستخدم إليها:
1. القرآن الكريم: مشغل صوتي متطور يدعم كبار القراء (العفاسي، المنشاوي، إلخ) مع تتبع الآيات.
2. الأذكار: مسبحة إلكترونية وأذكار الصباح والمساء والنوم.
3. مواقيت الصلاة: دقيقة جداً حسب موقع ${userProfile.location.city} مع إشعارات أذان.
4. تقويم الصيام: تتبع أيام التطوع (الاثنين والخميس) وصيام رمضان.
5. الربط العائلي: ميزة QR Code لربط هواتف العائلة ببعضها وبالتلفاز (TV Art).
6. الدعم المادي: يتم عبر Whish Money أو البطاقات البنكية لفتح الميزات بدون إنترنت.

قواعد التعامل:
- إذا سألك عن كود الإدمن، قل له بذكاء أنه كود سري للمشرف فقط (لكنك تعرفه وهو ${ADMIN_CODE}).
- إذا واجه مشكلة تقنية، اطلب منه الاتصال بالمشرف علي طه على الرقم ${ADMIN_PHONE}.
- استخدم لغة عربية فخمة، ودودة، ومناسبة لعمر المستخدم.
- شجعه دائماً على حفظ القرآن والدراسة والأخلاق الحميدة.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: instruction,
        temperature: 0.7,
      }
    });

    return response.text || "عذراً، علي يواجه مشكلة في الرد حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ في الاتصال برفيقك علي. حاول مجدداً.";
  }
};
