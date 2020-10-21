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
            print(user.username)
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
@app.route('/<user_name>/todos')
def todos(user_name):
    print(user_name)
    return render_template('todos.html', data=user_name)


# cat = Category(name="general")
# db.session.add(cat)
# db.session.commit()


@app.route('/<user_name>/add/todo', methods=['POST'])
def addtodo(user_name):
    try:
        print("ABAAAA1")
        description1 = request.get_json()['description']
        # usuario2 = User.query.filter_by(id=user_name).first()
        usuario2 = User.query.filter_by(username=user_name).first()
        #print(user_name)#js envia username, no el id

        print(description1)
        print(usuario2.username)
        

        #todo = Todo(usr=usuario2, description=description1,category=cat)
        todo2 = Todo(description=description1)
       
        cat.todos.append(todo2)
      
        usuario2.todos.append(todo2)
        print(cat.name)
        print("AAAAAA4")

        db.session.add(todo2)
        print("AAAAAA123213")
        #print(todo2)
        db.session.commit()
        print("exitos")
        return jsonify({
            'status': 'true'
        })
    except Exception as e:
        db.session.rollback()
        print("falso")
        return jsonify({
            'status': 'false'
        })
    finally:
        db.session.close()


@app.route('/')
def index():
    user = User.query.all()
    return render_template('login.html')


if __name__ == '__main__':
    app.run(debug=True, port=5001)
