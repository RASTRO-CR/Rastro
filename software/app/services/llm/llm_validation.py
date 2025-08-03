import json

def validar_llm_respuesta(raw_text: str, esquema_esperado: dict) -> tuple[bool, str | dict]:
    """
    Valida que la respuesta generada por el LLM sea un JSON válido y cumpla con un esquema mínimo.
    
    :param raw_text: Texto generado por el LLM
    :param esquema_esperado: Diccionario con las claves obligatorias que se esperan
    :return: (es_valido: bool, parsed_json | error)
    """
    try:
        parsed = json.loads(raw_text)

        # Verifica si faltan claves esperadas
        for clave in esquema_esperado:
            if clave not in parsed:
                return False, f"Falta la clave esperada: {clave}"

        return True, parsed

    except json.JSONDecodeError as e:
        return False, f"Respuesta no es JSON válido: {e}"
