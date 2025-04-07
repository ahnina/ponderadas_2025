# Comunicação entre Dois Microcontroladores – Exploração da Camada Física

Este projeto tem como objetivo aplicar os conceitos fundamentais da **camada física** do modelo OSI, por meio da implementação de uma comunicação direta entre dois microcontroladores (simulados via Arduino). O sistema é composto por um **transmissor**, responsável por enviar dados, e um **receptor**, encarregado de interpretá-los e exibi-los.

## 🔌 Conexões físicas

A comunicação entre os dispositivos foi estabelecida por meio das seguintes conexões:

```
TX  (Transmissor) --- RX  (Receptor)
GND                --- GND
Pino 2             --- Pino 2
```

Essa ligação ponto-a-ponto permite a troca direta de sinais digitais entre os microcontroladores, respeitando os fundamentos da camada física.

## 📨 Transmissão de dados

O sistema foi configurado para enviar **quatro mensagens distintas: A, B, C e D**, que são transmitidas sequencialmente do transmissor para o receptor. Ao receber os dados, o receptor interpreta e exibe a mensagem correspondente.

## 📡 Codificação Manchester

A comunicação utiliza **codificação Manchester**, uma técnica que permite incorporar a sincronização dos bits diretamente no sinal transmitido. Nessa codificação:

- **Bit 0** é representado por uma transição de **HIGH para LOW** (alta para baixa tensão).
- **Bit 1** é representado por uma transição de **LOW para HIGH** (baixa para alta tensão).

Cada bit possui uma **duração fixa (bit time)**, e essa transição ocorre exatamente na **metade desse intervalo**. Isso garante que o receptor possa identificar os bits sem a necessidade de um sinal de clock externo, já que a sincronização está embutida na própria variação do sinal.

## ⏱ Bit Time e Sincronização

O parâmetro `BIT_TIME` define o tempo total de transmissão de cada bit. Ao dividir esse tempo igualmente entre os dois estados de cada transição (HIGH → LOW ou LOW → HIGH), o sistema garante que o receptor leia o sinal no momento certo, mantendo o alinhamento entre transmissão e recepção. Dessa forma:

- A codificação Manchester elimina a necessidade de um relógio externo compartilhado (clock).
- A sincronização entre os dispositivos é garantida apenas com base na temporização e na variação de estados do sinal.

## Vídeo e link do projeto no thinkercad

O projeto foi realizado utilizando o [Thinkercad](https://www.tinkercad.com/things/2gPy4efrg6V-ingenious-uusam-amberis/editel?returnTo=https%3A%2F%2Fwww.tinkercad.com%2Fdashboard&sharecode=enAtCWXpJXuu6AI1-THC8e2NrBuhf1xMcKR6wFkTVNc). A seguir, é possível acompanhar a explicação em conjunto com a demonstração de seu funcionamento:

[video](https://youtu.be/gbuNiQIqSCw)


---

Esse projeto permite uma compreensão prática de como informações podem ser transmitidas de forma confiável e sincronizada na camada física, reforçando conceitos como **sincronização de pulsos, representação de bits por transições elétricas e definição de protocolos simples de comunicação binária**.
