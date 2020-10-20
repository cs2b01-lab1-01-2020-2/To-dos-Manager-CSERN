from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://mistyblunch:pvta@localhost:5432/todosdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# User
class User(db.Model):
	__tablename__ = 'usr'

	id = db.Column(db.Integer, primary_key=True)
	todos = db.relationship('Todo', backref='usr', lazy=True)
	username = db.Column(db.String(), unique=True, nullable=False)
	email = db.Column(db.String(), unique=True, nullable=False)
	password = db.Column(db.String(), nullable=False)

# Todo
class Todo(db.Model):
	__tablename__ = 'todo'

	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey('usr.id'),nullable=False)
	category_id = db.Column(db.Integer, db.ForeignKey('category.id'),nullable=False)
	category = db.relationship('Category', backref=db.backref('todo',lazy=True))
	description = db.Column(db.String(), nullable=False)
	pub_date = db.Column(db.DateTime, default=datetime.utcnow)
	end_date = db.Column(db.DateTime, default=datetime.utcnow)
	is_done = db.Column(db.Boolean, default=False)

# Category
class Category(db.Model):
	__tablename__ = 'category'
	
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(50), nullable=False)


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
			print("LOGEADOOOOOOOOOO")
			return jsonify({
				'response': 'true',
				'user': usxr.username
			})
		else:
			print("NOOOOOOOO LOGEADOOOOOOOOOO")
			return jsonify({
				'response': 'false'
			})

# Todos Route
@app.route('/<id_user>/todos')
def todos(id_user):
	print(id_user)
	return render_template('todos.html', data=id_user)


cat = Category(name="general")
db.session.add(cat)
db.session.commit()

@app.route('/<id_user>/add/todo', methods=['POST'])
def addtodo(id_user):
	try:
		print("AAAAAA1")
		description = request.get_json()['description']
		cat_id = Category.query.filter_by(name="general").first()
		
		print("AAAAAA3")
		todo = Todo(user_id=id_user, description=description, category_id=cat_id.id)
		print("AAAAAA4")

		db.session.add(todo)
		print("AAAAAA123213")
		print(todo)
		db.session.commit()
		print("AAAAAA5")
		return jsonify({
			'status': 'true'
		})
	except Exception as e:
		db.session.rollback()
	finally:
		db.session.close()

@app.route('/')
def index():
	user = User.query.all()
	return render_template('login.html')

if __name__ == '__main__':
  app.run(debug=True, port=5001)
