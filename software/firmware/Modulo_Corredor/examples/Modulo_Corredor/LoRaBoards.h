/**
 * @file      boards.h
 * @author    Lewis He (lewishe@outlook.com)
 * @license   MIT
 * @copyright Copyright (c) 2024  ShenZhen XinYuan Electronic Technology Co., Ltd
 * @date      2024-04-25
 * @last-update 2024-08-07
 */

#pragma once


#include "utilities.h"

#ifdef HAS_SDCARD
#include <SD.h>
#endif

#if defined(ARDUINO_ARCH_ESP32)  
#include <FS.h>
#include <WiFi.h>
#endif

#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <U8g2lib.h>
#include <XPowersLib.h>
#include <RadioLib.h>

#pragma pack(push, 1)
struct RastroData {
    uint32_t timestamp;   // Unix epoch (4 bytes)
    int32_t latitude;     // Multiplicado por 1e7 (4 bytes)
    int32_t longitude;    // Multiplicado por 1e7 (4 bytes)
    uint16_t battery_mv;  // Voltaje en mV (2 bytes)
    uint16_t speed_cmps;  // Velocidad en cm/s (2 bytes)
    uint8_t satellites;   // Número de satélites (1 byte)
    uint8_t hdop_x10;     // HDOP × 10 (1 byte)
    int16_t accel_x;      // Acelerómetro X (mg) (2 bytes)
    int16_t accel_y;      // Acelerómetro Y (mg) (2 bytes)
    int16_t accel_z;      // Acelerómetro Z (mg) (2 bytes)
    uint8_t racer_id;    // ID de corredor (1 byte)
    uint8_t flags;        // Bitmask: 0x1=Caída, 0x2=Carga (1 byte)
};
#pragma pack(pop)

// --- Pines Correctos para LILYGO T-Beam S3 Supreme ---
#define LORA_CS_PIN   10
#define LORA_DIO1_PIN 1
#define LORA_RST_PIN  5
#define LORA_BUSY_PIN 4

#define LORA_SCK_PIN  12
#define LORA_MISO_PIN 13
#define LORA_MOSI_PIN 11

// SPIClass spi_lora(HSPI);

// SX1262 radio = new Module(LORA_CS_PIN, LORA_DIO1_PIN, LORA_RST_PIN, LORA_BUSY_PIN, spi_lora);

#include <esp_mac.h>

#ifndef DISPLAY_MODEL
#define DISPLAY_MODEL           U8G2_SSD1306_128X64_NONAME_F_HW_I2C
#endif

#ifndef OLED_WIRE_PORT
#define OLED_WIRE_PORT          Wire
#endif

#ifndef PMU_WIRE_PORT
#define PMU_WIRE_PORT           Wire
#endif

#ifndef DISPLAY_ADDR
#define DISPLAY_ADDR            0x3C
#endif

#ifndef LORA_FREQ_CONFIG
#define LORA_FREQ_CONFIG        915.0
#endif

enum {
    POWERMANAGE_ONLINE  = _BV(0),
    DISPLAY_ONLINE      = _BV(1),
    RADIO_ONLINE        = _BV(2),
    GPS_ONLINE          = _BV(3),
    PSRAM_ONLINE        = _BV(4),
    SDCARD_ONLINE       = _BV(5),
    AXDL345_ONLINE      = _BV(6),
    BME280_ONLINE       = _BV(7),
    BMP280_ONLINE       = _BV(8),
    BME680_ONLINE       = _BV(9),
    QMC6310_ONLINE      = _BV(10),
    QMI8658_ONLINE      = _BV(11),
    PCF8563_ONLINE      = _BV(12),
    OSC32768_ONLINE      = _BV(13),
};


#define ENABLE_BLE      //Enable ble function

typedef struct {
    String          chipModel;
    float           psramSize;
    uint8_t         chipModelRev;
    uint8_t         chipFreq;
    uint8_t         flashSize;
    uint8_t         flashSpeed;
} DevInfo_t;


void setupBoards(bool disable_u8g2 = false);

bool beginSDCard();

bool beginDisplay();

void disablePeripherals();

bool beginPower();

void printResult(bool radio_online);

void flashLed();

void scanDevices(TwoWire *w);

bool beginGPS();

bool recoveryGPS();

void loopPMU(void (*pressed_cb)(void));

void scanWiFi();

#ifdef HAS_PMU
extern XPowersLibInterface *PMU;
extern bool pmuInterrupt;
#endif
extern DISPLAY_MODEL *u8g2;

#define U8G2_HOR_ALIGN_CENTER(t)    ((u8g2->getDisplayWidth() -  (u8g2->getUTF8Width(t))) / 2)
#define U8G2_HOR_ALIGN_RIGHT(t)     ( u8g2->getDisplayWidth()  -  u8g2->getUTF8Width(t))


#if defined(ARDUINO_ARCH_ESP32)

#if defined(HAS_SDCARD)
extern SPIClass SDCardSPI;
#endif

#define SerialGPS Serial1
#elif defined(ARDUINO_ARCH_STM32)
extern HardwareSerial  SerialGPS;
#endif

float getTempForNTC();

void setupBLE();

extern uint32_t deviceOnline;
