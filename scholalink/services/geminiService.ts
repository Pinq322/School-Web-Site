import { GoogleGenAI } from "@google/genai";
import { Grade, Student, Subject } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudentInsight = async (
  studentName: string,
  subjectName: string,
  grades: Grade[]
): Promise<string> => {
  try {
    const recentGrades = grades.slice(-5).map(g => `${g.type}: ${g.score}/${g.maxScore}`).join(', ');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analyze the performance of student ${studentName} in ${subjectName}.
        Here are their recent grades: ${recentGrades}.
        Provide a concise, encouraging, and constructive 3-sentence summary for the teacher or parent.
        Focus on trends and areas for improvement.
      `,
    });
    return response.text || "No insight available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI insights are currently unavailable.";
  }
};

export const generateLessonPlanIdea = async (subject: string, topic: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a creative 1-paragraph lesson hook for a ${subject} class about "${topic}". Make it engaging for teenagers.`
        });
        return response.text || "Could not generate lesson plan.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "AI suggestions unavailable.";
    }
}