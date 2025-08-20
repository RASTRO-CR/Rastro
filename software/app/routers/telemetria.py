from fastapi import APIRouter, HTTPException
from database import db
from schemas import TelemetriaBase
import models

router = APIRouter(prefix="/datos", tags=["Telemetría"])

# Recibir datos de telemetría
@router.post("/")
async def recibir_datos(data: dict):
    ciclista_id = data.get("ciclista_id")
    if not ciclista_id:
        raise HTTPException(status_code=400, detail="ciclista_id es requerido")

    print (data)
    print ("Data lat: ", data.get("lat"))
    # Crear ciclista si no existe
    ciclista = {
        "id": ciclista_id,
        "nombre": data.get("nombre", "Desconocido"),
        "edad": data.get("edad", 0),
        "equipo": data.get("equipo", "N/A")
    }

    print("Ciclista agregado test:", ciclista)
    await models.agregar_ciclista(ciclista_id,data.get("nombre", "Desconocido"),data.get("edad", 0),data.get("equipo", "N/A"))

    # Insertar telemetría
    dato = await models.insertar_datos(
        ciclista_id=ciclista_id,
        lat=data.get("lat"),
        lng=data.get("lng"),
        spd=data.get("spd"),
        accel_x=data.get("accel_x"),
        accel_y=data.get("accel_y"),
        accel_z=data.get("accel_z"),
        gyro_x=data.get("gyro_x"),
        gyro_y=data.get("gyro_y"),
        gyro_z=data.get("gyro_z"),
    )

    return {"status": "ok", "msg": "Datos recibidos y almacenados"}

# Obtener último dato de un ciclista
@router.get("/{ciclista_id}")
async def ultimo_dato(ciclista_id: str):
    dato = await models.obtener_ultimo_dato(ciclista_id)
    if dato:
        return {"dato": dato}
    else:
        raise HTTPException(status_code=404, detail="Ciclista no encontrado o sin datos")
    

@router.get("estadisticas/{ciclista_id}")
async def estadisticas(ciclista_id: str):
    stats = await models.obtener_estadisticas(ciclista_id)
    return {
        "ciclista_id": ciclista_id,
        "spd_avg": stats["spd_avg"],
        "accel_x_avg": stats["accel_x_avg"],
        "accel_y_avg": stats["accel_y_avg"],
        "accel_z_avg": stats["accel_z_avg"],
        "gyro_x_avg": stats["gyro_x_avg"],
        "gyro_y_avg": stats["gyro_y_avg"],
        "gyro_z_avg": stats["gyro_z_avg"],
    }
