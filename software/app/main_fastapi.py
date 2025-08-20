from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import analisis
import models, llm_utils, alert_engine
# from schemas import AnalisisRequest
import uvicorn
# from routers import ciclistas, competencias, telemetria, alertas, resumenes, analisis
from routers import ciclistas, competencias, telemetria

app = FastAPI(title="Ciclismo LLM Tracking", version="1.0")



# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(ciclistas.router)
app.include_router(competencias.router)
app.include_router(telemetria.router)
# app.include_router(alertas.router)
# app.include_router(resumenes.router)
app.include_router(analisis.router)   # aquí van tus endpoints de LLM

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Cambiar en producción
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.on_event("startup")
# async def startup_event():
#     models.crear_tablas_si_no_existen()

# @app.get("/")
# def root():
#     return {"status": "ok", "msg": "API funcionando correctamente."}

# @app.post("/datos/")
# async def recibir_datos(request: Request):
#     data = await request.json()
#     ciclista_id = data["ciclista_id"]
#     lat = data["lat"]
#     lng = data["lng"]
#     spd = data["spd"]
#     accel_x = data["accel_x"]
#     accel_y = data["accel_y"]
#     accel_z = data["accel_z"]
#     gyro_x = data["gyro_x"]
#     gyro_y = data["gyro_y"]
#     gyro_z = data["gyro_z"]

#     models.agregar_ciclista(ciclista_id, "Nombre", 0, "Equipo")
#     models.insertar_datos(ciclista_id, lat, lng, spd, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z)
#     # alerta = alert_engine.verificar_alertas(ciclista_id)

#     # return {"status": "ok", "alerta": alerta}
#     return {"status": "ok", "msg": "Datos recibidos y almacenados correctamente."}

# @app.get("/ciclistas/")
# def listar_ciclistas():
#     # return {"ciclistas": models.obtener_todos_ciclistas()}
#     # Usamos la nueva función que devuelve los datos completos
#     ciclistas_con_posicion = models.obtener_todos_ciclistas_con_ultima_posicion()
#     # ciclistas_con_posicion = models.obtener_ultimo_dato("ciclista1")
#     # Filtramos a los que no tengan ubicación para no enviar datos nulos
#     ciclistas_validos = [c for c in ciclistas_con_posicion if c.get('lat') is not None and c.get('lng') is not None]
#     return {"ciclistas": ciclistas_validos}
#     # return {"ciclistas": ciclistas_con_posicion}

# @app.get("/datos/{ciclista_id}")
# def ultimo_dato(ciclista_id: str):
#     dato = models.obtener_ultimo_dato(ciclista_id)
#     if dato:
#         return {"dato": dato}
#     else:
#         raise HTTPException(status_code=404, detail="Ciclista no encontrado o sin datos.")

# @app.get("/estadisticas/{ciclista_id}")
# def estadisticas(ciclista_id: str):
#     stats = models.obtener_estadisticas(ciclista_id)
#     return {
#         "ciclista_id": ciclista_id,
#         "spd_avg": stats[0],
#         "accel_x_avg": stats[1],
#         "accel_y_avg": stats[2],
#         "accel_z_avg": stats[3],
#         "gyro_x_avg": stats[4],
#         "gyro_y_avg": stats[5],
#         "gyro_z_avg": stats[6]
#     }

# @app.post("/analisis_llm/")
# async def analisis_llm(request: Request):
#     data = await request.json()
#     ciclista_id = data["ciclista_id"]
#     dato = models.obtener_ultimo_dato(ciclista_id)
#     stats = models.obtener_estadisticas(ciclista_id)

#     prompt = f"""
#     Realiza un análisis profesional del rendimiento del ciclista {ciclista_id}.
#     Últimos datos:
#     Lat={dato[3]}, Lng={dato[4]}, Velocidad={dato[5]},
#     Aceleración: X={dato[6]}, Y={dato[7]}, Z={dato[8]},
#     Giroscopio: X={dato[9]}, Y={dato[10]}, Z={dato[11]}.

#     Estadísticas promedio:
#     Velocidad={stats[0]}, Accel_X={stats[1]}, Accel_Y={stats[2]}, Accel_Z={stats[3]}, Gyro_X={stats[4]}, Gyro_Y={stats[5]}, Gyro_Z={stats[6]}.

#     Genera recomendaciones para el staff y observaciones relevantes.
#     """

#     analisis = llm_utils.consultar_llm(prompt)
#     return {"analisis": analisis}

# @app.post("/analisis_llm/")
# async def analisis_llm(data: AnalisisRequest):
#     try:
#         result = llm_utils.generar_analisis_llm(
#             ciclista_id=data.ciclista_id,
#             tipo_analisis=data.tipo_analisis,
#             comparar_con=data.comparar_con
#         )
#         return {"resultado": result}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main_fastapi:app", host="0.0.0.0", port=8000, reload=True)
