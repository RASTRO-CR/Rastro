# Guía de Instalación y Despliegue de RASTRO

Esta guía te permitirá configurar el entorno completo para el sistema RASTRO, desde el hardware hasta el software.

## 1. Hardware Requerido

### Módulo Corredor
* 1x Placa LILYGO T-Beam S3 Supreme
* 1x Batería LiPo 3.7V con conector JST

### Módulo de Centro de Control (CC)
* 1x Placa de desarrollo ESP32 (ej. ESP32 Dev Kit, CRCibernetica IdeaBoard)
* 1x Módulo LoRa Waveshare Core1262 (SX1262)
* 1x Antena LoRa de 915MHz con cable IPEX a SMA
* 1x Batería LiPo de 3.7V (ej. 5000mAh)
* 1x Módulo de carga LiPo TP4056
* 1x Módulo Boost Converter DC-DC MT3608
* 1x Protoboard y cables Jumper

### Diagrama de Conexiones (Módulo CC)

| Pin en ESP32 (Dev Kit) | Pin en Módulo LoRa (Waveshare) |
| :--- | :--- |
| `3V3` | `3V3` |
| `GND` | `GND` (todos los disponibles) |
| `GPIO18` | `CLK` |
| `GPIO23` | `MOSI` |
| `GPIO19` | `MISO` |
| `GPIO5` | `CS` |
| `GPIO17` | `RESET` |
| `GPIO16` | `BUSY` |
| `GPIO4` | `DIO1` |

## 2. Configuración del Firmware

1.  **Instala VS Code y la extensión PlatformIO IDE.**
2.  **Clona este repositorio:** `git clone https://github.com/your-repo`
3.  **Abre el Proyecto:** En VS Code, usa `File > Open Folder...` y abre la carpeta del repositorio clonado.
4.  **Para el Módulo Corredor:**
    * Abre el archivo `platformio.ini` en la raíz.
    * Asegúrate de que `src_dir` apunte al firmware del corredor (ej. `src_dir = software/firmware/corredor_modulo`).
    * Conecta la placa LILYGO, ponla en modo bootloader si es necesario, y haz clic en el botón "Upload" de PlatformIO.
5.  **Para el Módulo CC:**
    * Abre el archivo `platformio.ini` en la raíz.
    * Cambia `src_dir` para que apunte al firmware del CC (ej. `src_dir = software/firmware/cc_modulo`).
    * Conecta la placa ESP32 Dev Kit, ponla en modo bootloader, y haz clic en "Upload".

## 3. Configuración del Backend

1.  **Navega a la carpeta:** `cd software/backend`
2.  **Crea un entorno virtual:** `python -m venv venv`
3.  **Activa el entorno:**
    * Windows: `.\venv\Scripts\activate`
    * macOS/Linux: `source venv/bin/activate`
4.  **Instala las dependencias:** `pip install -r requirements.txt`
5.  **Ejecuta el servidor:** `python main.py`

## 4. Configuración del Frontend

1.  **Navega a la carpeta:** `cd software/frontend`
2.  **Instala las dependencias:** `npm install`
3.  **Configura la URL de la API:**
    * Crea un archivo llamado `.env` en la carpeta `frontend`.
    * Añade la siguiente línea, reemplazando la IP por la de tu PC donde corre el backend:
        `VITE_API_BASE_URL=http://192.168.100.60:8000`
4.  **Ejecuta la aplicación:** `npm run dev`
5.  Abre la URL que te proporciona la terminal en tu navegador.