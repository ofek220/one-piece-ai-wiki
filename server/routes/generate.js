import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import wikiPromptTemplate from "../prompts/wikiPrompt.js";

dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const prompt = wikiPromptTemplate.replace("${slug}", slug);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

export default router;
