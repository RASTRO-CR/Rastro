import sqlite3
from datetime import datetime, timezone

# DB_PATH = "data/data.db"

# def crear_tablas_si_no_existen():
#     conn = sqlite3.connect(DB_PATH, timeout=10)
#     c = conn.cursor()

#     c.execute('''
#         CREATE TABLE IF NOT EXISTS ciclistas (
#             id TEXT PRIMARY KEY,
#             nombre TEXT,
#             edad INTEGER,
#             equipo TEXT
#         )
#     ''')

#     c.execute('''
#         CREATE TABLE IF NOT EXISTS datos (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             ciclista_id TEXT,
#             timestamp TEXT,
#             lat REAL,
#             lng REAL,
#             spd REAL,
#             accel_x REAL,
#             accel_y REAL,
#             accel_z REAL,
#             gyro_x REAL,
#             gyro_y REAL,
#             gyro_z REAL,
#             FOREIGN KEY (ciclista_id) REFERENCES ciclistas(id)
#         )
#     ''')

#     conn.commit()
#     conn.close()

# def agregar_ciclista(ciclista_id, nombre, edad, equipo):
#     conn = sqlite3.connect(DB_PATH, timeout=10)
#     c = conn.cursor()
#     c.execute('INSERT OR IGNORE INTO ciclistas (id, nombre, edad, equipo) VALUES (?, ?, ?, ?)',
#               (ciclista_id, nombre, edad, equipo))
#     conn.commit()
#     conn.close()

# def insertar_datos(ciclista_id, lat, lng, spd, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z):
#     conn = sqlite3.connect(DB_PATH, timeout=10)
#     c = conn.cursor()
#     c.execute('''
#         INSERT INTO datos (
#             ciclista_id, timestamp, lat, lng, spd,
#             accel_x, accel_y, accel_z,
#             gyro_x, gyro_y, gyro_z
#         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#     ''', (
#         ciclista_id, datetime.now().isoformat(), lat, lng, spd,
#         accel_x, accel_y, accel_z,
#         gyro_x, gyro_y, gyro_z
#     ))
#     conn.commit()
#     conn.close()

# # def obtener_ultimo_dato(ciclista_id):
# #     conn = sqlite3.connect(DB_PATH, timeout=10)
# #     c = conn.cursor()
# #     c.execute('SELECT * FROM datos WHERE ciclista_id = ? ORDER BY timestamp DESC LIMIT 1', (ciclista_id,))
# #     row = c.fetchone()
# #     conn.close()
# #     return row

# def obtener_ultimo_dato(ciclista_id):
#     conn = sqlite3.connect(DB_PATH, timeout=10)
#     # --- LA LÍNEA CLAVE ---
#     # Esto le dice a SQLite que devuelva las filas como objetos que se pueden acceder por nombre de columna
#     conn.row_factory = sqlite3.Row 
    
#     c = conn.cursor()
#     c.execute('SELECT * FROM datos WHERE ciclista_id = ? ORDER BY timestamp DESC LIMIT 1', (ciclista_id,))
#     row = c.fetchone()
#     conn.close()

#     if row:
#         # Convertimos el objeto de fila a un diccionario estándar de Python
#         return dict(row)
#     return None

# def obtener_estadisticas(ciclista_id):
#     conn = sqlite3.connect(DB_PATH, timeout=10)
#     c = conn.cursor()
#     c.execute('''
#         SELECT AVG(spd),
#                AVG(accel_x), AVG(accel_y), AVG(accel_z),
#                AVG(gyro_x), AVG(gyro_y), AVG(gyro_z)
#         FROM datos WHERE ciclista_id = ?
#     ''', (ciclista_id,))
#     row = c.fetchone()
#     conn.close()
#     return row

# def obtener_todos_ciclistas():
#     conn = sqlite3.connect(DB_PATH, timeout=10)
#     c = conn.cursor()
#     c.execute('SELECT * FROM ciclistas')
#     rows = c.fetchall()
#     conn.close()
#     return rows

# def obtener_todos_ciclistas_con_ultima_posicion():
#     conn = sqlite3.connect(DB_PATH, timeout=10)
#     # Cambiamos la configuración de la fila para que devuelva diccionarios en lugar de tuplas
#     conn.row_factory = sqlite3.Row 
#     c = conn.cursor()

#     # Obtenemos todos los ciclistas
#     c.execute('SELECT id, nombre FROM ciclistas')
#     ciclistas = c.fetchall()

#     resultado_final = []
#     for ciclista in ciclistas:
#         # Para cada ciclista, buscamos su último dato de telemetría
#         c.execute('SELECT lat, lng FROM datos WHERE ciclista_id = ? ORDER BY timestamp DESC LIMIT 1', (ciclista['id'],))
#         ultimo_dato = c.fetchone()

#         ciclista_dict = dict(ciclista)
#         if ultimo_dato:
#             # Si encontramos datos, los añadimos al diccionario
#             ciclista_dict['lat'] = ultimo_dato['lat']
#             ciclista_dict['lng'] = ultimo_dato['lng']
#         else:
#             # Si un ciclista no tiene datos, le asignamos una ubicación por defecto o nula
#             ciclista_dict['lat'] = None
#             ciclista_dict['lng'] = None
        
#         resultado_final.append(ciclista_dict)

#     conn.close()
#     return resultado_final



#/////////////////////////////////////////////////////////////////////////////
#Nuevo

from database import db
from datetime import datetime

# =====================
# CICLISTAS
# =====================
async def agregar_ciclista(ciclista_id: str, nombre: str, edad: int, equipo: str):
    ciclista = {
        "id": ciclista_id,
        "nombre": nombre,
        "edad": edad,
        "equipo": equipo
    }
    # Solo insertar si no existe
    await db.ciclistas.update_one(
        {"id": ciclista_id},
        {"$setOnInsert": ciclista},
        upsert=True
    )
    return ciclista

async def obtener_ciclista(ciclista_id: str):
    return await db.ciclistas.find_one({"id": ciclista_id}, {"_id": 0})

async def listar_ciclistas():
    return await db.ciclistas.find({}, {"_id": 0}).to_list(100)


# =====================
# TELEMETRÍA
# =====================
async def insertar_datos(ciclista_id, lat, lng, spd, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, battery):
    dato = {
        "ciclista_id": ciclista_id,
        "lat": lat,
        "lng": lng,
        "spd": spd,
        "accel_x": accel_x,
        "accel_y": accel_y,
        "accel_z": accel_z,
        "gyro_x": gyro_x,
        "gyro_y": gyro_y,
        "gyro_z": gyro_z,
        "battery": battery,
    }
    print("datos insertados test:", dato)
    await db.telemetria.insert_one(dato)
    return dato

async def insertar_datos_telemetria(data: dict):
    await db.telemetria.insert_one(data)
    return data

async def obtener_ultimo_dato(ciclista_id: str):
    dato = await db.telemetria.find_one(
        {"ciclista_id": ciclista_id},
        sort=[("_id", -1)],
        projection={"_id": 0}
    )
    print("Último dato:", dato)
    return dato

async def obtener_datos_ciclista(ciclista_id: str, limit: int = 5):
    return await db.telemetria.find(
        {"ciclista_id": ciclista_id},
        {"_id": 0}
    ).sort("_id", -1).to_list(limit)


async def obtener_todos_ciclistas_con_ultima_posicion():
    ciclistas = await db.ciclistas.find({}, {"_id": 0}).to_list(100)
    result = []
    for c in ciclistas:
        ultimo = await db.telemetria.find_one(
            {"ciclista_id": c["id"]}, sort=[("timestamp", -1)], projection={"_id": 0}
        )
        if ultimo:
            c.update({
                "lat": ultimo.get("lat"),
                "lng": ultimo.get("lng"),
                "spd": ultimo.get("spd"),
                "timestamp": ultimo.get("timestamp"),
                "battery": ultimo.get("battery"),
            })
        result.append(c)
    return result

async def obtener_estadisticas(ciclista_id: str):
    pipeline = [
        {"$match": {"ciclista_id": ciclista_id}},
        {"$group": {
            "_id": "$ciclista_id",
            "spd_avg": {"$avg": "$spd"},
            "accel_x_avg": {"$avg": "$accel_x"},
            "accel_y_avg": {"$avg": "$accel_y"},
            "accel_z_avg": {"$avg": "$accel_z"},
            "gyro_x_avg": {"$avg": "$gyro_x"},
            "gyro_y_avg": {"$avg": "$gyro_y"},
            "gyro_z_avg": {"$avg": "$gyro_z"},
        }}
    ]
    result = await db.telemetria.aggregate(pipeline).to_list(1)
    return result[0] if result else {}


# =====================
# COMPETENCIAS
# =====================
async def crear_competencia(competencia: dict):
    await db.competencias.insert_one(competencia)
    return competencia

async def listar_competencias():
    return await db.competencias.find({}, {"_id": 0}).to_list(50)


# =====================
# ALERTAS
# =====================
async def crear_alerta(alerta: dict):
    await db.alertas.insert_one(alerta)
    return alerta

async def listar_alertas(ciclista_id: str = None):
    filtro = {"ciclista_id": ciclista_id} if ciclista_id else {}
    return await db.alertas.find(filtro, {"_id": 0}).sort("timestamp", -1).to_list(50)


# =====================
# RESÚMENES
# =====================
async def crear_resumen(resumen: dict):
    await db.resumenes.insert_one(resumen)
    return resumen

async def listar_resumenes(competencia_id: str):
    return await db.resumenes.find(
        {"competencia_id": competencia_id},
        {"_id": 0}
    ).sort("timestamp", -1).to_list(20)


