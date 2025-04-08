import socket
import struct

# Porta que o receptor vai escutar
port = 54321

# Cria socket UDP
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind(("0.0.0.0", port))

print(f"Aguardando pacotes UDP na porta {port}...\n")

while True:
    data, addr = sock.recvfrom(1024)  # Recebe até 1024 bytes
    print(f"Recebido de {addr}: {data}")

    # Separando cabeçalho e dados
    udp_header = data[:8]
    message = data[8:]
    
    # Desempacotando o cabeçalho
    source_port, dest_port, length, checksum = struct.unpack('!HHHH', udp_header)
    
    print(f"\n--- Cabeçalho UDP ---")
    print(f"Source Port: {source_port}")
    print(f"Destination Port: {dest_port}")
    print(f"Length: {length}")
    print(f"Checksum: {checksum} (ignorado)")
    print(f"Mensagem: {message.decode('utf-8')}")
    print("---------------------\n")
