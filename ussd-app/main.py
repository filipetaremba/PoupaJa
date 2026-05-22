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
    
    # ── MENU 2 — CONTRIBUIR ───────────────────────────────────
    elif passos[0] == '2':

        # passo 1 — listar caixinhas
        if len(passos) == 1:
            if len(caixinhas) == 0:
                resposta = "END Nao tens nenhuma caixinha.\nCria uma primeiro na opcao 3."
            else:
                resposta = "CON Escolhe a caixinha:\n"
                for i, c in enumerate(caixinhas, 1):
                    pct = (c['acumulado'] / c['objectivo']) * 100
                    resposta += f"{i}. {c['nome']} ({pct:.0f}%)\n"

        # passo 2 — pedir valor
        elif len(passos) == 2:
            escolha = passos[1]
            if not escolha.isdigit() or int(escolha) < 1 or int(escolha) > len(caixinhas):
                resposta = "END Opcao invalida. Tenta novamente."
            else:
                c = caixinhas[int(escolha) - 1]
                falta = c['objectivo'] - c['acumulado']
                resposta = (
                    f"CON {c['nome']}\n"
                    f"Acumulado: {c['acumulado']}MT de {c['objectivo']}MT\n"
                    f"Falta: {falta:.0f}MT\n\n"
                    f"Valor a contribuir em MT:"
                )

        # passo 3 — confirmacao
        elif len(passos) == 3:
            escolha = passos[1]
            valor   = passos[2]

            if not valor.isdigit():
                resposta = "END Valor invalido. Usa so numeros."
            else:
                c         = caixinhas[int(escolha) - 1]
                falta     = c['objectivo'] - c['acumulado']
                valor_int = int(valor)

                # se ultrapassa o objectivo, aceita só até ao limite
                if valor_int > falta:
                    valor_int = int(falta)

                novo_total = c['acumulado'] + valor_int
                pct        = (novo_total / c['objectivo']) * 100

                resposta = (
                    f"CON Confirma a contribuicao:\n"
                    f"Caixinha: {c['nome']}\n"
                    f"Valor: {valor_int}MT\n"
                    f"Novo total: {novo_total:.0f}MT de {c['objectivo']:.0f}MT ({pct:.0f}%)\n\n"
                    f"1. Confirmar\n"
                    f"2. Cancelar"
                )

        # passo 4 — guardar ou cancelar
        elif len(passos) == 4:
            escolha    = passos[1]
            valor      = passos[2]
            confirmacao = passos[3]

            if confirmacao == '2':
                resposta = "END Contribuicao cancelada."

            elif confirmacao == '1':
                c         = caixinhas[int(escolha) - 1]
                falta     = c['objectivo'] - c['acumulado']
                valor_int = min(int(valor), int(falta))

                c['acumulado'] += valor_int
                pct = (c['acumulado'] / c['objectivo']) * 100

                # verifica se atingiu o objectivo
                if c['acumulado'] >= c['objectivo']:
                    resposta = (
                        f"END Parabens! Objectivo atingido!\n"
                        f"Caixinha '{c['nome']}' esta completa.\n\n"
                        f"Marca novamente e vai a opcao 4\n"
                        f"para levantar ou aumentar o objectivo."
                    )
                else:
                    falta_nova = c['objectivo'] - c['acumulado']
                    resposta = (
                        f"END {valor_int}MT adicionados a '{c['nome']}'!\n"
                        f"Total: {c['acumulado']:.0f}MT de {c['objectivo']:.0f}MT ({pct:.0f}%)\n"
                        f"Falta: {falta_nova:.0f}MT"
                    )
            else:
                resposta = "END Opcao invalida."

        else:
            resposta = "END Algo correu mal. Tenta novamente."

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


# ── MENU 4 — LEVANTAR DINHEIRO ────────────────────────────
    elif passos[0] == '4':

        # passo 1 — listar caixinhas
        if len(passos) == 1:
            if len(caixinhas) == 0:
                resposta = "END Nao tens nenhuma caixinha.\nCria uma primeiro na opcao 3."
            else:
                resposta = "CON Escolhe a caixinha:\n"
                for i, c in enumerate(caixinhas, 1):
                    pct = (c['acumulado'] / c['objectivo']) * 100
                    completa = " (Completa!)" if c['acumulado'] >= c['objectivo'] else ""
                    resposta += f"{i}. {c['nome']} — {c['acumulado']:.0f}MT ({pct:.0f}%){completa}\n"

        # passo 2 — mostrar opcoes consoante estado da caixinha
        elif len(passos) == 2:
            escolha = passos[1]
            if not escolha.isdigit() or int(escolha) < 1 or int(escolha) > len(caixinhas):
                resposta = "END Opcao invalida. Tenta novamente."
            else:
                c = caixinhas[int(escolha) - 1]

                # caixinha completa — sem penalizacao
                if c['acumulado'] >= c['objectivo']:
                    resposta = (
                        f"CON '{c['nome']}' esta completa!\n"
                        f"Total: {c['acumulado']:.0f}MT\n\n"
                        f"O que queres fazer?\n"
                        f"1. Levantar para o M-Pesa\n"
                        f"2. Aumentar o objectivo"
                    )
                # caixinha incompleta — com penalizacao
                else:
                    penalizacao = c['acumulado'] * 0.10
                    valor_liquido = c['acumulado'] - penalizacao
                    resposta = (
                        f"CON Levantamento antecipado:\n"
                        f"Acumulado: {c['acumulado']:.0f}MT\n"
                        f"Penalizacao (10%): -{penalizacao:.0f}MT\n"
                        f"Recebes: {valor_liquido:.0f}MT\n\n"
                        f"1. Confirmar levantamento\n"
                        f"2. Cancelar"
                    )

        # passo 3 — accao escolhida
        elif len(passos) == 3:
            escolha = passos[1]
            accao   = passos[2]
            c       = caixinhas[int(escolha) - 1]

            # --- caixinha COMPLETA ---
            if c['acumulado'] >= c['objectivo']:

                # levantar
                if accao == '1':
                    valor = c['acumulado']
                    c['acumulado'] = 0
                    c['objectivo'] = 0
                    resposta = (
                        f"END {valor:.0f}MT transferidos\n"
                        f"para o teu M-Pesa com sucesso!\n"
                        f"Caixinha '{c['nome']}' encerrada.\n"
                        f"Bom proveito!"
                    )
                    caixinhas.remove(c)

                # aumentar objectivo
                elif accao == '2':
                    resposta = (
                        f"CON Novo valor objectivo em MT:\n"
                        f"(actual: {c['objectivo']:.0f}MT)\n"
                        f"Tem de ser maior que {c['objectivo']:.0f}MT"
                    )

                else:
                    resposta = "END Opcao invalida."

            # --- caixinha INCOMPLETA ---
            else:
                if accao == '1':
                    penalizacao   = c['acumulado'] * 0.10
                    valor_liquido = c['acumulado'] - penalizacao
                    nome          = c['nome']
                    c['acumulado'] = 0
                    caixinhas.remove(c)
                    resposta = (
                        f"END {valor_liquido:.0f}MT transferidos\n"
                        f"para o teu M-Pesa.\n"
                        f"Penalizacao aplicada: {penalizacao:.0f}MT\n"
                        f"Caixinha '{nome}' encerrada."
                    )

                elif accao == '2':
                    resposta = "END Levantamento cancelado.\nA tua poupanca continua!"

                else:
                    resposta = "END Opcao invalida."

        # passo 4 — só chega aqui se escolheu aumentar objectivo
        elif len(passos) == 4:
            escolha      = passos[1]
            novo_obj_str = passos[3]
            c            = caixinhas[int(escolha) - 1]

            if not novo_obj_str.isdigit():
                resposta = "END Valor invalido. Usa so numeros."
            elif float(novo_obj_str) <= c['objectivo']:
                resposta = (
                    f"END O novo objectivo tem de ser\n"
                    f"maior que {c['objectivo']:.0f}MT."
                )
            else:
                antigo        = c['objectivo']
                c['objectivo'] = float(novo_obj_str)
                falta         = c['objectivo'] - c['acumulado']
                resposta = (
                    f"END Objectivo actualizado!\n"
                    f"Antes: {antigo:.0f}MT\n"
                    f"Novo:  {novo_obj_str}MT\n"
                    f"Falta: {falta:.0f}MT\n"
                    f"Continua a poupar!"
                )

        else:
            resposta = "END Algo correu mal. Tenta novamente."

    elif passos[0] == '5':
        resposta = "END Simulacao de progresso:\nFuncionalidade em construcao."

    else:
        resposta = "END Opcao invalida. Tenta novamente."

    return resposta, 200, {'Content-Type': 'text/plain'}

if __name__ == '__main__':
    app.run(debug=True)