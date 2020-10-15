from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Integer, String


def inciar():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres:////tmp/test.db'
    db = SQLAlchemy(app)

    return app, db


app, db = inciar()


class Usuario(db.Model):
    __tablename__ = 'usuario'

    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    todos = db.relationship('Todo', backref='usuario', lazy=True)


    def __repr__(self):  # optional
        return f'Forma {self.name}'


class Todo(db.Model):
    __tablename__ = 'todo'
    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String, nullable=False)
    fecha = db.Column(db.String, unique=True, nullable=False)
    is_done = db.Column(db.Boolean, unique=False, default=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'),nullable=False)

    # https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/

    def __repr__(self):  # optional
        return f'todos {self.name}'

    
diego = Usuario(user_name = "nicanorjkjhkj", email = "correo1jkhjkhkj",password = "123456")    
limpiar = Todo(descripcion = "limpiar cuarto", fecha = "ayerjhhjj ",usuario = diego)       

db.create_all()

db.session.add(diego)
db.session.add(limpiar)
db.session.commit() 

print(4)
