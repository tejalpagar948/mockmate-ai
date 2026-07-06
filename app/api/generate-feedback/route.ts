import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { question, userAnswer } = await req.json();
        const prompt = `Question : ${question} , UserAnswer : ${userAnswer} , Depends on question and user answer please give us rating for answer and feedback as area of improvement in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        return NextResponse.json({ result: response.text });
    } catch (error) {
        console.error("Error generating feedback:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}