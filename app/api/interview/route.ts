import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { jobRole, experience, jobDescription } = body;

    //     const prompt = `
    // You are a senior technical interviewer.

    // Create 5 interview questions based on this candidate profile.

    // Role:
    // ${jobRole}

    // Experience:
    // ${experience}

    // Job Description:
    // ${jobDescription}

    // Rules:
    // - Generate exactly 5 questions.
    // - Match difficulty to experience level.
    // - Focus on technical skills and real-world scenarios.
    // - Keep answers short and practical.
    // - Return only valid JSON.

    // Format:
    // {
    //   "questions": [
    //     {
    //       "question": "",
    //       "answer": ""
    //     }
    //   ]
    // }
    // `;

    const InputPrompt = `${jobRole} role, where the candidate has ${experience} of experience and skills in ${jobDescription} depends upon the information please give me 5 interview questions with answered in JSON format , Give Quesion and Answer as field in json.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: InputPrompt,
            },
          ],
        },
      ],
    });


    return NextResponse.json({
      result: response.text,
    });

  } catch (error) {
    console.error("Error generating interview questions:", error);
    return NextResponse.json(
      {
        error: "Something went wrong"
      },
      {
        status: 500,
      }
    );
  }
}