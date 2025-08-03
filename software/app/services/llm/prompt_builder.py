#Falta adaptar los prompts a un contexto más funcional, como tener un formato de datos por kilometros o similar.


def format_datos_tabla(datos_list):
    tabla = "timestamp,lat,lng,spd,accel_x,accel_y,accel_z\\n"
    for row in datos_list:
        tabla += f"{row['timestamp']},{row['lat']},{row['lng']},{row['speed']},{row['accel_x']},{row['accel_y']},{row['accel_z']}\\n"
    return tabla


def build_prediccion_prompt(ciclista_id, datos_list):
    datos = format_datos_tabla(datos_list)
    return f"""
Sos un asistente experto en análisis deportivo en tiempo real para competencias de ciclismo.

A continuación, se presentan los datos recopilados recientemente del ciclista con ID '{ciclista_id}' en formato CSV:

{datos}

📌 Descripción de las columnas:
- timestamp: marca de tiempo
- lat, lng: coordenadas GPS
- speed: velocidad en m/s
- accel_x, accel_y, accel_z: aceleraciones registradas por el sensor IMU

📋 Tu tarea:
1. Analizar los patrones de movimiento del ciclista.
2. Detectar si hay tendencia a mejorar o decaer.
3. Estimar el tiempo restante de llegada con base en el ritmo.
4. Identificar señales de cansancio, fatiga o riesgos.

⚠️ Instrucciones estrictas:
- Devuelve ÚNICAMENTE el siguiente JSON. No escribas nada más.
- No incluyas encabezados, explicaciones ni bloques de código.
- Empieza la respuesta directamente con una llave de apertura.
- Asegurate de que sea un JSON válido.

🔁 Devuelve la salida en el siguiente formato JSON:

{{
  "ciclista_id": "{ciclista_id}",
  "estado_actual": "descripción breve",
  "tendencia": "ascendente | descendente | estable",
  "riesgos_detectados": ["problema1", "problema2"],
  "tiempo_estimado_llegada": "hh:mm:ss",
  "comentario_tecnico": "análisis profesional en pocas frases"
}}
"""

def build_comparacion_prompt(c1, datos1, c2, datos2):
    tabla1 = format_datos_tabla(datos1)
    tabla2 = format_datos_tabla(datos2)

    return f"""
Eres un analista profesional de rendimiento competitivo en ciclismo.

Tienes los siguientes datos de dos ciclistas:

📍 Ciclista {c1}:
{tabla1}

📍 Ciclista {c2}:
{tabla2}

📋 Tu tarea:
- Comparar objetivamente su rendimiento reciente.
- Considerar velocidad sostenida, estabilidad, aceleraciones, etc.
- Determinar quién tiene mejor rendimiento y por qué.

⚠️ Instrucciones estrictas:
- Devuelve ÚNICAMENTE el siguiente JSON. No escribas nada más.
- No incluyas encabezados, explicaciones ni bloques de código.
- Empieza la respuesta directamente con una llave de apertura.
- Asegurate de que sea un JSON válido.

📤 Devuelve un JSON con esta estructura:

{{
  "comparacion": {{
    "mejor_rendimiento": "{c1} o {c2}",
    "factores_clave": ["factor1", "factor2"],
    "comentario_tecnico": "análisis breve"
  }}
}}
"""

def build_resumen_prompt(ciclista_id, datos_list):
    datos = format_datos_tabla(datos_list)
    return f"""
Eres un generador profesional de resúmenes deportivos para competencias de ciclismo.

A continuación tienes los datos del ciclista '{ciclista_id}':

{datos}

📋 Tareas:
- Identificar eventos relevantes (aceleración, frenado, cambios de ritmo).
- Evaluar su estado general en el periodo reciente.
- Redactar un resumen breve y técnico para el staff organizador.

⚠️ Instrucciones estrictas:
- Devuelve ÚNICAMENTE el siguiente JSON. No escribas nada más.
- No incluyas encabezados, explicaciones ni bloques de código.
- Empieza la respuesta directamente con una llave de apertura.
- Asegurate de que sea un JSON válido.

📤 Formato de salida esperado (JSON):

{{
  "ciclista_id": "{ciclista_id}",
  "estado_general": "bueno / regular / preocupante",
  "eventos_notables": ["evento1", "evento2"],
  "comentario_tecnico": "análisis profesional conciso"
}}
"""

def build_riesgo_prompt(ciclista_id, datos_list):
    datos = format_datos_tabla(datos_list)
    return f"""
Actuás como sistema inteligente de monitoreo de riesgos en ciclismo profesional.

Se te han entregado los últimos datos del ciclista con ID '{ciclista_id}' en formato CSV:

{datos}

📋 Objetivo:
- Detectar patrones anormales (frenado brusco, velocidad cero, oscilaciones anómalas).
- Evaluar si existe un riesgo físico o técnico.
- Recomendar una acción inmediata si aplica.

⚠️ Instrucciones estrictas:
- Devuelve ÚNICAMENTE el siguiente JSON. No escribas nada más.
- No incluyas encabezados, explicaciones ni bloques de código.
- Empieza la respuesta directamente con una llave de apertura.
- Asegurate de que sea un JSON válido.

📤 Devuelve un JSON con este formato:

{{
  "riesgo_detectado": true/false,
  "motivo": "explicación breve del riesgo",
  "acciones_recomendadas": ["acción1", "acción2"]
}}
"""