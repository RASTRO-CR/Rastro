import models, llm_utils

ACCEL_UMBRAL = 15  # m/s², vibración muy alta
GYRO_UMBRAL = 300  # deg/s, inclinación peligrosa
VEL_CERO_TIEMPO = 10  # s

def verificar_alertas(ciclista_id):
    dato = models.obtener_ultimo_dato(ciclista_id)
    if dato is None:
        return None

    spd = dato[5]
    accel_x, accel_y, accel_z = dato[6], dato[7], dato[8]
    gyro_x, gyro_y, gyro_z = dato[9], dato[10], dato[11]

    if abs(accel_x) > ACCEL_UMBRAL or abs(accel_y) > ACCEL_UMBRAL or abs(accel_z) > ACCEL_UMBRAL:
        prompt = f"""
        Alerta de vibración excesiva detectada en el ciclista {ciclista_id}.
        Aceleraciones registradas: X={accel_x}, Y={accel_y}, Z={accel_z}.
        Analiza riesgos de accidente, problemas de terreno o mal funcionamiento y genera recomendaciones al staff.
        """
        return {"tipo": "Vibración Alta", "analisis": llm_utils.consultar_llm(prompt)}

    if abs(gyro_x) > GYRO_UMBRAL or abs(gyro_y) > GYRO_UMBRAL or abs(gyro_z) > GYRO_UMBRAL:
        prompt = f"""
        Alerta de inclinación peligrosa en el ciclista {ciclista_id}.
        Giroscopio: X={gyro_x}, Y={gyro_y}, Z={gyro_z}.
        Analiza posibles riesgos de caída en curvas o movimientos bruscos y genera recomendaciones.
        """
        return {"tipo": "Inclinación Peligrosa", "analisis": llm_utils.consultar_llm(prompt)}

    if spd < 0.5:
        prompt = f"""
        El ciclista {ciclista_id} se ha detenido.
        Verifica si existe riesgo de accidente, caída o parada de emergencia y genera recomendaciones al staff.
        """
        return {"tipo": "Parada Inesperada", "analisis": llm_utils.consultar_llm(prompt)}

    return None
