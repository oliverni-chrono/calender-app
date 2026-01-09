
import { GoogleGenAI, Type } from "@google/genai";
import { CelebrationIdea, GlobalHoliday } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCelebrationIdeas = async (holidayName: string): Promise<CelebrationIdea[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest 3 creative ways to celebrate or prepare for: ${holidayName}. Keep them short and inspiring.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["title", "description"],
          },
        },
      },
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { title: "Plan Ahead", description: "Create a list of activities you want to do." },
      { title: "Theme Night", description: "Host a small gathering with related food or music." },
      { title: "Capture Memories", description: "Get your camera ready for the special day." }
    ];
  }
};

export const getGlobalHolidays = async (country: string): Promise<GlobalHoliday[]> => {
  const currentYear = new Date().getFullYear();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a list of 5 major public holidays for ${country} in ${currentYear} or ${currentYear + 1}. Return the output in JSON format with fields: name, date (YYYY-MM-DD), description, and a single suitable emoji.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              date: { type: Type.STRING },
              description: { type: Type.STRING },
              emoji: { type: Type.STRING },
            },
            required: ["name", "date", "description", "emoji"],
          },
        },
      },
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Global Error:", error);
    return [];
  }
};
