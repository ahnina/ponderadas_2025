// Receptor (RX)
#define RX_PIN 2
#define BIT_TIME 500

String decodeManchester() {
  String message = "";
  for (int i = 0; i < 2; i++) {
    int firstState = digitalRead(RX_PIN);
    delay(BIT_TIME/2);
    int secondState = digitalRead(RX_PIN);
    
    if (firstState == HIGH && secondState == LOW) message += "0";
    else if (firstState == LOW && secondState == HIGH) message += "1";
    delay(BIT_TIME/2);
  }
  return message;
}

void executeCommand(String cmd) {
  if (cmd == "00") Serial.println("Recebido: A");
  else if (cmd == "01") Serial.println("Recebido: B");
  else if (cmd == "10") Serial.println("Recebido: C");
  else if (cmd == "11") Serial.println("Recebido: D");
}

void setup() {
  pinMode(RX_PIN, INPUT);
  Serial.begin(9600);
}

void loop() {
  String receivedMessage = decodeManchester();
  executeCommand(receivedMessage);
}
