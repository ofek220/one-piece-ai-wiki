import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import categoriesAgentPrompt from "../helpers/categoriesAgentPrompt.js";
import itemsOfCategories from "../helpers/itemsOfCategories.js";
import pool from "../config/db.js";

dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//  Generate Categories
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
    res.status(500).json({ error: "Failed to generate categories" });
  }
});

// Generate Items of Categories
router.get("/itemsOfCategories/:slug", async (req, res) => {
  try {
    const { rows: categories } = await pool.query(
      "SELECT id, slug, name FROM categories"
    );
    const allResults = [];

    for (const category of categories) {
      console.log(`Generating items for ${category.name}...`);

      const prompt = itemsOfCategories.replace(/\$\{slug\}/g, category.name);

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.choices[0].message.content;

      const items = content
        .replace(/\d+\.\s*/g, "")
        .split(/\n/)
        .map((i) => i.trim())
        .filter(Boolean);

      for (const item of items) {
        const slug = item.toLowerCase().replace(/\s+/g, "-");
        await pool.query(
          `INSERT INTO category_items (category_id, slug, category_name)
           VALUES ($1, $2, $3)
           ON CONFLICT (slug) DO NOTHING`,
          [category.id, slug, item]
        );
      }

      allResults.push({ category: category.name, items });
    }

    res.json({ generated: allResults });
  } catch (error) {
    console.error("Error generating items:", error);
    res.status(500).json({ error: "Failed to generate items for categories" });
  }
});

export default router;
