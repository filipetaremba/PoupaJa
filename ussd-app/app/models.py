from app.database import db
from datetime import datetime

class Utilizador(db.Model):
    __tablename__ = 'utilizadores'

    id          = db.Column(db.Integer, primary_key=True)
    telefone    = db.Column(db.String(20), unique=True, nullable=False)
    nome        = db.Column(db.String(100))
    criado_em   = db.Column(db.DateTime, default=datetime.utcnow)

    caixinhas   = db.relationship('Caixinha', backref='utilizador', lazy=True)

class Caixinha(db.Model):
    __tablename__ = 'caixinhas'

    id                  = db.Column(db.Integer, primary_key=True)
    utilizador_id       = db.Column(db.Integer, db.ForeignKey('utilizadores.id'), nullable=False)
    nome                = db.Column(db.String(100), nullable=False)
    valor_objectivo     = db.Column(db.Float, nullable=False)
    valor_acumulado     = db.Column(db.Float, default=0.0)
    prazo               = db.Column(db.DateTime, nullable=False)
    criado_em           = db.Column(db.DateTime, default=datetime.utcnow)