import os
from together import Together

# Crea el cliente con tu API Key directamente
client = Together(api_key=os.getenv("TOGETHER_API_KEY"))

# Puedes cambiar de modelo según necesidad
MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"

def consultar_llm(prompt):
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "Eres un experto en análisis de datos de ciclismo competitivo en tiempo real."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error en LLM: {e}"