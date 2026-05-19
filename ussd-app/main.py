from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

caixinhas = [
    {
        "nome": "Telefone",
        "acumulado": 500,
        "objectivo": 5000,
        "frequencia": "Mensal",
        "valor_debito": 200,
        "tentativas_falhadas": 0
    },
    {
        "nome": "Viagem",
        "acumulado": 1200,
        "objectivo": 3000,
        "frequencia": "Semanal",
        "valor_debito": 100,
        "tentativas_falhadas": 0
    },
]

def frequencia_label(f):
    return {"1": "Diario", "2": "Semanal", "3": "Mensal"}.get(f, f)

def tempo_restante(caixinha):
    falta = caixinha["objectivo"] - caixinha["acumulado"]
    debito = caixinha["valor_debito"]
    periodos = -(-int(falta) // int(debito))
    freq = caixinha["frequencia"]
    if freq == "Diario":
        return f"{periodos} dias"
    elif freq == "Semanal":
        return f"{periodos} semanas"
    else:
        return f"{periodos} meses"

@app.route('/ussd', methods=['POST'])
def ussd():
    texto  = request.form.get('text', '')
    passos = texto.split('*') if texto else []

    # ── ECRÃ INICIAL ──────────────────────────────────────────
    if texto == '':
        resposta = (
            "CON Bem-vindo ao PoupaJa\n"
            "1. Ver caixinhas\n"
            "2. Contribuir\n"
            "3. Criar caixinha\n"
            "4. Levantar dinheiro\n"
            "5. Simulacao de progresso"
        )

    # ── MENU 1 — VER CAIXINHAS ────────────────────────────────
    elif passos[0] == '1':
        if len(caixinhas) == 0:
            resposta = "END Ainda nao tens nenhuma caixinha.\nEscolhe a opcao 3 para criar uma."
        else:
            resposta = "END As tuas caixinhas:\n"
            for i, c in enumerate(caixinhas, 1):
                pct = (c['acumulado'] / c['objectivo']) * 100
                resposta += (
                    f"{i}. {c['nome']}\n"
                    f"   {c['acumulado']}MT de {c['objectivo']}MT ({pct:.0f}%)\n"
                    f"   Debito: {c['valor_debito']}MT/{c['frequencia']}\n"
                )

    # ── MENU 3 — CRIAR CAIXINHA ───────────────────────────────
    elif passos[0] == '3':

        # passo 1 — pedir nome
        if len(passos) == 1:
            resposta = "CON Nome da caixinha:\n(ex: Telefone, Viagem, TV)"

        # passo 2 — pedir valor objectivo
        elif len(passos) == 2:
            resposta = "CON Valor objectivo em MT:\n(ex: 5000)"

        # passo 3 — pedir frequencia
        elif len(passos) == 3:
            if not passos[2].isdigit():
                resposta = "END Valor invalido. Usa so numeros."
            else:
                resposta = (
                    "CON Com que frequencia sera debitado?\n"
                    "1. Diario\n"
                    "2. Semanal\n"
                    "3. Mensal"
                )

        # passo 4 — pedir valor do debito
        elif len(passos) == 4:
            freq = passos[3]
            if freq not in ['1', '2', '3']:
                resposta = "END Opcao invalida. Escolhe 1, 2 ou 3."
            else:
                label = frequencia_label(freq)
                resposta = f"CON Valor a debitar por periodo ({label}) em MT:\n(ex: 200)"

        # passo 5 — confirmacao
        elif len(passos) == 5:
            nome      = passos[1]
            objectivo = passos[2]
            freq      = passos[3]
            debito    = passos[4]

            if not debito.isdigit():
                resposta = "END Valor invalido. Usa so numeros."
            elif int(debito) > int(objectivo):
                resposta = "END O valor do debito nao pode ser maior que o objectivo."
            else:
                label    = frequencia_label(freq)
                falta    = int(objectivo)
                periodos = -(-falta // int(debito))
                resposta = (
                    f"CON Confirma a tua caixinha:\n"
                    f"Nome: {nome}\n"
                    f"Objectivo: {objectivo}MT\n"
                    f"Debito: {debito}MT/{label}\n"
                    f"Tempo estimado: {periodos} {label.lower()}(s)\n\n"
                    f"1. Confirmar\n"
                    f"2. Cancelar"
                )

        # passo 6 — guardar ou cancelar
        elif len(passos) == 6:
            escolha = passos[5]

            if escolha == '2':
                resposta = "END Caixinha cancelada."

            elif escolha == '1':
                nome      = passos[1]
                objectivo = passos[2]
                freq      = passos[3]
                debito    = passos[4]
                label     = frequencia_label(freq)

                caixinhas.append({
                    "nome":                nome,
                    "acumulado":           0,
                    "objectivo":           float(objectivo),
                    "frequencia":          label,
                    "valor_debito":        float(debito),
                    "tentativas_falhadas": 0
                })

                resposta = (
                    f"END Caixinha '{nome}' criada!\n"
                    f"O sistema vai debitar {debito}MT\n"
                    f"de forma {label.lower()} do teu M-Pesa.\n"
                    f"Boas poupancas!"
                )
            else:
                resposta = "END Opcao invalida."

        else:
            resposta = "END Algo correu mal. Tenta novamente."

    # ── MENUS 2, 4, 5 — EM CONSTRUÇÃO ────────────────────────
    elif passos[0] == '2':
        resposta = "END Contribuir:\nFuncionalidade em construcao."

    elif passos[0] == '4':
        resposta = "END Levantar dinheiro:\nFuncionalidade em construcao."

    elif passos[0] == '5':
        resposta = "END Simulacao de progresso:\nFuncionalidade em construcao."

    else:
        resposta = "END Opcao invalida. Tenta novamente."

    return resposta, 200, {'Content-Type': 'text/plain'}

if __name__ == '__main__':
    app.run(debug=True)