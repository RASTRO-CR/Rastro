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
#define LED 2

void setup() {
  pinMode(LED, OUTPUT);
}

void loop(){
  digitalWrite(LED, HIGH);
  delay(500);
  digitalWrite(LED, LOW);
  delay(500);

}