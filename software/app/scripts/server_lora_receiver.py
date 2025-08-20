import requests
import time
import random

API_URL = "http://localhost:8000/datos/"

CICLISTAS = ["ciclista01", "ciclista02", "ciclista03"]

def generar_datos_fake():
    """
    Genera datos de simulación realistas para pruebas.
    """
    lat = 9.934 + random.uniform(-0.01, 0.01)
    lng = -84.087 + random.uniform(-0.01, 0.01)
    spd = random.uniform(0, 50)  # km/h
    accel_x = random.uniform(-2, 2)   # m/s^2 normales
    accel_y = random.uniform(-2, 2)
    accel_z = 9.8 + random.uniform(-0.5, 0.5)  # gravedad
    gyro_x = random.uniform(-100, 100)  # deg/s
    gyro_y = random.uniform(-100, 100)
    gyro_z = random.uniform(-100, 100)

    return {
        "lat": lat,
        "lng": lng,
        "spd": spd,
        "accel_x": accel_x,
        "accel_y": accel_y,
        "accel_z": accel_z,
        "gyro_x": gyro_x,
        "gyro_y": gyro_y,
        "gyro_z": gyro_z
    }

def enviar_datos(ciclista_id, data):
    """
    Envía los datos generados al backend FastAPI.
    """
    payload = {
        "ciclista_id": ciclista_id,
        **data
    }
    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            print(f"✅ Datos enviados correctamente para {ciclista_id}. Respuesta: {response.json()}")
        else:
            print(f"❌ Error al enviar datos: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

def main():
    """
    Envia datos de cada ciclista de forma continua cada 5 segundos.
    Simula condiciones reales de movimiento en carrera.
    """
    while True:
        for ciclista_id in CICLISTAS:
            data = generar_datos_fake()
            enviar_datos(ciclista_id, data)
        time.sleep(5)

if __name__ == "__main__":
    main()
