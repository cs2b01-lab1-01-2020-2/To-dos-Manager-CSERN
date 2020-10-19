from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from wtforms_fields import *

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://mistyblunch:pvta@localhost:5432/todosdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

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
	user_id = db.Column(db.Integer, db.ForeignKey('usr.id'),nullable=False)
	category_id = db.Column(db.Integer, db.ForeignKey('category.id'),nullable=False)
	category = db.relationship('Category', backref=db.backref('todo',lazy=True))
	description = db.Column(db.String(), nullable=False)
	pub_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	end_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	is_done = db.Column(db.Boolean, default=True)

class Category(db.Model):
	__tablename__ = 'category'
	
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(50), nullable=False)


# Register
@app.route('/auth/signup', methods=['POST'])
def signup():

	reg_form = RegistrationForm()

	print('signup')
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
# @app.route('/autth/login', methods=['GET'])
# def login():
# 	print('login')
# 	try:
# 		description = request.args.get('description', '')
# 		password = request.get_json()['password']

# 		usxr = User.query.filter_by(username=username).first()
# 		pwd = User.query.filter_by(password=password).first()

# 		print(usxr)
# 		print(pwd)
	
# 		if usxr and pwd:
# 			return render_template('index.html')
# 		else:
# 			return 'no logeado'
# 	except Exception as e:
# 		return 'no logeado'


@app.route('/todos')
def todos():
	#todos = Todos.query.all()
	return render_template('todos.html')

@app.route('/')
def index():
	user = User.query.all()
	return render_template('login.html', data=user)

if __name__ == '__main__':
  app.run(debug=True, port=5001)
