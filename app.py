from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import psycopg2
from dataclasses import dataclass
import json

connection = psycopg2.connect('dbname=todosdb')
cursor = connection.cursor()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://mistyblunch:pvta@localhost:5432/todosdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# User
@dataclass
class User(db.Model):
    __tablename__ = 'usr'
    id: int
    username: str
    email: str
    password: str

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(), nullable=False)

# Category
@dataclass
class Category(db.Model):
    __tablename__ = 'category'
    id: int
    name: str

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

# Todo
@dataclass
class Todo(db.Model):
    __tablename__ = 'todo'
    id: int
    user_id: User
    category_id: Category
    description: str
    is_done: bool

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usr.id'),nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    description = db.Column(db.String(), nullable=False)
    is_done = db.Column(db.Boolean, default=False)


# Register
@app.route('/auth/signup', methods=['POST'])
def signup():
	try:
		username = request.get_json()['username']
		email = request.get_json()['email']
		password = request.get_json()['password']

		usxr = User.query.filter_by(username=username).first()
		eml = User.query.filter_by(email=email).first()
	
		if usxr:
			flash('User already exists')
			return render_template('login.html')
		elif eml:
			flash('Email address already exists')
			return render_template('login.html')
		else:
			user = User(username=username, email=email, password=password)
			db.session.add(user)
			db.session.commit()
			return jsonify({
				'username': user.username,
				'email': user.email,
				'password': user.password,
			})
	except Exception as e:
		db.session.rollback()
	finally:
		db.session.close()

# Login
@app.route('/auth/login', methods=['POST'])
def login():
	if request.method == 'POST':
		username = request.get_json()['username']
		password = request.get_json()['password']

		usxr = User.query.filter_by(username=username).first()

		if usxr.username == username and usxr.password == password:
			return jsonify({
				'response': 'true',
				'user': usxr.username
			})
		else:
			return jsonify({
				'response': 'false'
			})

# Display all
@app.route('/<user_name>/todos/displayall')
def display_all(user_name):
    user = User.query.filter_by(username=user_name).first()
    todo = Todo.query.filter_by(user_id=user.id).all()
    return(jsonify(todo))

# Display incompleted
@app.route('/<user_name>/todos/displayincompleted')
def display_imcompleted(user_name):
    user = User.query.filter_by(username=user_name).first()
    status = False
    todo = Todo.query.filter((Todo.user_id == user.id) & (Todo.is_done == status)).all()
    return(jsonify(todo))

# Display completed
@app.route('/<user_name>/todos/displaycompleted')
def display_completed(user_name):
    user = User.query.filter_by(username=user_name).first()
    status = True
    todo = Todo.query.filter((Todo.user_id == user.id) & (Todo.is_done == status)).all()
    return(jsonify(todo))

# Todos Route
@app.route('/<user_name>/todos')
def todos(user_name):
	return render_template('todos.html', data=user_name)

# Add Todo - C
@app.route('/<user_name>/add/todo', methods=['POST'])
def add_todo(user_name):
	try:
		cursor.execute("select count(name) from category where name ='general'")
		contGenCat = cursor.fetchone()[0]

		if(contGenCat == 0):
			cat = Category(name="general")
			db.session.add(cat)
			db.session.commit()

		desc = request.get_json()['description']
		cat_id = Category.query.filter_by(name="general").first().id
		user_id = User.query.filter_by(username=user_name).first().id

		todo = Todo(user_id=user_id, description=desc, category_id=cat_id)

		db.session.add(todo)
		db.session.commit()
		return jsonify({
			'status': 'true'
		})
	except Exception as e:
		db.session.rollback()
		return jsonify({
			'status': 'false'
		})
	finally:
		db.session.close()

# Update Todo -	U
@app.route('/<user_name>/update/todo', methods=['POST'])
def update_todo(user_name):
	try: 
		user_id = request.get_json()['user_id']
		todo_id = request.get_json()['todo_id']
		desc = request.get_json()['description']

		cursor.execute(
			"update todo set description=(%s)"
			"where id=(%s) and user_id=(%s)",
			(desc, todo_id, usr_id)
		)
		return jsonify({
			'status': 'true'
		})
	except Exception as e:
		db.session.rollback()
		return jsonify({
			'status': 'false'
		})
	finally:
		db.session.close()


# Delete Todo -	D
@app.route('/<user_name>/delete/todo', methods=['POST'])
def delete_todo(user_name):
	try: 
		user_name = request.get_json()['user_name']
		todo_id = request.get_json()['todo_id']
		user = User.query.filter_by(username=user_name).first()
		cursor.execute(
			"delete from todo"
			"where id=(%s) and user_id=(%s)",
			(todo_id, user.id)
		)
		return jsonify({
			'status': 'true'
		})
	except Exception as e:
		db.session.rollback()
		return jsonify({
			'status': 'false'
		})
	finally:
		db.session.close()

@app.route('/')
def index():
	user = User.query.all()
	return render_template('login.html')


#Error page
@app.errorhandler(404)
def page_not_found(error):
  return render_template('page_not_found.html'), 404

@app.errorhandler(500)
def error_ocurred(error):
  return render_template('page_not_found.html'), 500



if __name__ == '__main__':
    app.run(debug=True, port=5001)
