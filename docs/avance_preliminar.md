# Avance Preliminar del Proyecto

## 1. Información del Proyecto
- **Nombre del Proyecto:** RASTRO  
- **Equipo y Roles:** 
  - Fabian: Hardware/Firmware, Frontend  
  - Sauddiel: Hardware/Firmware, Backend  

## 2. Descripción y Justificación
- **Problema que se aborda:**  
  Falta de sistemas asequibles para seguimiento en tiempo real en competencias deportivas locales, con capacidad de detectar accidentes y generar estadísticas predictivas.  
- **Importancia y contexto:**  
  Soluciona limitaciones de cobertura en zonas remotas (sin redes móviles) y reduce costos vs. sistemas profesionales. Combina IoT, LoRa y LLM para seguridad y análisis en vivo.  
- **Usuarios/beneficiarios:**  
  Atletas (seguimiento), organizadores (gestión de eventos), equipos médicos (alertas tempranas).  

## 3. Objetivos del Proyecto
- **Objetivo General:**  
  Desarrollar un sistema de seguimiento deportivo con comunicación LoRa, detección de accidentes, y predicción de métricas usando LLM.  
- **Objetivos Específicos:**  
  1. Transmitir ubicación/velocidad de corredores en tiempo real con módulos ESP32 + GPS + IMU.  
  2. Implementar algoritmo de detección de accidentes usando datos de los sensores.  
  3. Predecir tiempos de llegada y riesgos mediante LLM.  
  4. Visualizar datos en dashboard con React y mapas interactivos.  

## 4. Requisitos Iniciales
- **Lista breve de lo que el sistema debe lograr:**  
  - Capturar en tiempo real la ubicación (latitud y longitud) de cada competidor mediante GPS integrado en los módulos ESP32.  
  - Capturar los datos del componente IMU de cada competidor.
  - Transmitir los datos recopilados (posición, velocidad, aceleración, batería, etc.) a través de LoRa hacia un centro de control.
  - Recibir, decodificar y procesar los paquetes LoRa en el centro de control (ESP32 Gateway / Ideaboard), y reenviarlos como JSON al backend vía WiFi.
  - Crear la conexión con el proveedor de LLM mediante API, y realizar las consultas necesarias.
  - Implementar lógica de detección de eventos relevantes como caídas, frenazos o pérdida de señal GPS.
  - Permitir la visualización en tiempo real del estado y posición de los ciclistas a través de una interfaz web.
  - Garantizar un consumo energético eficiente durante toda la competencia.  

## 5. Diseño Preliminar del Sistema
- **Arquitectura inicial (diagrama):**  
  ```mermaid
   graph LR
    A[Módulo Corredor<br>ESP32 + GPS + LoRa] -->|LoRa - RadioLib| B[Centro de Control<br>IdeaBoard + LoRa]
    B --> |Http Request| C[Backend<br>Python + BD]
    C --> |API| D[LLM]
    C --> |FastAPi| E[Frontend<br>React + Mapas]
  ```
  
- **Componentes previstos:**  
  - Microcontrolador:  
    - Módulo Corredor: LILYGO T-Beam SUPREME (ESP32-S3).  
    - Módulo Centro de Control: IdeaBoard/ESP32 + Waveshare Módulo Core1262 HF LoRa.  
  - Sensores/actuadores:  
    - L76K GPS, LORA SX1262, IMU, antena LoRa 915Mhz.  
  - LLM/API: Together AI (LLama) para predicciones y análisis.  
  - Librerías y herramientas (C/C++):  
    - RadioLib
    - ArduinoJson
    - SPI
    - Wire
    - U8g2lib
    - XPowersLib

## 6. Plan de Trabajo
- **Cronograma preliminar:**  
  | Semana | Hitos |  
  |--------|-------|  
  | 18-25 jul | Definir stack técnico, conectar módulos LoRa. |  
  | 26 jul-1 ago | Lógica de alertas, primeros prompts LLM, GUI básica. |  
  | 2-8 ago | Implementar frontend, ajustar backend. |  
  | 9-15 ago | Pruebas integradas, entrega final (19 ago). |  

- **Riesgos identificados y mitigaciones:**  
  - **Riesgo 1:** Bateria insuficiente para cubrir toda la competencia.

    *Mitigación:* Optimizacion mediante el componente PMU.
  - **Riesgo 2:** Falsos positivos en detección de accidentes.  
    
    *Mitigación:* Calibrar/Mejorar prompts con estructura óptima.  

## 7. Prototipos conceptuales
- **Código mínimo de prueba:**  
  ```python
  from together import Together

    # Crea el cliente con tu API Key directamente
    client = Together(api_key="TuApiKeyAquí")  #Aquí iría la llave de API real

    # Puedes cambiar de modelo según necesidads
    MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"


    def consultar_llm(prompt):
        try:
            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": "Eres un experto en análisis de datos de ciclismo competitivo en tiempo real."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error en LLM: {e}"


    # Datos simulados
    datos_c1 = [
        {"timestamp": "2024-01-01T10:00:00", "lat": 9.93, "lng": -84.08, "speed": 32.1, "accel_x": 0.05, "accel_y": -0.01, "accel_z": 9.81},
        {"timestamp": "2024-01-01T10:00:10", "lat": 9.931, "lng": -84.081, "speed": 33.2, "accel_x": 0.04, "accel_y": -0.02, "accel_z": 9.80},
        {"timestamp": "2024-01-01T10:00:20", "lat": 9.932, "lng": -84.082, "speed": 31.8, "accel_x": 0.06, "accel_y": -0.01, "accel_z": 9.82}
    ]
    datos_c2 = [
        {"timestamp": "2024-01-01T10:00:00", "lat": 9.93, "lng": -84.08, "speed": 30.1, "accel_x": 0.03, "accel_y": -0.01, "accel_z": 9.75},
        {"timestamp": "2024-01-01T10:00:10", "lat": 9.931, "lng": -84.081, "speed": 29.8, "accel_x": 0.02, "accel_y": -0.01, "accel_z": 9.78},
        {"timestamp": "2024-01-01T10:00:20", "lat": 9.932, "lng": -84.082, "speed": 28.5, "accel_x": 0.01, "accel_y": -0.01, "accel_z": 9.74}
    ]

    # Esquemas
    esquemas = {
        "prediccion": {
            "ciclista_id": str,
            "estado_actual": str,
            "tendencia": str,
            "riesgos_detectados": list,
            "tiempo_estimado_llegada": str,
            "comentario_tecnico": str
        }

        # Aquí van los otros esquemas
    }

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

    ⚠ Instrucciones estrictas:
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

    # Función genérica para probar cada prompt
    def probar_prompt(nombre, prompt, esquema):
        print(f"\n--- 🔍 Probando {nombre.upper()} ---")
        print(prompt)
        print("\n🧠 Enviando prompt...")
        respuesta = consultar_llm(prompt)
        print("\n📩 Respuesta cruda del LLM:")
        print(respuesta)


    # Ejecutar pruebas
    probar_prompt("prediccion", build_prediccion_prompt("ciclista_001", datos_c1), esquemas["prediccion"])
  ```

