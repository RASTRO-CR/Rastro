// #include <Arduino.h>
// #include <WiFi.h>
// #include <HTTPClient.h>

// const char* ssid = "Wifi Montoya";
// const char* password = "8A8960WM59";
// const char* backendUrl = "http://192.168.100.60:8000/datos/";

// void setup() {
//   Serial.begin(115200);
//   delay(1000);

//   WiFi.mode(WIFI_STA);
//   WiFi.begin(ssid, password);
//   Serial.print("Conectando a WiFi...");
//   while (WiFi.status() != WL_CONNECTED) {
//     delay(1000);
//     Serial.print(".");
//   }
//   Serial.println("\nWiFi conectado");
// }

// void loop() {
//   if (WiFi.status() == WL_CONNECTED) {
//     HTTPClient http;
//     http.begin(backendUrl);
//     http.addHeader("Content-Type", "application/json");

//     String json = R"({
//       "ciclista_id": "ciclista123",
//       "lat": 10.001,
//       "lng": -84.123,
//       "spd": 12.4,
//       "accel_x": 0.02,
//       "accel_y": -0.01,
//       "accel_z": 0.98,
//       "gyro_x": 0.1,
//       "gyro_y": -0.1,
//       "gyro_z": 0.05
//     })";

//     int httpResponseCode = http.POST(json);
//     if (httpResponseCode > 0) {
//       String response = http.getString();
//       Serial.println("Respuesta del backend:");
//       Serial.println(response);
//     } else {
//       Serial.print("Error en la solicitud: ");
//       Serial.println(httpResponseCode);
//     }

//     http.end();
//   } else {
//     Serial.println("WiFi desconectado");
//   }

//   delay(5000);  // Esperar 5 segundos antes de enviar nuevamente
// }


#include <Arduino.h>
#include <RadioLib.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // <-- Incluimos la librería JSON

// --- Credenciales y Endpoints ---
const char* ssid = "Wifi Montoya";
const char* password = "8A8960WM59";
const char* backendUrl = "http://192.168.100.60:8000/datos/"; // Usa tu IP correcta

// --- Configuración de Hardware LoRa (Asegúrate que coincida con tu placa) ---
#define LORA_CS_PIN   10
#define LORA_DIO1_PIN 1
#define LORA_RST_PIN  5
#define LORA_BUSY_PIN 4
#define LORA_SCK_PIN  12
#define LORA_MISO_PIN 13
#define LORA_MOSI_PIN 11

SPIClass spi_lora(HSPI);
SX1262 radio = new Module(LORA_CS_PIN, LORA_DIO1_PIN, LORA_RST_PIN, LORA_BUSY_PIN, spi_lora);

// --- Definir el "molde" de datos (DEBE SER IDÉNTICO AL DEL MÓDULO CORREDOR) ---
struct RastroData {
  uint8_t ciclista_id;
  float lat;
  float lng;
  float spd;
  float accel_x;
  float accel_y;
  float accel_z;
  float gyro_x;
  float gyro_y;
  float gyro_z;
};

void setup() {
    Serial.begin(115200);
    while (!Serial && millis() < 2000); // Esperar por el monitor serie
    Serial.println("\n--- MÓDULO CC RASTRO v1.0 ---");

    // Conectar a Wi-Fi
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
    spi_lora.begin(LORA_SCK_PIN, LORA_MISO_PIN, LORA_MOSI_PIN, LORA_CS_PIN);
    int state = radio.begin(915.0, 125.0, 9, 7);
    if (state != RADIOLIB_ERR_NONE) {
        Serial.printf("Fallo al iniciar LoRa, código: %d\n", state);
        while (true);
    }
    
    Serial.println("¡Receptor listo! Escuchando paquetes...");
    radio.startReceive();
}

void loop() {
    // 1. Crear un "molde" vacío para recibir los datos
    RastroData dataPacket;

    // 2. Intentar leer los bytes entrantes y meterlos en el molde
    int state = radio.readData((uint8_t*)&dataPacket, sizeof(dataPacket));

    if (state == RADIOLIB_ERR_NONE) {
        Serial.printf("Paquete binario recibido de ciclista #%d\n", dataPacket.ciclista_id);
        Serial.printf("  Lat: %.4f, Lng: %.4f, Spd: %.2f\n", dataPacket.lat, dataPacket.lng, dataPacket.spd);

        // 3. Crear el documento JSON a partir del molde
        StaticJsonDocument<256> jsonDoc;
        // Usamos .set() para añadir los valores del struct al JSON.
        // ¡Las claves deben coincidir con lo que espera tu API en Python!
        jsonDoc["ciclista_id"] = "ciclista" + String(dataPacket.ciclista_id);
        jsonDoc["lat"] = dataPacket.lat;
        jsonDoc["lng"] = dataPacket.lng;
        jsonDoc["spd"] = dataPacket.spd;
        jsonDoc["accel_x"] = dataPacket.accel_x;
        jsonDoc["accel_y"] = dataPacket.accel_y;
        jsonDoc["accel_z"] = dataPacket.accel_z;
        jsonDoc["gyro_x"] = dataPacket.gyro_x;
        jsonDoc["gyro_y"] = dataPacket.gyro_y;
        jsonDoc["gyro_z"] = dataPacket.gyro_z;

        String jsonPayload;
        serializeJson(jsonDoc, jsonPayload); // Convertir el documento a un String

        Serial.println("Enviando JSON al backend:");
        Serial.println(jsonPayload);

        // 4. Enviar el JSON al servidor
        if (WiFi.status() == WL_CONNECTED) {
            HTTPClient http;
            http.begin(backendUrl);
            http.addHeader("Content-Type", "application/json");

            int httpResponseCode = http.POST(jsonPayload);

            if (httpResponseCode > 0) {
                Serial.printf("Respuesta del backend: %d\n", httpResponseCode);
                String response = http.getString();
                Serial.println(response);
            } else {
                Serial.printf("Error en la solicitud: %s\n", http.errorToString(httpResponseCode).c_str());
            }
            http.end();
        } else {
            Serial.println("WiFi desconectado");
        }

    } else if (state != RADIOLIB_ERR_RX_TIMEOUT) {
        // Ignoramos los timeouts (cuando no llega nada), pero mostramos otros errores.
        Serial.printf("Fallo al recibir, código: %d\n", state);
    }
}