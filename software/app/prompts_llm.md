## Prompt 1: Análisis en Carrera (staff técnico)
Uso: Durante la competencia en intervalos de X km/min.

Actúa como analista técnico de ciclismo competitivo. Analiza los siguientes datos secuenciales de un ciclista para detectar tendencias, riesgos y generar predicciones:

Datos:
KM 1:
1) Velocidad: 35.2 km/h, FC: 152 bpm, Cadencia: 88 rpm
...
KM 3:
5) Velocidad: 33.0 km/h, FC: 167 bpm, Cadencia: 78 rpm

Instrucciones:
1) Indica tendencias en velocidad, FC y cadencia.
2) Señala posibles riesgos de fatiga o sobreesfuerzo.
3) Predice rendimiento para los próximos 5 km.
4) Da recomendaciones técnicas para el equipo de apoyo.

Responde de forma técnica, clara y concisa, en máximo 5 puntos.

## Prompt 2: Refinamiento a formato para Dashboard
Uso: Segunda capa si deseas refinar el resultado anterior.

Toma el siguiente análisis técnico y conviértelo en una lista de máximo 5 puntos, cada punto de máximo 2 líneas, claros y accionables para mostrar en un dashboard técnico de ciclismo.

[Pegue aquí el análisis generado por el primer prompt]

## Prompt 3: Resumen post-competencia (staff y reporte técnico)
Actúa como analista de ciclismo competitivo. Genera un resumen técnico del rendimiento del ciclista con estos datos:

- Velocidad promedio: 34.1 km/h
- FC promedio: 162 bpm
- Cadencia promedio: 83 rpm
- Ritmo en subida: 31.2 km/h
- Ritmo en llano: 35.5 km/h

Incluye:
1) Puntos fuertes.
2) Áreas de mejora.
3) Recomendaciones de entrenamiento específicas.

Usa markdown con secciones: ## Puntos Fuertes, ## Áreas de Mejora, ## Recomendaciones.

## Prompt 4: Comparación entre competidores
Actúa como analista técnico de ciclismo competitivo.

Compara estos dos ciclistas:

Juan:
- Velocidad: 34.5 km/h
- FC: 158 bpm
- Cadencia: 85 rpm

Ana:
- Velocidad: 33.9 km/h
- FC: 164 bpm
- Cadencia: 87 rpm

Analiza quién tiene mayor probabilidad de mantener o mejorar su rendimiento en los próximos 10 km y por qué.

Genera un análisis conciso en formato de tabla comparativa y conclusiones claras.

## Prompt 5: Generador de frases para transmisión en vivo
Genera 3 frases de máximo 2 líneas cada una para narración en vivo durante la competencia, que resuman de forma clara y atractiva el rendimiento del ciclista con estos datos:

- Velocidad promedio: 34.3 km/h
- FC: 161 bpm
- Cadencia: 83 rpm
- Último tramo con incremento de 0.5 km/h

Evita tecnicismos complejos, que sea entendible para el público general.

## Prompt 6: Conversión a JSON (opcional para dashboards)
Convierte este análisis en el siguiente formato JSON para ser interpretado automáticamente por un dashboard técnico:

{
  "tendencias": ["", "", ""],
  "riesgos": ["", ""],
  "predicciones": ["", ""],
  "recomendaciones": ["", ""]
}

[Pegue aquí el análisis generado]