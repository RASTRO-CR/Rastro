from models import obtener_ultimo_dato
from .llm_client import consultar_llm
from .llm_validation import validar_llm_respuesta
from .prompt_builder import (
    build_prediccion_prompt,
    build_comparacion_prompt,
    build_resumen_prompt,
    build_riesgo_prompt
)


esquema_prediccion = {
    "ciclista_id": str,
    "estado_actual": str,
    "tendencia": str,
    "riesgos_detectados": list,
    "tiempo_estimado_llegada": str,
    "comentario_tecnico": str
}

esquema_comparacion = {
    "comparacion": dict
}

esquema_riesgo = {
    "riesgo_detectado": bool,
    "motivo": str,
    "acciones_recomendadas": list
}

esquema_resumen = {
    "ciclista_id": str,
    "estado_general": str,
    "eventos_notables": list,
    "comentario_tecnico": str
}


def ejecutar_analisis_llm(prompt: str, esquema: dict):
    raw_response = consultar_llm(prompt)
    valido, resultado = validar_llm_respuesta(raw_response, esquema)
    if not valido:
        raise ValueError(f"Error en respuesta del LLM: {resultado}")
    return resultado

def analizar_prediccion(ciclista_id):
    datos = obtener_ultimo_dato(ciclista_id)
    prompt = build_prediccion_prompt(ciclista_id, datos)
    return ejecutar_analisis_llm(prompt, esquema_prediccion)

def analizar_comparacion(c1, c2):
    datos1 = obtener_ultimo_dato(c1)
    datos2 = obtener_ultimo_dato(c2)
    prompt = build_comparacion_prompt(c1, datos1, c2, datos2)
    return ejecutar_analisis_llm(prompt, esquema_comparacion)

def analizar_resumen(ciclista_id):
    datos = obtener_ultimo_dato(ciclista_id)
    prompt = build_resumen_prompt(ciclista_id, datos)
    return ejecutar_analisis_llm(prompt, esquema_resumen)

def analizar_riesgo(ciclista_id):
    datos = obtener_ultimo_dato(ciclista_id)
    prompt = build_riesgo_prompt(ciclista_id, datos)
    return ejecutar_analisis_llm(prompt, esquema_riesgo)
