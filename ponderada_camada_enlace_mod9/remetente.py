import sys

def calcular_hamming(bits):
    """Aplica código de Hamming (7,4) para adicionar bits de paridade."""
    d1, d2, d3, d4 = [int(b) for b in bits]
    
    p1 = d1 ^ d2 ^ d4
    p2 = d1 ^ d3 ^ d4
    p3 = d2 ^ d3 ^ d4
    
    return f"{p1}{p2}{d1}{p3}{d2}{d3}{d4}"

def criar_frame(payload):
    HEADER = "1010"  # Exemplo de cabeçalho fixo
    TERMINATOR = "0101"
    
    hamming_code = calcular_hamming(payload)
    return HEADER + hamming_code + TERMINATOR

if __name__ == "__main__":
    payload = sys.argv[1]  # Entrada via argumento de linha de comando
    frame = criar_frame(payload)
    print(frame)
