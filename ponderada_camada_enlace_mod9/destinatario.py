import sys

def corrigir_hamming(bits):
    """Verifica e corrige erro de 1 bit usando Hamming (7,4)."""
    p1, p2, d1, p3, d2, d3, d4 = [int(b) for b in bits]
    
    c1 = p1 ^ d1 ^ d2 ^ d4
    c2 = p2 ^ d1 ^ d3 ^ d4
    c3 = p3 ^ d2 ^ d3 ^ d4
    
    erro_posicao = c1 * 1 + c2 * 2 + c3 * 4
    
    if erro_posicao:
        bits_list = list(bits)
        bits_list[erro_posicao - 1] = "1" if bits_list[erro_posicao] == "0" else "1"
        bits = "".join(bits_list) # Corrige o bit errado
    
    return f"{bits[2]}{bits[4]}{bits[5]}{bits[6]}"

def processar_frame(frame):
    HEADER = "1010"
    TERMINATOR = "0101"
    
    if frame.startswith(HEADER) and frame.endswith(TERMINATOR):
        payload = frame[len(HEADER):-len(TERMINATOR)]
        return corrigir_hamming(list(payload))
    else:
        return "Erro: Frame inválido."

if __name__ == "__main__":
    frame = sys.stdin.read().strip()
    print(processar_frame(frame))
