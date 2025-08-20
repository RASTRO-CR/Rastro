# Changelog

Todo el historial de cambios notables en el proyecto RASTRO será documentado en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-20 (Día de la Expo)

### Added
-   **Documentación Final:** Se completaron y pulieron todos los documentos del repositorio (`README.md`, `ARCHITECTURE.md`, `SETUP.md`) para la evaluación final.
-   **Pruebas de Campo:** Se realizó una prueba de campo final del sistema completo en un entorno exterior, validando la precisión del GPS, la transmisión de datos y la visualización en el dashboard.

### Changed
-   **Versión Estable:** Se marca esta versión como la `1.0.0`, representando el prototipo funcional completo presentado en la ExpoCenfo 2025.

## [0.9.0] - 2025-08-18

### Added
-   **Integración de Actuadores en Módulo CC:** Se implementó el control de un LED RGB y un Buzzer Activo en el Módulo CC para proporcionar feedback visual y sonoro de los estados del sistema (ej. recepción de paquete, alertas).
-   **Gestión de Energía Avanzada:** Se añadió la funcionalidad de "sueño profundo" (deep sleep) al Módulo CC, controlada por un botón externo para un encendido y apagado eficiente.
-   **Diseño de Carcasas (Case):** Se diseñaron e imprimieron en 3D las carcasas finales para el Módulo Corredor y el Módulo CC, cumpliendo con el requisito de fabricación digital.

## [0.8.0] - 2025-08-15 (Entrega Final)

### Added
-   **Frontend Completo:** Se fusionaron las vistas de Administrador y Pública en una sola aplicación con navegación. Se completó el panel de configuración de carrera, incluyendo la carga de archivos GPX.
-   **Backend (Análisis LLM):** Se implementó la lógica para construir prompts dinámicos y realizar llamadas a una API de LLM externa para generar análisis de carrera.
-   **Sistema de Alertas:** Se desarrolló el motor de alertas en el backend para detectar eventos como posibles caídas basadas en los datos del IMU.

## [0.7.0] - 2025-08-12

### Added
-   **Módulo CC (Hardware Oficial):** Se ensambló y validó el Módulo CC final utilizando la placa ESP32 Dev Kit, el módulo LoRa Waveshare y el circuito de alimentación autónomo (Batería LiPo + TP4056 + MT3608).
-   **Firmware Módulo CC (Oficial):** Se adaptó y refinó el firmware del receptor para el nuevo hardware, incluyendo la decodificación de paquetes binarios y la conversión a JSON para su envío al backend.

### Fixed
-   Se resolvieron problemas de `Error -2 (CHIP_NOT_FOUND)` en el Módulo CC oficial a través de un protocolo de diagnóstico de bajo nivel (Escáner SPI) que identificó una conexión física inestable como la causa raíz.

## [0.6.0] - 2025-08-08

### Added
-   **Fusión de Sensores (GPS + IMU):** Se integró exitosamente la lectura de datos del GPS (TinyGPS++) y del IMU (QMI8658) en un único firmware para el Módulo Corredor.
-   **Transmisión de Datos Binarios:** Se definió y se implementó una `struct` de C++ para empaquetar toda la telemetría en un paquete de datos binario y eficiente de 28 bytes.
-   **Visualización Completa en Dispositivo:** La pantalla OLED del Módulo Corredor ahora muestra datos en tiempo real de los satélites GPS y el estado del sistema.

## [0.5.0] - 2025-08-03 (Entrega de Primer Avance)

### Added
-   **Backend Funcional (API):** Se desarrolló la primera versión de la API en Python con FastAPI. Incluye endpoints para recibir datos (`/datos/`) y consultar la última posición (`/datos/{ciclista_id}`).
-   **Frontend (Mapa en Vivo):** Se creó la primera versión de la interfaz de usuario con React y TypeScript, capaz de conectarse a la API y "pintar" la ubicación y el rastro de un corredor en un mapa de Leaflet.

### Fixed
-   **Precisión del GPS:** Se diagnosticó y mitigó el desfase en las coordenadas GPS mediante un protocolo de calibración en un entorno de cielo abierto.
-   **Conectividad Backend-ESP32:** Se resolvieron los errores de conexión (`Error -1`) entre el Módulo CC y el backend, diagnosticando y configurando correctamente el Firewall de Windows.

## [0.4.0] - 2025-07-28

### Added
-   **Arranque de Hardware Estable:** Se logró el arranque consistente de las placas LILYGO T-Beam S3 Supreme después de un proceso de depuración intensivo.
-   **Comunicación LoRa Estable:** Se estableció una comunicación P2P fiable entre dos módulos LILYGO.
-   **Firmware Base:** Se crearon firmwares de transmisión y recepción usando `RadioLib` para validar la capa de radio.

### Changed
-   **Pivote de Estrategia de Desarrollo:** Se adoptó el **repositorio oficial de LilyGo** como entorno de desarrollo base para garantizar la compatibilidad del hardware.

### Fixed
-   **Error Crítico de Arranque:** Se solucionó el fallo que impedía que el firmware se ejecutara en las placas LILYGO al añadir la `build_flag` `-DARDUINO_USB_CDC_ON_BOOT=1` al `platformio.ini`.

## [0.2.0] - 2025-07-24

### Added
-   **Análisis de Arquitectura:** Se diseñó la arquitectura de hardware y software del MVP, incluyendo la selección de componentes y el flujo de datos.
-   **Estructura del Repositorio:** Se creó el repositorio en GitHub con la estructura profesional recomendada (`docs`, `hardware`, `software`, etc.).
-   **Documentación Inicial:** Se crearon los borradores de `README.md` y `ARCHITECTURE.md`.

## [0.1.0] - 2025-07-20

### Added
-   **Concepción del Proyecto:** Se definió la idea, los objetivos y el alcance del proyecto RASTRO.
-   **Análisis de Requisitos:** Se estudió la rúbrica y las reglas de la ExpoCenfo 2025 para alinear el desarrollo del proyecto con los criterios de evaluación.