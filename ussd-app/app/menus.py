from app.models import Utilizador, Caixinha
from app.database import db

def menu_principal(telefone):
    # Verifica se o utilizador já existe, se não, cria
    utilizador = Utilizador.query.filter_by(telefone=telefone).first()
    if not utilizador:
        utilizador = Utilizador(telefone=telefone)
        db.session.add(utilizador)
        db.session.commit()

    return (
        "CON Bem-vindo ao PoupaJá\n"
        "1. Ver caixinhas\n"
        "2. Contribuir\n"
        "3. Criar caixinha\n"
        "4. Levantar dinheiro\n"
        "5. Simulação de progresso"
    )

def menu_ver_caixinhas(telefone):
    utilizador = Utilizador.query.filter_by(telefone=telefone).first()

    if not utilizador or len(utilizador.caixinhas) == 0:
        return "END Ainda não tens nenhuma caixinha.\nMarca novamente e escolhe a opção 3 para criar uma."

    resposta = "END As tuas caixinhas:\n"
    for c in utilizador.caixinhas:
        percentagem = (c.valor_acumulado / c.valor_objectivo) * 100
        resposta += f"- {c.nome}: {c.valor_acumulado:.0f}MT de {c.valor_objectivo:.0f}MT ({percentagem:.0f}%)\n"

    return resposta