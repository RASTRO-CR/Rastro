/**
 *
 * @license MIT License
 *
 * Copyright (c) 2022 lewis he
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @file      QMI8658_MadgwickAHRS.ino
 * @author    Lewis He (lewishe@outlook.com)
 * @date      2022-10-16
 *
 */
// #include <Arduino.h>
// #include <Wire.h>
// #include <SPI.h>
// #include "SensorQMI8658.hpp"
// #include <MadgwickAHRS.h>       //MadgwickAHRS from https://github.com/arduino-libraries/MadgwickAHRS
// #include "LoRaBoards.h"


// SensorQMI8658 qmi;

// IMUdata acc;
// IMUdata gyr;

// Madgwick filter;
// unsigned long microsPerReading, microsPrevious;

// void setup()
// {
//     Serial.begin(115200);
//     while (!Serial);

//     setupBoards();

//     pinMode(SPI_CS, OUTPUT);    //sdcard pin set high
//     digitalWrite(SPI_CS, HIGH);

//     // SDCard shares SPI bus with QMI8658
//     // SPI has been initialized in initBoard.
//     // Only need to pass SPIhandler to the QMI class.
//     if (!qmi.begin(IMU_CS, -1, -1, -1, SDCardSPI)) {
//         Serial.println("Failed to find QMI8658 - check your wiring!");
//         while (1) {
//             delay(1000);
//         }
//     }

//     /* Get chip id*/
//     Serial.print("Device ID:");
//     Serial.println(qmi.getChipID(), HEX);

//     qmi.configAccelerometer(
//         /*
//          * ACC_RANGE_2G
//          * ACC_RANGE_4G
//          * ACC_RANGE_8G
//          * ACC_RANGE_16G
//          * */
//         SensorQMI8658::ACC_RANGE_2G,
//         /*
//          * ACC_ODR_1000H
//          * ACC_ODR_500Hz
//          * ACC_ODR_250Hz
//          * ACC_ODR_125Hz
//          * ACC_ODR_62_5Hz
//          * ACC_ODR_31_25Hz
//          * ACC_ODR_LOWPOWER_128Hz
//          * ACC_ODR_LOWPOWER_21Hz
//          * ACC_ODR_LOWPOWER_11Hz
//          * ACC_ODR_LOWPOWER_3H
//         * */
//         SensorQMI8658::ACC_ODR_1000Hz,
//         /*
//         *  LPF_MODE_0     //2.66% of ODR
//         *  LPF_MODE_1     //3.63% of ODR
//         *  LPF_MODE_2     //5.39% of ODR
//         *  LPF_MODE_3     //13.37% of ODR
//         * */
//         SensorQMI8658::LPF_MODE_0,
//         // selfTest enable
//         true);


//     qmi.configGyroscope(
//         /*
//         * GYR_RANGE_16DPS
//         * GYR_RANGE_32DPS
//         * GYR_RANGE_64DPS
//         * GYR_RANGE_128DPS
//         * GYR_RANGE_256DPS
//         * GYR_RANGE_512DPS
//         * GYR_RANGE_1024DPS
//         * */
//         SensorQMI8658::GYR_RANGE_256DPS,
//         /*
//          * GYR_ODR_7174_4Hz
//          * GYR_ODR_3587_2Hz
//          * GYR_ODR_1793_6Hz
//          * GYR_ODR_896_8Hz
//          * GYR_ODR_448_4Hz
//          * GYR_ODR_224_2Hz
//          * GYR_ODR_112_1Hz
//          * GYR_ODR_56_05Hz
//          * GYR_ODR_28_025H
//          * */
//         SensorQMI8658::GYR_ODR_896_8Hz,
//         /*
//         *  LPF_MODE_0     //2.66% of ODR
//         *  LPF_MODE_1     //3.63% of ODR
//         *  LPF_MODE_2     //5.39% of ODR
//         *  LPF_MODE_3     //13.37% of ODR
//         * */
//         SensorQMI8658::LPF_MODE_3,
//         // selfTest enable
//         true);


//     // In 6DOF mode (accelerometer and gyroscope are both enabled),
//     // the output data rate is derived from the nature frequency of gyroscope
//     qmi.enableGyroscope();
//     qmi.enableAccelerometer();

//     // Print register configuration information
//     qmi.dumpCtrlRegister();

//     // start  filter
//     filter.begin(25);

//     // initialize variables to pace updates to correct rate
//     microsPerReading = 1000000 / 25;
//     microsPrevious = micros();

//     Serial.println("Read data now...");
// }


// void loop()
// {
//     float roll, pitch, heading;

//     // check if it's time to read data and update the filter
//     if (micros() - microsPrevious >= microsPerReading) {

//         // read raw data from IMU
//         if (qmi.getDataReady()) {
//             qmi.getAccelerometer(acc.x, acc.y, acc.z);
//             qmi.getGyroscope(gyr.x, gyr.y, gyr.z);
//             // update the filter, which computes orientation
//             filter.updateIMU(gyr.x, gyr.y, gyr.z, acc.x, acc.y, acc.z);

//             // print the heading, pitch and roll
//             roll = filter.getRoll();
//             pitch = filter.getPitch();
//             heading = filter.getYaw();
//             Serial.print("Orientation: ");
//             Serial.print(heading);
//             Serial.print(" ");
//             Serial.print(pitch);
//             Serial.print(" ");
//             Serial.println(roll);
//         }
//         // increment previous time, so we keep proper pace
//         microsPrevious = microsPrevious + microsPerReading;
//     }
// }


#include <Arduino.h>
#include "LoRaBoards.h"       // Cabecera principal del fabricante, inicializa todo
#include <TinyGPS++.h>       // Librería para el GPS
#include "SensorQMI8658.hpp"  // Librería IMU del fabricante (ya incluida en el repo)
#include <MadgwickAHRS.h>      // Librería para el filtro de fusión (ya incluida en el repo)

// --- Objetos Globales ---
SensorQMI8658 qmi;
TinyGPSPlus gps;
Madgwick filter;

// Variables para controlar la frecuencia de lectura del IMU
unsigned long microsPerReading, microsPrevious;


void setup()
{
    // setupBoards() es la función mágica del fabricante.
    // Inicializa Serial, PMU, I2C, Pantalla y el puerto serie del GPS.
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

    // --- INICIALIZACIÓN DEL IMU (QMI8658) - CORREGIDO ---
    // El IMU comparte el bus SPI con la tarjeta SD.
    // Primero, nos aseguramos de que el Chip Select (CS) de la SD esté desactivado (en ALTO).
    pinMode(SPI_CS, OUTPUT);
    digitalWrite(SPI_CS, HIGH);

    // Ahora, inicializamos el IMU pasándole el bus SPI correcto (SDCardSPI),
    // que está definido en los archivos del fabricante.
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
    if (micros() - microsPrevious >= microsPerReading) {
        IMUdata acc, gyr;
        if (qmi.getDataReady()) {
            qmi.getAccelerometer(acc.x, acc.y, acc.z);
            qmi.getGyroscope(gyr.x, gyr.y, gyr.z);
            filter.updateIMU(gyr.x, gyr.y, gyr.z, acc.x, acc.y, acc.z);
        }
        microsPrevious += microsPerReading;
    }

    // --- ACTUALIZACIÓN DE PANTALLA Y SERIAL (a una frecuencia más baja) ---
    static uint32_t lastDisplay = 0;
    if (millis() - lastDisplay > 500) { // Actualizar 2 veces por segundo
        lastDisplay = millis();
        
        float roll = filter.getRoll();
        float pitch = filter.getPitch();
        float yaw = filter.getYaw();

        char buffer[40];

        // Imprimir en el Monitor Serie
        Serial.printf("GPS(Sats:%d, HDOP:%.1f, Lat:%.4f, Lng:%.4f) | IMU(Yaw:%.1f)\n",
                      gps.satellites.value(), gps.hdop.hdop(),
                      gps.location.lat(), gps.location.lng(), yaw);

        // Imprimir en la Pantalla OLED
        u8g2->clearBuffer();
        u8g2->setFont(u8g2_font_profont12_tf);
        
        sprintf(buffer, "SAT:%d HDOP:%.1f", gps.satellites.value(), gps.hdop.hdop());
        u8g2->drawStr(0, 12, buffer);

        sprintf(buffer, "LAT: %.4f", gps.location.lat());
        u8g2->drawStr(0, 28, buffer);

        sprintf(buffer, "LNG: %.4f", gps.location.lng());
        u8g2->drawStr(0, 44, buffer);
        
        sprintf(buffer, "YAW: %.1f", yaw);
        u8g2->drawStr(0, 60, buffer);

        u8g2->sendBuffer();
    }
}