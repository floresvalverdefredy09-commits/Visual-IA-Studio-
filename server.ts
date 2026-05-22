import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini safely
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API endpoint for Motivation Generator
  app.post("/api/motivation", async (req, res) => {
    try {
      const { workoutType, streak, currentMood, coachStyle } = req.body;
      
      const prompt = `Actúa como un entrenador de fútbol elite personal y motivador deportivo especializado en entrenamiento de arquero y HIIT de alta intensidad.
      
Estilo del coach: ${coachStyle || 'Enérgico y Directo'}
Tipo de entrenamiento: ${workoutType || 'Hiit General'}
Racha actual del usuario: ${streak || 0} días
Ánimo del usuario: ${currentMood || 'cansado'}

Por favor, genera un mensaje de notificación motivacional épico con jerga de guardameta (arquero) o HIIT potente, un consejo técnico corto y un reto del día.
Debe ser súper enérgico, juvenil y estructurado.

Formato de respuesta: Devuelve únicamente un JSON válido con estas claves:
{
  "notification": "frase de notificación corta en una línea",
  "advice": "consejo técnico corto de menos de 18 palabras",
  "challenge": "el reto del día de menos de 12 palabras"
}

No uses markdown ni bloques de código redundantes, solo el objeto JSON plano. No metas texto adicional antes o después del JSON.`;

      if (!ai) {
        return res.json({
          notification: "¡Arriba arquero! ¡Es hora de volar al ángulo hoy mismo!",
          advice: "Mantén el centro de gravedad bajo para una reacción el doble de rápida.",
          challenge: "Haz 10 saltos explosivos extra al terminar el circuito."
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "";
      const parsed = JSON.parse(text.trim());
      res.json(parsed);
    } catch (error) {
      console.error("Error at motivation endpoint:", error);
      res.json({
        notification: "¡El entrenamiento no se detiene! ¡Supera tus límites, arquero!",
        advice: "Mantente enfocado en la trayectoria del balón y flexiona las rodillas hoy.",
        challenge: "Intenta batir tu racha y haz 5 burpees al terminar."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
