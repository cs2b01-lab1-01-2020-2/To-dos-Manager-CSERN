from werkzeug.security import generate_password_hash, check_password_hash
import json
from modelos import * 
import psycopg2

connection = connection = psycopg2.connect(database = "todosdb", user = "postgres", password = "pvta")
# connection = connection = psycopg2.connect(database = "todosdb", user = "rrodriguez", password = "1234")
cursor = connection.cursor()

# Register
@app.route('/auth/signup', methods=['POST'])
def signup():
	try:
		username = request.get_json()['username']
		email = request.get_json()['email']
		password = request.get_json()['password']

		cursor.execute("select count(username) from usr where username='%s';" % (username))
		usxr_count = cursor.fetchone()[0]

		cursor.execute("select count(email) from usr where email='%s';" % (email))
		eml_count = cursor.fetchone()[0]
	
		if usxr_count > 0:
			return render_template('login.html')
		elif eml_count > 0:
			return render_template('login.html')
		else:
			encrypt_pass = generate_password_hash(password, "sha256")

			cursor.execute("select max(id) from usr;")
			id_max = cursor.fetchone()[0]
			id_max = id_max if (id_max != None) else 0

			user = User(id=id_max+1, username=username, email=email, password=encrypt_pass)
			db.session.add(user)
			db.session.commit()

			cursor.execute("select id from usr where username='%s'" %user.username)
			user_id = cursor.fetchone()[0]

			table = Tablero(name="default", user_id=user_id, is_admin=True)

			db.session.add(table)
			db.session.commit()

			return jsonify({
				'username': user.username,
				'email': user.email,
				'status': 'true',
				'table': table.name
			})
	except Exception as e:
		db.session.rollback()
		return jsonify({
			'status': 'false'
		})
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
			cursor.execute("select id from usr where username='%s'" %usxr.username)
			user_id = cursor.fetchone()[0]

			cursor.execute("select name from tablero where user_id='%s'" %user_id)
			tablero_name = cursor.fetchone()[0]

			return jsonify({
				'response': 'true',
				'user': usxr.username,
				'tablero_name': tablero_name
			})
		else:
			return jsonify({
				'response': 'false'
			})

# Display all
@app.route('/<user_name>/<table_name>/todos/displayall/')
def display_all(user_name, table_name):
	user = User.query.filter_by(username=user_name).first()
	table = Tablero.query.filter((Tablero.user_id == user.id) & (Tablero.name == table_name)).first()
	todo = Todo.query.filter((Todo.user_id==user.id) & (Todo.tablero_id==table.id)).all()
	return(jsonify(todo))

# Todos Route
@app.route('/<user_name>/<table_name>/todos/')
def todos(user_name, table_name):
	user = User.query.filter_by(username=user_name).first()
	tables = Tablero.query.filter(Tablero.user_id == user.id)
	return render_template('todos.html', data=user_name, tables=tables)


# Display incompleted
@app.route('/<user_name>/<table_name>/todos/displayincompleted/')
def display_imcompleted(user_name):
    user = User.query.filter_by(username=user_name).first()
    status = False
    todo = Todo.query.filter((Todo.user_id == user.id) & (Todo.is_done == status)).all()
    return(jsonify(todo))

# Display completed
@app.route('/<user_name>/<table_name>/todos/displaycompleted/')
def display_completed(user_name):
    user = User.query.filter_by(username=user_name).first()
    status = True
    todo = Todo.query.filter((Todo.user_id == user.id) & (Todo.is_done == status)).all()
    return(jsonify(todo))


# Add Todo - C
@app.route('/<user_name>/<table_name>/todos/add/', methods=['POST'])
def add_todo(user_name, table_name):
	try:
		cursor.execute("select count(name) from category where name ='general'")
		contGenCat = cursor.fetchone()[0]

		if(contGenCat == 0):
			cat = Category(name="general")
			db.session.add(cat)
			db.session.commit()

		desc = request.get_json()['description']
		dead = request.get_json()['deadline']

		cat_id = Category.query.filter_by(name="general").first().id
		user_id = User.query.filter_by(username=user_name).first().id

		cursor.execute("select id from tablero where name='%s' and user_id='%s';" % (table_name, user_id))
		tablero_id = cursor.fetchone()[0]

		cursor.execute("select max(id) from todo;")
		id_max = cursor.fetchone()[0]
		id_max = id_max if (id_max != None) else 0

		todo = Todo(id=id_max+1, user_id=user_id, tablero_id=tablero_id, description=desc, category_id=cat_id, deadline=dead)

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
@app.route('/<user_name>/<table_name>/todos/update/', methods=['POST'])
def update_todo(user_name,table_name):
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
@app.route('/<user_name>/<table_name>/todos/update_is_done/', methods=['POST'])
def update_todo_is_done(user_name,table_name):
	try: 
		user_name = request.get_json()['user_name']
		todo_id = request.get_json()['todo_id']
		user = User.query.filter_by(username=user_name).first()
		user_id = user.id
		todo = Todo.query.filter((Todo.user_id == user_id) & (Todo.id == todo_id)).first()
		if(todo.is_done):
			todo.is_done = False
		else:
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
@app.route('/<user_name>/<table_name>/todos/delete/', methods=['POST'])
def delete_todo(user_name,table_name):
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

@app.route('/table/create', methods=['GET'])
def create_table1():
	print("create")
	table_name = request.args.get('name', '')
	owner_name = request.args.get('owner', '')
	is_admin = request.args.get('admin', '')

	owner_id = User.query.filter_by(username=owner_name).first().id
	
	table = Tablero(name=table_name, user_id=owner_id, is_admin=is_admin)
	db.session.add(table)
	db.session.commit()
	return todos(owner_name, table_name)

@app.route('/table/create', methods=['POST'])
def create_table2():
	print("post")
	try:
		table_name = request.get_json()['name']
		owner_name = request.get_json()['owner']
		is_admin = request.get_json()['admin']

		owner_id = User.query.filter_by(username=owner_name).first().id

		table = Tablero(name=table_name, user_id=owner_id, is_admin=is_admin)
		db.session.add(table)
		db.session.commit()
		return jsonify({
			'name': table.name
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
