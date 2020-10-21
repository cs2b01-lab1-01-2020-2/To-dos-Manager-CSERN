from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from flask_migrate import Migrate
from datetime import datetime


def inicializar():

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://rrodriguez:neoscience30@localhost:5432/todosdb'
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test17.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db = SQLAlchemy(app)
    migrate = Migrate(app, db)

    return db, app, migrate


db, app, migrate = inicializar()


class User(db.Model):
    __tablename__ = 'usr'

    id = db.Column(db.Integer, primary_key=True)
    todos = db.relationship('Todo', backref='usr', lazy=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(), nullable=False)


class Todo(db.Model):
    __tablename__ = 'todo'

    id = db.Column(db.Integer, primary_key=True)
    usr_id = db.Column(db.Integer, db.ForeignKey('usr.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(
        'category.id'), nullable=False)
    # category = db.relationship(
    #    'Category', backref=db.backref('todo', lazy=True))
    description = db.Column(db.String(), nullable=False)
    pub_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_done = db.Column(db.Boolean, default=False)


class Category(db.Model):
    __tablename__ = 'category'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    todos = db.relationship('Todo', backref='category', lazy=True)


