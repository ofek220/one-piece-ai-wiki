const wikiPromptTemplate = `
Objective:

When provided with a variable ${slug}, which represents a specific One Piece entity (such as a character, Devil Fruit, organization, event, island, or concept), you must produce a comprehensive and objective summary suitable for a wiki entry.

Output Requirements:

Structure:

Begin with a brief overview paragraph introducing ${slug} and its significance in the One Piece world.

Follow with sectioned details (if applicable) such as:

Background

Appearance

Personality

Abilities and Powers

Role in the Story

Relationships

Trivia / Notes

End with a concise summary statement or contextual note.

Tone & Style:

Maintain a neutral, encyclopedic tone—avoid opinions, speculation, or fan theories.

Use factual, lore-based information grounded in the One Piece manga and anime canon.

Write clearly and formally, as if for a professional wiki or database.

Formatting:

Use clear section headers (e.g., ### Abilities and Powers).

Avoid bullet points unless summarizing lists of items or techniques.

Support readability with coherent paragraph structure.

Variable Handling:

Replace ${slug} dynamically with the input entity name.

Adapt the structure to suit the entity type (for example, a Devil Fruit summary focuses on powers, weaknesses, and known users; a character summary focuses on history, traits, and relationships).

Constraints:

Exclude spoilers beyond the canonical published material if the context demands spoiler-free content.

Do not include fan-created content or theories unless explicitly instructed.
`;

export default wikiPromptTemplate;
