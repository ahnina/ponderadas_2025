#!/bin/bash
echo "Iniciando o teste..."  # Diagnóstico

echo "Testando com payload sem erro"
python remetente.py "1011" | python destinatario.py
echo ""

echo "Testando com payload com erro"
python remetente.py "1011" | sed 's/1   /0/' | python destinatario.py
echo ""
