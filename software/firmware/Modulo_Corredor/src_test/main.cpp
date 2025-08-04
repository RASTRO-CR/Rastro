#include <Arduino.h>
#include <RadioLib.h>

// --- Pines Correctos para LILYGO T-Beam S3 Supreme ---
#define LORA_CS_PIN   10
#define LORA_DIO1_PIN 1
#define LORA_RST_PIN  5
#define LORA_BUSY_PIN 4

#define LORA_SCK_PIN  12
#define LORA_MISO_PIN 13
#define LORA_MOSI_PIN 11

SPIClass spi_lora(HSPI);

SX1262 radio = new Module(LORA_CS_PIN, LORA_DIO1_PIN, LORA_RST_PIN, LORA_BUSY_PIN, spi_lora);
// --- PASO 1: Definir la estructura de datos binaria ---
// Esto es como un molde para nuestros datos.
struct RastroData {
  uint8_t ciclista_id; // 1 byte (podemos tener hasta 255 ciclistas)
  float lat;           // 4 bytes
  float lng;           // 4 bytes
  float spd;           // 4 bytes
  float accel_x;       // 4 bytes
  float accel_y;       // 4 bytes
  float accel_z;       // 4 bytes
  float gyro_x;        // 4 bytes
  float gyro_y;        // 4 bytes
  float gyro_z;        // 4 bytes
}; // Tamaño total: 1 + (9 * 4) = 37 bytes. ¡Perfecto para LoRa!
int counter = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando Transmisor LoRa (Módulo Corredor)...");

  spi_lora.begin(LORA_SCK_PIN, LORA_MISO_PIN, LORA_MOSI_PIN, LORA_CS_PIN);

  // --- LÍNEA MODIFICADA ---
  // Inicialización explícita de los parámetros de radio.
  // Frecuencia: 915.0 MHz
  // Ancho de Banda: 125.0 kHz
  // Factor de Propagación: 9
  // Tasa de Codificación: 7
  int state = radio.begin(915.0, 125.0, 9, 7);
  // -------------------------

  if (state != RADIOLIB_ERR_NONE) {
    Serial.print("Fallo al iniciar LoRa, código de error: ");
    Serial.println(state);
    while (true);
  }
  Serial.println("¡Transmisor listo!");
}

void loop() {
  // --- PASO 2: Crear y llenar la estructura de datos ---
  RastroData dataPacket;
  
  dataPacket.ciclista_id = 1; // ID del ciclista 1
  dataPacket.lat = 10.001 + (counter * 0.0001); // Datos de ejemplo que cambian
  dataPacket.lng = -84.123 + (counter * 0.0001);
  dataPacket.spd = 12.4;
  dataPacket.accel_x = 0.02;
  dataPacket.accel_y = -0.01;
  dataPacket.accel_z = 0.98;
  dataPacket.gyro_x = 0.1;
  dataPacket.gyro_y = -0.1;
  dataPacket.gyro_z = 0.05;

  Serial.print("Enviando paquete binario #");
  Serial.println(counter);

   // --- PASO 3: Transmitir la estructura como un bloque de bytes ---
  // Le decimos a RadioLib que tome el "molde" (dataPacket),
  // lo trate como una secuencia de bytes, y envíe tantos bytes como el tamaño del molde.
  int state = radio.transmit((uint8_t*)&dataPacket, sizeof(dataPacket));

  if (state == RADIOLIB_ERR_NONE) {
    Serial.println("¡Éxito!");
  } else {
    Serial.print("Fallo al enviar, código de error: ");
    Serial.println(state);
  }

  counter++;
  delay(5000);
}