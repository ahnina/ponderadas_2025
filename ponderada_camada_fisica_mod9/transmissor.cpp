// Transmissor (TX)
#define TX_PIN 2
#define BIT_TIME 500

void sendManchesterBit(bool bit) {
  if (bit) {
    digitalWrite(TX_PIN, LOW);
    delay(BIT_TIME/2);
    digitalWrite(TX_PIN, HIGH);
    delay(BIT_TIME/2);
  } else {
    digitalWrite(TX_PIN, HIGH);
    delay(BIT_TIME/2);
    digitalWrite(TX_PIN, LOW);
    delay(BIT_TIME/2);
  }
}

void sendMessage(String message) {
  for (int i = 0; i < message.length(); i++) {
    bool bit = message[i] - '0';
    sendManchesterBit(bit);
  }
}

void setup() {
  pinMode(TX_PIN, OUTPUT);
}

void loop() {
  sendMessage("00"); // Representa 'A'
  delay(3000);
  sendMessage("01"); // Representa 'B'
  delay(3000);
  sendMessage("10"); // Representa 'C'
  delay(3000);
  sendMessage("11"); // Representa 'D'
  delay(3000);
}