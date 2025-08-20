/**
 * @file main.cpp
 * @author Fabian Miranda & Sauddiel Montoya
 * @brief Firmware para el Módulo de Centro de Control (CC) del proyecto RASTRO.
 * @version 1.5
 * @date 2025-08-20
 * * @copyright Copyright (c) 2025
 * * Este firmware se encarga de recibir paquetes de telemetría vía LoRa desde los
 * Módulos Corredor, decodificarlos, convertirlos a formato JSON y enviarlos a un
 * backend a través de Wi-Fi para su procesamiento y visualización.
 */

// ==========================================================================
// Inclusión de Librerías
// ==========================================================================
#include <Arduino.h>
#include <RadioLib.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ==========================================================================
// Constantes y Definiciones Globales
// ==========================================================================

// --- Credenciales y Endpoints ---
const char* ssid = "Wifi Montoya";
const char* password = "8A8960WM59";
const char* backendUrl = "http://192.168.100.60:8000/datos/";

// --- Definición de Pines de Hardware ---
// Pines para la comunicación SPI con el módulo LoRa SX1262.
#define LORA_CS_PIN   5
#define LORA_DIO1_PIN 4
#define LORA_RST_PIN  17
#define LORA_BUSY_PIN 16

// Pines para el control del indicador LED RGB.
#define RGB_R_PIN 32
#define RGB_G_PIN 33
#define RGB_B_PIN 25

// ==========================================================================
// Objetos Globales
// ==========================================================================

/**
 * @brief Objeto principal para la comunicación con el módulo de radio LoRa.
 * Se inicializa con los pines de control definidos previamente.
 * Utiliza el bus SPI por defecto del ESP32.
 */
SX1262 radio = new Module(LORA_CS_PIN, LORA_DIO1_PIN, LORA_RST_PIN, LORA_BUSY_PIN);

/**
 * @brief Estructura de datos para la telemetría.
 * Este "molde" define el formato binario de los paquetes enviados por LoRa.
 * Debe ser idéntico en el firmware del transmisor (Módulo Corredor) y
 * del receptor (Módulo CC) para asegurar una decodificación correcta.
 * El empaquetado de 1 byte (#pragma pack) asegura que no haya relleno entre
 * los miembros de la estructura, manteniendo un tamaño de paquete predecible.
 */
#pragma pack(push, 1)
struct RastroData {
    uint32_t timestamp;
    int32_t latitude;
    int32_t longitude;
    uint16_t battery;
    uint16_t speed_cmps;
    uint8_t satellites;
    uint8_t hdop_x10;
    int16_t accel_x;
    int16_t accel_y;
    int16_t accel_z;
    int16_t gyro_x;
    int16_t gyro_y;
    int16_t gyro_z;
    uint8_t racer_id;
    uint8_t flags;
};
#pragma pack(pop)

// ==========================================================================
// Funciones Auxiliares
// ==========================================================================

/**
 * @brief Controla el color del LED RGB.
 * Utiliza los canales PWM (LEDC) del ESP32 para permitir control de brillo.
 * * @param r Valor de 0 a 255 para el canal Rojo.
 * @param g Valor de 0 a 255 para el canal Verde.
 * @param b Valor de 0 a 255 para el canal Azul.
 */
void setLedColor(int r, int g, int b) {
    ledcWrite(0, r); // Canal 0 para Rojo
    ledcWrite(1, g); // Canal 1 para Verde
    ledcWrite(2, b); // Canal 2 para Azul
}

// ==========================================================================
// Función de Configuración Principal (Setup)
// ==========================================================================
void setup() {
    Serial.begin(115200);
    while (!Serial && millis() < 2000); // Esperar por el monitor serie
    Serial.println("\n--- MÓDULO CC RASTRO v1.5 ---");

    // --- Configuración del periférico LEDC para el control PWM del LED ---
    ledcSetup(0, 5000, 8); // Canal 0, frecuencia 5kHz, resolución de 8 bits
    ledcSetup(1, 5000, 8); // Canal 1
    ledcSetup(2, 5000, 8); // Canal 2
    ledcAttachPin(RGB_R_PIN, 0);
    ledcAttachPin(RGB_G_PIN, 1);
    ledcAttachPin(RGB_B_PIN, 2);

    // --- Conexión a la Red Wi-Fi ---
    setLedColor(0, 0, 255); // LED en azul para indicar "Conectando..."
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.print("Conectando a WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());

    // --- Inicialización del Módulo LoRa ---
    int state = radio.begin(915.0, 125.0, 9, 7);
    if (state != RADIOLIB_ERR_NONE) {
        Serial.printf("Fallo al iniciar LoRa, código: %d\n", state);
        setLedColor(255, 0, 0); // LED en rojo para indicar error crítico
        while (true);
    }
    
    Serial.println("¡Receptor listo! Escuchando paquetes...");
    radio.startReceive();
}

// ==========================================================================
// Bucle Principal (Loop)
// ==========================================================================
void loop() {
    // Efecto de "respiración" para el LED verde, indicando estado de espera.
    float breath = (exp(sin(millis()/2000.0*PI)) - 0.36787944)*108.0;
    setLedColor(0, (int)breath, 0);

    // Crear un objeto para almacenar los datos del paquete entrante.
    RastroData dataPacket;

    // Intentar leer un paquete de LoRa. readData es no bloqueante.
    int state = radio.readData((uint8_t*)&dataPacket, sizeof(dataPacket));

    // Si se recibe un paquete (state == RADIOLIB_ERR_NONE) Y es del corredor que nos interesa...
    if (state == RADIOLIB_ERR_NONE && dataPacket.racer_id == 1) {
        setLedColor(255, 255, 255); // Destello blanco para indicar recepción exitosa.
        Serial.printf("Paquete binario recibido de ciclista #%d\n", dataPacket.racer_id);

        // Convertir los datos binarios a unidades legibles (float).
        float lat = dataPacket.latitude / 1e7;
        float lng = dataPacket.longitude / 1e7;
        float speed = dataPacket.speed_cmps / 100.0;
        float accelX = dataPacket.accel_x / 1000.0;
        float accelY = dataPacket.accel_y / 1000.0;
        float accelZ = dataPacket.accel_z / 1000.0;
        float gyro_x = dataPacket.gyro_x / 1000.0;
        float gyro_y = dataPacket.gyro_y / 1000.0;
        float gyro_z = dataPacket.gyro_z / 1000.0;
        float battery = dataPacket.battery;

        // Crear el documento JSON para enviar al backend.
        StaticJsonDocument<256> jsonDoc;
        jsonDoc["ciclista_id"] = "ciclista" + String(dataPacket.racer_id);
        jsonDoc["lat"] = lat;
        jsonDoc["lng"] = lng;
        jsonDoc["spd"] = speed;
        jsonDoc["accel_x"] = accelX;
        jsonDoc["accel_y"] = accelY;
        jsonDoc["accel_z"] = accelZ;
        jsonDoc["gyro_x"] = gyro_x;
        jsonDoc["gyro_y"] = gyro_y;
        jsonDoc["gyro_z"] = gyro_z; 
        jsonDoc["battery"] = battery;
    
        String jsonPayload;
        serializeJson(jsonDoc, jsonPayload);
        Serial.println("Enviando JSON al backend:");
        Serial.println(jsonPayload);

        // Enviar los datos al backend vía HTTP POST si hay conexión Wi-Fi.
        if (WiFi.status() == WL_CONNECTED) {
            HTTPClient http;
            http.begin(backendUrl);
            http.addHeader("Content-Type", "application/json");
            int httpResponseCode = http.POST(jsonPayload);

            if (httpResponseCode > 0) {
                Serial.println("Solicitud enviada correctamente.");
            } else {
                Serial.printf("Error en la solicitud: %s\n", http.errorToString(httpResponseCode).c_str());
                setLedColor(255, 0, 0); // Rojo si falla el POST
                delay(1000); // Mantener el rojo por 1 segundo
            }
            http.end();
        } else {
            Serial.println("WiFi desconectado");
        }

        delay(100); // Pequeña pausa para que el destello blanco sea visible.

    } else if (state != RADIOLIB_ERR_RX_TIMEOUT) {
        // Ignorar timeouts (normal cuando no hay paquetes), pero reportar otros errores.
        Serial.printf("Fallo al recibir, código: %d\n", state);
    }

    delay(1000); // Pequeña pausa para no saturar el procesador.
}
