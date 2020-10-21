from modelos import *

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
        print("ABAAAA1")
        description1 = request.get_json()['description']
        usuario2 = User.query.filter_by(id=id_user).first()

        print(description1)
        print(usuario2.email)
        todo = Todo(user=usuario2, description=description1,
                    category=cat)
        print("AAAAAA4")

        db.session.add(todo)
        print("AAAAAA123213")
        print(todo)
        db.session.commit()
        print("exitos")
        return jsonify({
            'status': 'true'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'true'
        })
    finally:
        db.session.close()


@app.route('/')
def index():
    user = User.query.all()
    return render_template('login.html')


if __name__ == '__main__':
    app.run(debug=True, port=5001)
