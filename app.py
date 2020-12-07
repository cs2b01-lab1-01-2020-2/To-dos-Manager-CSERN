from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json
from modelos import * 

# connection = connection = psycopg2.connect(database = "todosdb", user = "mistyblunch", password = "pvta")
connection = connection = psycopg2.connect(database = "todosdb", user = "rrodriguez", password = "1234")
cursor = connection.cursor()

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
			return render_template('login.html')
		elif eml:
			return render_template('login.html')
		else:
			encrypt_pass = generate_password_hash(password, "sha256")
			user = User(username=username, email=email, password=encrypt_pass)
			db.session.add(user)
			db.session.commit()
			return jsonify({
				'username': user.username,
				'email': user.email
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

		passwd_validate = check_password_hash(usxr.password, password)

		if usxr.username == username and passwd_validate:
			return jsonify({
				'response': 'true',
				'user': usxr.username
			})
		else:
			return jsonify({
				'response': 'false'
			})

# Display all
@app.route('/todos/displayall/<user_name>/')
def display_all(user_name):
    user = User.query.filter_by(username=user_name).first()
    todo = Todo.query.filter_by(user_id=user.id).all()
    return(jsonify(todo))

# Display incompleted
@app.route('/todos/displayincompleted/<user_name>/')
def display_imcompleted(user_name):
    user = User.query.filter_by(username=user_name).first()
    status = False
    todo = Todo.query.filter((Todo.user_id == user.id) & (Todo.is_done == status)).all()
    return(jsonify(todo))

# Display completed
@app.route('/todos/displaycompleted/<user_name>/')
def display_completed(user_name):
    user = User.query.filter_by(username=user_name).first()
    status = True
    todo = Todo.query.filter((Todo.user_id == user.id) & (Todo.is_done == status)).all()
    return(jsonify(todo))

# Todos Route
@app.route('/todos/<user_name>')
def todos(user_name):
	return render_template('todos.html', data=user_name)

# Add Todo - C
@app.route('/todos/add/<user_name>/', methods=['POST'])
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
@app.route('/todos/update/<user_name>/', methods=['POST'])
def update_todo(user_name):
	try: 
		user_name = request.get_json()['user_name']
		todo_id = request.get_json()['todo_id']
		desc = request.get_json()['description']
		user = User.query.filter_by(username=user_name).first()
		user_id = user.id
		todo = Todo.query.filter((Todo.user_id == user_id) & (Todo.id == todo_id)).first()
		todo.description = desc
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

# Update Todo is_done -	U
@app.route('/todos/update_is_done/<user_name>/', methods=['POST'])
def update_todo_is_done(user_name):
	try: 
		user_name = request.get_json()['user_name']
		todo_id = request.get_json()['todo_id']
		user = User.query.filter_by(username=user_name).first()
		user_id = user.id
		todo = Todo.query.filter((Todo.user_id == user_id) & (Todo.id == todo_id)).first()
		todo.is_done = True
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

		
# Delete Todo -	D
@app.route('/todos/delete/<user_name>/', methods=['POST'])
def delete_todo(user_name):
	try: 
		user_name = request.get_json()['user_name']
		todo_id = request.get_json()['todo_id']
		user = User.query.filter_by(username=user_name).first()
		user_id = user.id
		todo = Todo.query.filter((Todo.user_id == user_id) & (Todo.id == todo_id)).first()
		db.session.delete(todo)
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
