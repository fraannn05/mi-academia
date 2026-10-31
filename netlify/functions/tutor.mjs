export default async (request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Método no permitido" }, { status: 405 });
  }

  const apiKey = Netlify.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "Falta configurar OPENAI_API_KEY en Netlify." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
    const systemPrompt = [
      body.systemPrompt || "Sos un profesor personal experto y paciente. Enseñá paso a paso, adaptate al nivel del alumno, usá ejemplos y ejercicios, y corregí con amabilidad.",
      "Contexto de estudio:",
      "Materia: " + (body.subject || "Aprendizaje general"),
      "Nivel: " + (body.level || "A definir"),
      "Lección actual: " + (body.lesson || "Consulta libre"),
      "Contenido: " + (body.lessonContent || "Sin contenido específico"),
      "Progreso: " + JSON.stringify(body.progress || [])
    ].join("\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: Netlify.env.get("OPENAI_MODEL") || "gpt-4.1-mini",
        input: [{ role: "system", content: systemPrompt }, ...messages],
        store: false
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.error?.message || "Error al consultar el profesor IA." }, { status: response.status });
    }

    const reply = data.output_text || (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    return Response.json({ reply: reply || "No pude generar una respuesta. Probá de nuevo." });
  } catch (error) {
    return Response.json({ error: "No se pudo procesar la consulta." }, { status: 500 });
  }
};
