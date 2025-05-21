import { GoogleGenAI, Type } from "@google/genai";
import { rubricPrompt } from "../lib/geminiApi.js";
import dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const gemini = async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ messsage: "User prompt is required" });
    }

    const prompt = rubricPrompt(userPrompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",

      contents: `Generate analytic rubric only ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              nullable: false,
              description: "Title of the rubric",
            },
            scoringScale: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: {
                    type: Type.STRING,
                    nullable: false,
                    description:
                      "Description of the scoring level (1-2 words only)",
                  },
                  score: {
                    type: Type.NUMBER,
                    nullable: false,
                    description: "Numeric score for this level",
                  },
                },
                required: ["description", "score"],
              },
            },
            criteriaArray: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criterion: {
                    type: Type.STRING,
                    nullable: false,
                    description: "Name of the criterion",
                  },
                  descriptor: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                    description:
                      "Descriptors for evaluating this criterion if theres a 4 scoringScale there should 4 descriptor in each criterion",
                  },
                },
                required: ["criterion", "descriptor"],
              },
            },
            total: {
              type: Type.NUMBER,
              nullable: false,
              description:
                "Total possible score for the rubric calculated based on the highest score scale multiply to total length of  criteriaArray",
            },
          },
          required: ["title", "scoringScale", "criteriaArray", "total"],
        },
      },
    });
    console.log("Im hit");
    const generatedRubric = await JSON.parse(response.text);

    res.status(200).json({ success: true, generatedRubric });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate questions", error: error.message });
  }
};
