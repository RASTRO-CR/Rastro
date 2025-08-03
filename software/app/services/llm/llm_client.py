from together import Together

# Crea el cliente con tu API Key directamente
client = Together(api_key="b0bc9e204308622a15218f0fea7225304d106f7df146fff09eef905d8264b99a")

# Puedes cambiar de modelo según necesidad
MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"

#prompt = "Cuales las competencias de ciclismo más reconocidas a nivel mundial"

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

    

#result = consultar_llm(prompt)
#print(result)
