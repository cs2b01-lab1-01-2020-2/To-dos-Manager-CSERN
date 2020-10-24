# Proyecto 1 - DBP - CSERN
![alt-text](./src/logo.png)
##  Nombre del Proyecto

- Todos Manager - Susy

## Integrantes
- Alvarado Salazar, Grace Nikole
- Rodríguez Llanos, Renato Sebastián
- Rosario Palomino, Diego Antonio
- Rubio Montiel, Ignacio

## Descripción del Proyecto
- Todos Manager - Susy, tiene como objetivo principal ser una 
  herramienta de apoyo amigable para ayudar a organizar tareas.
  Inspirado en Google Tasks, esta herramienta fue creada para,
  obtener un producto similar sin dependencias de Google.

- Misión: Facilitar el manejo de responsabilidades de los usuarios.

- Visión: La visión de nuestra empresa es generar un mundo en donde todas las personas no tengan que sufrir por olvidarse de sus quehaceres del día a día.

## Tecnologías utilizadas

### Base de Datos
- Postgres
![alt text](./src/postgres.png)

### Backend
- Python 3 
- Flask 
- SQLAlchemy

### Fronted
- UIkit
- Javasript
- CSS

## Script para cargar datos a la Base de Datos
- Ejecutar `init_data.py`

## Referencias de API
- `/auth/signup` METHOD: POST

- `/auth/login` METHOD: POST

- `/<user_name>/todos/displayall/`

- `<user_name>/todos/displaycompleted`

- `<user_name>/todos/displayincompleted`

- `<user_name>/todos`

- `<user_name>/add/todo` METHOD: POST

- `<user_name>/update/todo` METHOD: POST

- `/<user_name>/update_is_done/todo` METHOD: POST

- `/<user_name>/delete/todo`

## Hosts
- La aplicación corre en el localhost `127.0.0.1`, en el puerto `5001`.

## Forma de Autenticación
- Nuestra Login y Register cuentan con autención de usuario, email y contraseña

## Manejo de Errores
- Manejamos dos errores:
    - 404: Nos redirecciona a la página `page_not_found.html`.
    - 505: Nos redirecciona a la página `page_not_found.html`.

## Información acerca de los requests y response de cada endpoint
- `/auth/signup` METHOD: POST
    - Este método se ejecuta cuando un usuario se crea.
    - Debe enviar un JSON ```{
      'username': username,
      'email': email,
      'password': password
    } ```.
    - Retorna el username y el email del usuario creado.```{
        'username': username,
        'email': email,
    } ```.
    - En caso de que falle se generará un error 500.
- `/auth/login` METHOD: POST
    - Este método nos permite ingresar a nuestro Dashboard.
    - Debe enviar un JSON ```{
      'username': username,
      'password': password
    } ```.
    - Retorna un JSON `{ status: true }`, en caso de que hayas ingresado satisfactoriamente.
    - Retorna un JSON `{ status: false }`, en caso de que no hayas ingresado bien un campo.
- `/<user_name>/todos/displayall/`
    - Recibe el nombre del usuario.
    - Este método retorna un JSON con todos los To dos.
- `<user_name>/todos/displaycompleted`
    - Recibe el nombre del usuario.
    - Este método retorna un JSON con todos los To dos que ya han sido completados.
- `<user_name>/todos/displayincompleted`
    - Este método retorna un JSON con todo los To dos que ya han sido completados.
- `<user_name>/todos`
    - Recibe el nombre de usuario.
    - Redirecciona a la página de los To dos de un usuario.
- `<user_name>/add/todo` METHOD: POST
    - Este método nos permite añadir To dos.
    - Recibe el nombre de usuario por la URL y el To do como un JSON `{ description: value }`.
    - Retorna un JSON `{ status: true }`, en caso de que la tarea ha sido creada satisfactoriamente.
    - Retorna un JSON `{ status: false }`, en caso de que la tarea no haya sido creada.
- `<user_name>/update/todo` METHOD: POST
    - Este método nos permite actualizar un To do.
    - Recibe el nombre de usuario por la URL y el username, id del To do y el To do  como un JSON ```{
          'user_name': username,
          'todo_id': idtodo,
          'description': value
        }```.
    - Retorna un JSON `{ status: true }`, en caso de que la tarea ha sido actualizada satisfactoriamente.
    - Retorna un JSON `{ status: false }`, en caso de que la tarea no se haya podido actualizar.
- `/<user_name>/update_is_done/todo` METHOD: POST
    - Este método permite actualizar una tarea de incompleta a completa.
    - Recibe el nombre del usuario, y el id del todo.``` {
        'user_name': username,
        'todo_id': idtodo
        } ```
    - Retorna un JSON `{ status: true }`, en caso de que la tarea ha sido actualizado satisfactoriamente.
    - Retorna un JSON `{ status: false }`, en caso de que la tarea no ha sido actualizado.
- `/<user_name>/delete/todo`
    - Este método permite eliminar un To do.
    - Recibe el nombre del usuario, y el id del todo.``` {
        'user_name': username,
        'todo_id': idtodo
        } ```.
    - Retorna un JSON `{ status: true }`, en caso de que la tarea ha sido eliminado satisfactoriamente.
    - Retorna un JSON `{ status: false }`, en caso de que la tarea no ha sido eliminado.

## Deployment scripts
- En primer lugar, debemos crear la base de datos de la aplicación. La base de datos debe ser PostgresSQL. 
``` 
CREATE DATABASE todosdb
```
- Luego debemos utilizar las migracione para crear todas las tablas de la base de datos.
```
$ flask db upgrade
```
- Y para ejecutar la aplicación:
```
$ python3 app.py
```
