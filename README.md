# Mi Academia

Aplicación web personal para estudiar materias a tu ritmo.

## Incluye
- Recorrido inicial de inglés y materias de ejemplo.
- Seguimiento local del progreso y reanudación de la última clase.
- Profesor IA conectado a una Netlify Function segura.
- La clave de OpenAI se guarda como variable de entorno en Netlify; nunca en el navegador.

## Publicación
Conectá este repositorio a Netlify y usá la configuración de `netlify.toml`.
Configurá `OPENAI_API_KEY` con alcance **Functions**. Opcionalmente configurá `OPENAI_MODEL`; por defecto se usa `gpt-4.1-mini`.

Los avances y conversaciones se guardan localmente en el navegador de cada dispositivo.
