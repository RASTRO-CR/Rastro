
#include <Arduino.h>
#include <RadioLib.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // <-- Incluimos la librería JSON

// --- Credenciales y Endpoints ---
const char* ssid = "Apart. Brisas del Este AP1";
const char* password = "monica789";
const char* backendUrl = "http://192.168.60.42:8000/datos/"; // Usa tu IP correcta

// --- PINES ESP32 ---
// --- PASO 1: Pines corregidos para tu montaje en Protoboard ---
#define LORA_CS_PIN   5
#define LORA_DIO1_PIN 4
#define LORA_RST_PIN  17
#define LORA_BUSY_PIN 16
// Los pines SPI (18, 19, 23) son manejados por defecto, no necesitamos definirlos.

// --- PASO 2: Simplificación del objeto de radio ---
// Ya no necesitamos un SPIClass personalizado. RadioLib usará el SPI por defecto.
SX1262 radio = new Module(LORA_CS_PIN, LORA_DIO1_PIN, LORA_RST_PIN, LORA_BUSY_PIN);


// --- Definir el "molde" de datos (DEBE SER IDÉNTICO AL DEL MÓDULO CORREDOR) ---
struct RastroData {
    uint32_t timestamp;   // 4 bytes
    int32_t latitude;     // 4 bytes
    int32_t longitude;    // 4 bytes
    uint16_t battery_mv;  // 2 bytes
    uint16_t speed_cmps;  // 2 bytes
    uint8_t satellites;   // 1 byte
    uint8_t hdop_x10;     // 1 byte
    int16_t accel_x;      // 2 bytes
    int16_t accel_y;      // 2 bytes
    int16_t accel_z;      // 2 bytes
    uint8_t racer_id;    // 1 byte
    uint8_t flags;        // 1 byte
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


    //  // --- LA SOLUCIÓN: RESET MANUAL DEL MÓDULO LORA ---
    // Serial.println("Realizando reset manual del módulo LoRa...");
    // pinMode(LORA_RST_PIN, OUTPUT);
    // digitalWrite(LORA_RST_PIN, LOW);
    // delay(10); // Pulso de reset corto
    // digitalWrite(LORA_RST_PIN, HIGH);
    // delay(10); // Pausa para que el chip se estabilice
    // Serial.println("Reset completado.");

    // Inicializar LoRa
    // spi_lora.begin(LORA_SCK_PIN, LORA_MISO_PIN, LORA_MOSI_PIN, LORA_CS_PIN);
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
        Serial.printf("Paquete binario recibido de ciclista #%d\n", dataPacket.racer_id);
        // Serial.printf("  Lat: %.4f, Lng: %.4f, Spd: %.2f\n", dataPacket.lat, dataPacket.lng, dataPacket.spd);

        // Convertimos a tipos legibles
        float lat = dataPacket.latitude / 1e7;
        float lng = dataPacket.longitude / 1e7;
        float speed = dataPacket.speed_cmps / 100.0;
        float hdop = dataPacket.hdop_x10 / 10.0;
        float accelX = dataPacket.accel_x / 1000.0;
        float accelY = dataPacket.accel_y / 1000.0;
        float accelZ = dataPacket.accel_z / 1000.0;
        float battery = dataPacket.battery_mv / 1000.0;
        float gyro_x = 0;        // 4 bytes
        float gyro_y = 0;        // 4 bytes
        float gyro_z = 0;      // 4 bytes
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
        // jsonDoc["battery"] = battery;
        // jsonDoc["hdop"] = hdop;
        // jsonDoc["satellites"] = dataPacket.satellites;
        // jsonDoc["timestamp"] = dataPacket.timestamp;
    

        // 3. Crear el documento JSON a partir del molde
        // StaticJsonDocument<256> jsonDoc;
        // // Usamos .set() para añadir los valores del struct al JSON.
        // // ¡Las claves deben coincidir con lo que espera tu API en Python!
        // jsonDoc["ciclista_id"] = "ciclista" + String(dataPacket.ciclista_id);
        // jsonDoc["lat"] = dataPacket.lat;
        // jsonDoc["lng"] = dataPacket.lng;
        // jsonDoc["spd"] = dataPacket.spd;
        // jsonDoc["accel_x"] = dataPacket.accel_x;
        // jsonDoc["accel_y"] = dataPacket.accel_y;
        // jsonDoc["accel_z"] = dataPacket.accel_z;
        // jsonDoc["gyro_x"] = dataPacket.gyro_x;
        // jsonDoc["gyro_y"] = dataPacket.gyro_y;
        // jsonDoc["gyro_z"] = dataPacket.gyro_z;

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
                // Serial.printf("Respuesta del backend: %d\n", httpResponseCode);
                // String response = http.getString();
                // Serial.println(response);
                Serial.println("Solicitud enviada correctamente.");
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






// #include <Arduino.h>
// #include <SPI.h>

// // --- Usamos los pines de tu montaje ---
// // Bus SPI por defecto (VSPI)
// #define SPI_CLK  18
// #define SPI_MISO 19
// #define SPI_MOSI 23
// #define LORA_CS  5 // Chip Select

// void setup() {
//   Serial.begin(115200);
//   while (!Serial && millis() < 2000);
//   Serial.println("\n--- INICIANDO ESCÁNER SPI PARA SX1262 ---");

//   // Configurar el pin Chip Select como salida
//   pinMode(LORA_CS, OUTPUT);
//   digitalWrite(LORA_CS, HIGH); // Mantenerlo inactivo (en alto)

//   // Iniciar el bus SPI con los pines por defecto
//   SPI.begin(SPI_CLK, SPI_MISO, SPI_MOSI, -1); // -1 para manejar CS manualmente

//   Serial.println("Bus SPI inicializado. Intentando comunicar con el chip...");
// }

// void loop() {
//   // Vamos a intentar leer un registro del SX1262.
//   // Usaremos el comando NOP (No Operation) que debería devolver el estado.
  
//   byte cmd = 0x80; // Comando NOP para SX1262
  
//   // 1. Activar el chip LoRa (poner CS en BAJO)
//   digitalWrite(LORA_CS, LOW);
  
//   // 2. Transferir el comando y recibir la respuesta
//   byte statusByte = SPI.transfer(cmd);
  
//   // 3. Desactivar el chip LoRa (poner CS en ALTO)
//   digitalWrite(LORA_CS, HIGH);

//   Serial.print("Comando 0x80 enviado. Respuesta recibida: 0x");
//   if (statusByte < 0x10) {
//     Serial.print("0"); // Añadir cero para formato
//   }
//   Serial.println(statusByte, HEX);

//   delay(2000); // Esperar 2 segundos
// }





// #include <Arduino.h>
// #include <RadioLib.h>
// #include <SPI.h> // Necesario para la configuración explícita de SPI

// // --- Pines para tu montaje en Protoboard ---
// #define LORA_CS_PIN   5
// #define LORA_DIO1_PIN 4
// #define LORA_RST_PIN  17
// #define LORA_BUSY_PIN 16
// #define SPI_CLK  18
// #define SPI_MISO 19
// #define SPI_MOSI 23

// // Usamos el SPI por defecto, pero lo configuraremos manualmente
// SX1262 radio = new Module(LORA_CS_PIN, LORA_DIO1_PIN, LORA_RST_PIN, LORA_BUSY_PIN);

// // --- Configuración SPI "Paranoica": 1MHz, Modo 0 ---
// // Esto es lento pero extremadamente fiable, ideal para protoboards.
// SPISettings spiSettings(1000000, MSBFIRST, SPI_MODE0);

// void setup() {
//     Serial.begin(115200);
//     while (!Serial && millis() < 2000);
//     Serial.println("\n--- MÓDULO CC RASTRO (Modo Paranoico) ---");

//     // --- Inicialización manual y explícita de SPI ---
//     SPI.begin(SPI_CLK, SPI_MISO, SPI_MOSI, -1);
//     Serial.println("Bus SPI inicializado manualmente.");

//     // --- Reset manual del módulo LoRa ---
//     Serial.println("Realizando reset manual del módulo LoRa...");
//     pinMode(LORA_RST_PIN, OUTPUT);
//     digitalWrite(LORA_RST_PIN, LOW);
//     delay(10);
//     digitalWrite(LORA_RST_PIN, HIGH);
//     delay(10);
//     Serial.println("Reset completado.");

//     // --- Inicialización de RadioLib con configuración SPI estable ---
//     Serial.println("Intentando iniciar RadioLib en modo estable...");
//     SPI.beginTransaction(spiSettings); // Aplicamos nuestra configuración lenta
    
//     int state = radio.begin(915.0, 125.0, 9, 7);
    
//     SPI.endTransaction(); // Liberamos el bus SPI
    
//     if (state != RADIOLIB_ERR_NONE) {
//         Serial.printf("Fallo al iniciar LoRa, código: %d\n", state);
//         while (true);
//     }
    
//     Serial.println("¡ÉXITO! ¡Receptor listo! Escuchando paquetes...");
//     radio.startReceive();
// }

// void loop() {
//     // El loop quedará en espera de paquetes, no necesitamos código aquí por ahora.
//     String str;
//     int state = radio.readData(str);
//     if (state == RADIOLIB_ERR_NONE) {
//         Serial.print("Paquete recibido: '");
//         Serial.print(str);
//         Serial.println("'");
//     }
// }





// FASE 1 PRUEBA DEL BUS SPI Secundario
// #include <Arduino.h>
// #include <SPI.h>

// // --- Pines para el bus HSPI ---
// #define HSPI_CLK  14
// #define HSPI_MISO 12
// #define HSPI_MOSI 13
// #define LORA_CS   15

// // Creamos un objeto para el segundo bus SPI del ESP32
// SPIClass hspi(HSPI);

// void setup() {
//   Serial.begin(115200);
//   while (!Serial && millis() < 2000);
//   Serial.println("\n--- DIAGNÓSTICO AVANZADO: Bus HSPI ---");

//   pinMode(LORA_CS, OUTPUT);
//   digitalWrite(LORA_CS, HIGH);

//   // Inicializamos el bus HSPI con sus pines específicos
//   hspi.begin(HSPI_CLK, HSPI_MISO, HSPI_MOSI, -1);
//   Serial.println("Bus HSPI inicializado.");
// }

// void loop() {
//   byte cmd = 0x80; // Comando NOP (No Operation) para SX1262
  
//   digitalWrite(LORA_CS, LOW);
//   byte statusByte = hspi.transfer(cmd); // Usamos hspi.transfer()
//   digitalWrite(LORA_CS, HIGH);

//   Serial.print("Comando 0x80 enviado vía HSPI. Respuesta: 0x");
//   if (statusByte < 0x10) Serial.print("0");
//   Serial.println(statusByte, HEX);

//   delay(2000);
// }

