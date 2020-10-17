from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Integer, String # ver esto
from flask_migrate import Migrate
from datetime import datetime

# def inciar():
#   app = Flask(__name__)
#   app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://mistyblunch:pvta@localhost:5432/todosdb1'
# 	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#   db = SQLAlchemy(app)
#   return app, db


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://mistyblunch:pvta@localhost:5432/todosdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model):
  __tablename__ = 'user'

  id = db.Column(db.Integer, primary_key=True)
  todos = db.relationship('Todo', backref='user', lazy=True)
  user_name = db.Column(db.String(), unique=True, nullable=False)
  email = db.Column(db.String(), unique=True, nullable=False)
  password = db.Column(db.String(), nullable=False)

  def __repr__(self):  # optional
    return f'Forma {self.name}'

class Todo(db.Model):
  __tablename__ = 'todo'
  id = db.Column(db.Integer, primary_key=True)
  usuario_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
	category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
	category = db.relationship('Category', backref=db.backref('todo', lazy=True))
  descripcion = db.Column(db.String(), nullable=False)
	pub_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  end_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  is_done = db.Column(db.Boolean, default=True)

  # https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/
  def __repr__(self):  # optional
    return f'todos {self.name}'

class Category(db.Model):
	__tablename__ = 'categoria'
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(50), nullable=False)

	def __repr__(self):
		return '<Category %r>' % self.name

# diego = User(user_name = "nicanorjkjhkj", email = "correo1jkhjkhkj",password = "123456")    
# limpiar = Todo(descripcion = "limpiar cuarto", fecha = "ayerjhhjj ", user = diego) 

# db.create_all()

# db.session.add(diego)
# db.session.add(limpiar)
# db.session.commit() 

@app.route('/user/create', methods=['GET'])
def get_user():
  print("get_user")
  description = request.args.get('description', '')
  todo = Todo(description=description)
  db.session.add(todo)
  db.session.commit()
  return redirect(url_for('index'))

@app.route('/user/create', methods=['POST'])
def post_user():
  print('post_user')
  try:
    description = request.get_json()['description']
    todo = Todo(description=description)
    db.session.add(todo)
    db.session.commit()
    return jsonify({
      'description': todo.description
    })
  except Exception as e:
    db.session.rollback()
  finally:
    db.session.close()

@app.route('/')
def index():
  user = Todo.query.all()
  return render_template('index.html', data=user)

if __name__ == '__main__':
  app.run(debug=True, port=5001)
