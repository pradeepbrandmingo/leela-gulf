import { translateText, translateArray, translateProductPayload } from "../utils/translator.js";

/**
 * Controller for Real-Time Translation API
 */
export async function translateSingleOrBatch(req, res) {
  try {
    const { text, texts, payload, targetLang = "ar", sourceLang = "en" } = req.body;

    // 1. Translate complete product payload
    if (payload && typeof payload === "object") {
      const translatedPayload = await translateProductPayload(payload, targetLang);
      return res.status(200).json({
        success: true,
        data: translatedPayload,
      });
    }

    // 2. Translate array of texts
    if (Array.isArray(texts)) {
      const translatedTexts = await translateArray(texts, targetLang);
      return res.status(200).json({
        success: true,
        data: translatedTexts,
      });
    }

    // 3. Translate single text
    if (text) {
      const translated = await translateText(text, targetLang, sourceLang);
      return res.status(200).json({
        success: true,
        data: translated,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Please provide 'payload', 'texts', or 'text' to translate.",
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
