import socket
import struct

# Dados do cabeçalho
source_port = 12345           # Porta de origem
dest_port = 54321             # Porta de destino
data = b"Hello, UDP!"         # Mensagem a ser enviada
length = 8 + len(data)        # Cabeçalho (8 bytes) + dados
checksum = 0                  # Ignorado conforme solicitado

# Montagem manual do cabeçalho (UDP header format)
udp_header = struct.pack('!HHHH', source_port, dest_port, length, checksum)

# Monta o datagrama completo
packet = udp_header + data

# Cria um socket UDP comum (não precisa de privilégios especiais)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Envia o pacote para localhost
sock.sendto(packet, ("127.0.0.1", dest_port))

print(f"Pacote enviado para 127.0.0.1:{dest_port}")
sock.close()
