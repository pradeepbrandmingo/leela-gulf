import { translateText, translateArray, translateProductPayload } from "../utils/translator.js";

/**
 * Universal Controller for Real-Time Translation API (English <-> Arabic)
 * Supports single text, array of texts, and full object payloads (Blogs, Products, etc.)
 */
export async function translateSingleOrBatch(req, res) {
  try {
    const { text, texts, payload, data, targetLang = "ar", sourceLang = "en", from, to } = req.body;
    const finalTarget = targetLang || to || "ar";
    const finalSource = sourceLang || from || "en";
    const inputObj = payload || data;

    // 1. Translate complete object / dictionary (Blogs, Products, Forms)
    if (inputObj && typeof inputObj === "object" && !Array.isArray(inputObj)) {
      if (inputObj.applicationCards || inputObj.features) {
        const translatedProduct = await translateProductPayload(inputObj, finalTarget);
        return res.status(200).json({
          success: true,
          data: translatedProduct,
          translated: translatedProduct,
        });
      }

      // Generic key-value dictionary translation
      const translatedObj = {};
      for (const [key, val] of Object.entries(inputObj)) {
        if (typeof val === "string" && val.trim()) {
          translatedObj[key] = await translateText(val, finalTarget, finalSource);
        } else if (Array.isArray(val)) {
          translatedObj[key] = await translateArray(val, finalTarget, finalSource);
        } else {
          translatedObj[key] = val;
        }
      }

      return res.status(200).json({
        success: true,
        data: translatedObj,
        translated: translatedObj,
      });
    }

    // 2. Translate array of texts
    if (Array.isArray(texts)) {
      const translatedTexts = await translateArray(texts, finalTarget, finalSource);
      return res.status(200).json({
        success: true,
        data: translatedTexts,
        translated: translatedTexts,
      });
    }

    // 3. Translate single text
    if (text) {
      const translated = await translateText(text, finalTarget, finalSource);
      return res.status(200).json({
        success: true,
        data: translated,
        translated,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Please provide 'payload', 'data', 'texts', or 'text' to translate.",
    });
  } catch (error) {
    console.error("Translate Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Translation service encountered an error.",
      error: error.message,
    });
  }
}
