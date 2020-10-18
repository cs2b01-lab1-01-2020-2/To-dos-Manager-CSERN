from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://rrodriguez:neoscience30@localhost:5432/todosdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class User(db.Model):
	__tablename__ = 'user'

	id = db.Column(db.Integer, primary_key=True)
	todos = db.relationship('Todo', backref='user', lazy=True)
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


@app.route('/user/create', methods=['GET'])
def get_user():
	print("get_user")
	username = request.args.get('username_reg', '')
	email = request.args.get('email', '')
	password = request.args.get('password_reg', '')
	user = User(username=username, email=email, password=password)
	db.session.add(user)
	db.session.commit()
	
	return redirect(url_for('login'))

@app.route('/user/create', methods=['POST'])
def post_user():
	print('post_user')
	try:
		username = request.get_json()['username']
		email = request.get_json()['email']
		password = request.get_json()['password']
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

@app.route('/')
def index():
	user = User.query.all()
	return render_template('login.html', data=user)

if __name__ == '__main__':
  app.run(debug=True, port=5001)