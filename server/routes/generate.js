import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import categoriesAgentPrompt from "../helpers/categoriesAgentPrompt.js";
import itemsOfCategories from "../helpers/itemsOfCategories.js";
import pool from "../config/db.js";
dotenv.config();
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.get("/", async (req, res) => {
  try {
    const prompt = categoriesAgentPrompt;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content;

    const categories = content
      .replace(/\d+\.\s*/g, "")
      .split(/\n/)
      .map((c) => c.trim())
      .filter(Boolean);

    for (let name of categories) {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      await pool.query(
        `INSERT INTO categories (slug, name)
         VALUES ($1, $2)
         ON CONFLICT (slug) DO NOTHING`,
        [slug, name]
      );
    }

    res.json({ saved: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

router.get("/itemsOfCategories/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const prompt = itemsOfCategories.replace(/\$\{slug\}/g, slug);

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
