#include <Arduino.h>
#include "LoRaBoards.h"
#include <TinyGPS++.h>
#include "SensorQMI8658.hpp"
#include <MadgwickAHRS.h>

// --- Objetos Globales ---
SensorQMI8658 qmi;
TinyGPSPlus gps;
Madgwick filter;
SPIClass spi_lora(HSPI);
SX1262 radio = new Module(LORA_CS_PIN, LORA_DIO1_PIN, LORA_RST_PIN, LORA_BUSY_PIN, spi_lora);

// Variables para controlar la frecuencia de lectura del IMU
unsigned long microsPerReading, microsPrevious;

int counter = 0;

void setup()
{
    Serial.println("¡Transmisor listo!");
    setupBoards();

    if (!u8g2) {
        Serial.println("Fallo crítico: Pantalla no encontrada. Deteniendo.");
        while (1);
    }
    
    Serial.println("--- RASTRO: Fusión de Sensores GPS+IMU ---");
    u8g2->clearBuffer();
    u8g2->setFont(u8g2_font_ncenB10_tr);
    u8g2->drawStr(10, 38, "RASTRO v0.2");
    u8g2->sendBuffer();
    delay(1500);

    pinMode(SPI_CS, OUTPUT);
    digitalWrite(SPI_CS, HIGH);

    if (!qmi.begin(IMU_CS, -1, -1, -1, SDCardSPI)) {
        Serial.println("Fallo crítico: IMU QMI8658 no encontrado. Deteniendo.");
        u8g2->clearBuffer();
        u8g2->drawStr(0, 38, "IMU ERROR");
        u8g2->sendBuffer();
        while (1);
    }
    Serial.println("IMU QMI8658 inicializado.");
    
    qmi.configAccelerometer(SensorQMI8658::ACC_RANGE_8G, SensorQMI8658::ACC_ODR_1000Hz);
    qmi.configGyroscope(SensorQMI8658::GYR_RANGE_512DPS, SensorQMI8658::GYR_ODR_896_8Hz);
    
    qmi.enableGyroscope();
    qmi.enableAccelerometer();

// Inicializa Serial, PMU, I2C, Pantalla y el puerto serie del GPS.
    spi_lora.begin(LORA_SCK_PIN, LORA_MISO_PIN, LORA_MOSI_PIN, LORA_CS_PIN);
    int state = radio.begin(915.0, 125.0, 9, 7);
    if (state != RADIOLIB_ERR_NONE) {
        Serial.print("Fallo al iniciar LoRa, código de error: ");
        Serial.println(state);
        while (true);
    }

    // --- Inicialización del Filtro Madgwick ---
    filter.begin(100); // Frecuencia de actualización en Hz
    microsPerReading = 1000000 / 100;
    microsPrevious = micros();
    
    Serial.println("Sistema listo. Obteniendo datos...");
}

void loop()
{
    // --- LECTURA CONTINUA Y NO BLOQUEANTE DEL GPS ---
    while (SerialGPS.available() > 0) {
        gps.encode(SerialGPS.read());
    }

    // --- LECTURA DE ALTA FRECUENCIA DEL IMU Y FILTRO ---
    IMUdata acc, gyr;
    if (micros() - microsPrevious >= microsPerReading) {
        if (qmi.getDataReady()) {
            qmi.getAccelerometer(acc.x, acc.y, acc.z);
            qmi.getGyroscope(gyr.x, gyr.y, gyr.z);
            filter.updateIMU(gyr.x, gyr.y, gyr.z, acc.x, acc.y, acc.z);
        }
        microsPrevious += microsPerReading;
    }

    // --- ACTUALIZACIÓN DE PANTALLA Y SERIAL (a una frecuencia más baja) ---
    static uint32_t lastDisplay = 0;
    if (millis() - lastDisplay > 500) {
        lastDisplay = millis();
        
        float roll = filter.getRoll();
        float pitch = filter.getPitch();
        float yaw = filter.getYaw();

        char buffer[40];

        // Preparar datos de telemetría para LoRa
        RastroData data;
        data.timestamp = millis();
        data.latitude = gps.location.lat() * 1E7;  // Convert to 1E7 precision
        data.longitude = gps.location.lng() * 1E7; // Convert to 1E7 precision
        data.battery_mv = PMU->getBatteryPercent(); // Assuming getBatteryPercent returns 0-100%
        data.speed_cmps = gps.speed.kmph();
        data.satellites = gps.satellites.value();
        data.hdop_x10 = gps.hdop.hdop() * 10;
        data.accel_x = acc.x * 1000; // Convert to milli-g
        data.accel_y = acc.y * 1000; // Convert to milli-g
        data.accel_z = acc.z * 1000; // Convert to milli-g
        data.gyro_x = gyr.x * 1000; // Convert to milli-degrees/s
        data.gyro_y = gyr.y * 1000; // Convert to milli-degrees/s
        data.gyro_z = gyr.z * 1000; // Convert to milli-degrees/s
        data.racer_id = 2;  // Set racer ID
        data.flags = 0;      // Set flags

        // Imprimir en el Monitor Serie todos los datos de telemetría
        Serial.printf("GPS(Sats:%d, HDOP:%.1f, Lat:%.4f, Lng:%.4f, Speed:%.1fkm/h) | IMU(Yaw:%.1f, AccX:%.0f, AccY:%.0f, AccZ:%.0f) | BAT:%d%% | ID:%d | TS:%lu\n",
                      gps.satellites.value(), gps.hdop.hdop(),
                      gps.location.lat(), gps.location.lng(), gps.speed.kmph(),
                      yaw, acc.x, acc.y, acc.z,
                      PMU->getBatteryPercent(), data.racer_id, data.timestamp);

        // Imprimir en la Pantalla OLED
        u8g2->clearBuffer();
        u8g2->setFont(u8g2_font_profont12_tf);

        sprintf(buffer, "SAT:%d BAT:%d%%", gps.satellites.value(), PMU->getBatteryPercent());
        u8g2->drawStr(0, 12, buffer);

        sprintf(buffer, "LAT: %.4f", gps.location.lat());
        u8g2->drawStr(0, 28, buffer);

        sprintf(buffer, "LNG: %.4f", gps.location.lng());
        u8g2->drawStr(0, 44, buffer);

        sprintf(buffer, "SPD: %.2f", gps.speed.kmph());
        u8g2->drawStr(0, 60, buffer);

        u8g2->sendBuffer();

        Serial.print("Enviando paquete binario #");
        Serial.println(counter);

        int state = radio.transmit((uint8_t*)&data, sizeof(data));

        if (state == RADIOLIB_ERR_NONE) {
            Serial.println("¡Éxito!");
        } else {
            Serial.print("Fallo al enviar, código de error: ");
            Serial.println(state);
        }

        counter++;
    }
    
    delay(1000);
}