import sqlite3
from datetime import datetime

DB_PATH = "data/data.db"

def crear_tablas_si_no_existen():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS ciclistas (
            id TEXT PRIMARY KEY,
            nombre TEXT,
            edad INTEGER,
            equipo TEXT
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS datos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ciclista_id TEXT,
            timestamp TEXT,
            lat REAL,
            lng REAL,
            spd REAL,
            accel_x REAL,
            accel_y REAL,
            accel_z REAL,
            gyro_x REAL,
            gyro_y REAL,
            gyro_z REAL,
            FOREIGN KEY (ciclista_id) REFERENCES ciclistas(id)
        )
    ''')

    conn.commit()
    conn.close()

def agregar_ciclista(ciclista_id, nombre, edad, equipo):
    conn = sqlite3.connect(DB_PATH, timeout=10)
    c = conn.cursor()
    c.execute('INSERT OR IGNORE INTO ciclistas (id, nombre, edad, equipo) VALUES (?, ?, ?, ?)',
              (ciclista_id, nombre, edad, equipo))
    conn.commit()
    conn.close()

def insertar_datos(ciclista_id, lat, lng, spd, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z):
    conn = sqlite3.connect(DB_PATH, timeout=10)
    c = conn.cursor()
    c.execute('''
        INSERT INTO datos (
            ciclista_id, timestamp, lat, lng, spd,
            accel_x, accel_y, accel_z,
            gyro_x, gyro_y, gyro_z
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        ciclista_id, datetime.now().isoformat(), lat, lng, spd,
        accel_x, accel_y, accel_z,
        gyro_x, gyro_y, gyro_z
    ))
    conn.commit()
    conn.close()

# def obtener_ultimo_dato(ciclista_id):
#     conn = sqlite3.connect(DB_PATH, timeout=10)
#     c = conn.cursor()
#     c.execute('SELECT * FROM datos WHERE ciclista_id = ? ORDER BY timestamp DESC LIMIT 1', (ciclista_id,))
#     row = c.fetchone()
#     conn.close()
#     return row

def obtener_ultimo_dato(ciclista_id):
    conn = sqlite3.connect(DB_PATH, timeout=10)
    # --- LA LÍNEA CLAVE ---
    # Esto le dice a SQLite que devuelva las filas como objetos que se pueden acceder por nombre de columna
    conn.row_factory = sqlite3.Row 
    
    c = conn.cursor()
    c.execute('SELECT * FROM datos WHERE ciclista_id = ? ORDER BY timestamp DESC LIMIT 1', (ciclista_id,))
    row = c.fetchone()
    conn.close()

    if row:
        # Convertimos el objeto de fila a un diccionario estándar de Python
        return dict(row)
    return None

def obtener_estadisticas(ciclista_id):
    conn = sqlite3.connect(DB_PATH, timeout=10)
    c = conn.cursor()
    c.execute('''
        SELECT AVG(spd),
               AVG(accel_x), AVG(accel_y), AVG(accel_z),
               AVG(gyro_x), AVG(gyro_y), AVG(gyro_z)
        FROM datos WHERE ciclista_id = ?
    ''', (ciclista_id,))
    row = c.fetchone()
    conn.close()
    return row

def obtener_todos_ciclistas():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    c = conn.cursor()
    c.execute('SELECT * FROM ciclistas')
    rows = c.fetchall()
    conn.close()
    return rows

def obtener_todos_ciclistas_con_ultima_posicion():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    # Cambiamos la configuración de la fila para que devuelva diccionarios en lugar de tuplas
    conn.row_factory = sqlite3.Row 
    c = conn.cursor()

    # Obtenemos todos los ciclistas
    c.execute('SELECT id, nombre FROM ciclistas')
    ciclistas = c.fetchall()

    resultado_final = []
    for ciclista in ciclistas:
        # Para cada ciclista, buscamos su último dato de telemetría
        c.execute('SELECT lat, lng FROM datos WHERE ciclista_id = ? ORDER BY timestamp DESC LIMIT 1', (ciclista['id'],))
        ultimo_dato = c.fetchone()

        ciclista_dict = dict(ciclista)
        if ultimo_dato:
            # Si encontramos datos, los añadimos al diccionario
            ciclista_dict['lat'] = ultimo_dato['lat']
            ciclista_dict['lng'] = ultimo_dato['lng']
        else:
            # Si un ciclista no tiene datos, le asignamos una ubicación por defecto o nula
            ciclista_dict['lat'] = None
            ciclista_dict['lng'] = None
        
        resultado_final.append(ciclista_dict)

    conn.close()
    return resultado_final