#include <Arduino.h>
#include <RadioLib.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- Credenciales y Endpoints ---
const char* ssid = "Wifi Montoya";
const char* password = "8A8960WM59";
const char* backendUrl = "http://192.168.100.60:8000/datos/";

// --- PINES ESP32 ---
#define LORA_CS_PIN   5
#define LORA_DIO1_PIN 4
#define LORA_RST_PIN  17
#define LORA_BUSY_PIN 16

// --- Pines LED RGB y Botón ---
#define RGB_R_PIN 32
#define RGB_G_PIN 33
#define RGB_B_PIN 25

// --- Simplificación del objeto de radio ---
SX1262 radio = new Module(LORA_CS_PIN, LORA_DIO1_PIN, LORA_RST_PIN, LORA_BUSY_PIN);


// --- Definir el "molde" de datos (DEBE SER IDÉNTICO AL DEL MÓDULO CORREDOR) ---
struct RastroData {
    uint32_t timestamp;   // 4 bytes
    int32_t latitude;     // 4 bytes
    int32_t longitude;    // 4 bytes
    uint16_t battery;  // 2 bytes
    uint16_t speed_cmps;  // 2 bytes
    uint8_t satellites;   // 1 byte
    uint8_t hdop_x10;     // 1 byte
    int16_t accel_x;      // 2 bytes
    int16_t accel_y;      // 2 bytes
    int16_t accel_z;      // 2 bytes
    int16_t gyro_x;       // 2 bytes
    int16_t gyro_y;       // 2 bytes
    int16_t gyro_z;       // 2 bytes
    uint8_t racer_id;    // 1 byte
    uint8_t flags;        // 1 byte
};

// --- Función para controlar el LED RGB ---
void setLedColor(int r, int g, int b) {
    ledcWrite(0, r); // Canal 0 para Rojo
    ledcWrite(1, g); // Canal 1 para Verde
    ledcWrite(2, b); // Canal 2 para Azul
}

void setup() {
    Serial.begin(115200);
    while (!Serial && millis() < 2000);
    Serial.println("\n--- MÓDULO CC RASTRO v1.5 ---");

    // --- Configuración de pines para LED y Botón ---
    ledcSetup(0, 5000, 8); // Canal 0, 5kHz, 8-bit de resolución
    ledcSetup(1, 5000, 8); // Canal 1
    ledcSetup(2, 5000, 8); // Canal 2
    ledcAttachPin(RGB_R_PIN, 0);
    ledcAttachPin(RGB_G_PIN, 1);
    ledcAttachPin(RGB_B_PIN, 2);

    // Conectar a Wi-Fi
    setLedColor(0, 0, 255); // LED azul mientras conecta
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

    // Inicializar LoRa
    int state = radio.begin(915.0, 125.0, 9, 7);
    if (state != RADIOLIB_ERR_NONE) {
        Serial.printf("Fallo al iniciar LoRa, código: %d\n", state);
        setLedColor(255, 0, 0); // LED rojo si hay error
        while (true);
    }
    
    Serial.println("¡Receptor listo! Escuchando paquetes...");
    radio.startReceive();
}

void loop() {
    // --- Efecto "Respiración" del LED para estado de espera ---
    float breath = (exp(sin(millis()/2000.0*PI)) - 0.36787944)*108.0;
    setLedColor(0, (int)breath, 0); // LED verde "respirando"

    RastroData dataPacket;

    int state = radio.readData((uint8_t*)&dataPacket, sizeof(dataPacket));

    if (state == RADIOLIB_ERR_NONE && dataPacket.racer_id == 1) {
        setLedColor(255, 255, 255); // Destello blanco al recibir
        Serial.printf("Paquete binario recibido de ciclista #%d\n", dataPacket.racer_id);

        // Convertimos a tipos legibles
        float lat = dataPacket.latitude / 1e7;
        float lng = dataPacket.longitude / 1e7;
        float speed = dataPacket.speed_cmps / 100.0;
        float hdop = dataPacket.hdop_x10 / 10.0;
        float accelX = dataPacket.accel_x / 1000.0;
        float accelY = dataPacket.accel_y / 1000.0;
        float accelZ = dataPacket.accel_z / 1000.0;
        float gyro_x = dataPacket.gyro_x / 1000.0;
        float gyro_y = dataPacket.gyro_y / 1000.0;
        float gyro_z = dataPacket.gyro_z / 1000.0;
        float battery = dataPacket.battery;

        // Serial debug opcional
        Serial.printf("  Lat: %.6f, Lng: %.6f, Vel: %.2f m/s\n", lat, lng, speed);

        // Crear JSON
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

        delay(100); // Pequeña pausa después del destello

    } else if (state != RADIOLIB_ERR_RX_TIMEOUT) {
        Serial.printf("Fallo al recibir, código: %d\n", state);
    }

    delay(1000);
}