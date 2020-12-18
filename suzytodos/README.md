# Proyecto 2 - DBP - CSERN
##  Nombre del Proyecto

- Todos Manager - Susy

## Integrantes
- Alvarado Salazar, Grace Nikole
- Rodríguez Llanos, Renato Sebastián
- Rubio Montiel, Ignacio

## Descripción del Proyecto
- Todos Manager - Susy, tiene como objetivo principal ser una
  herramienta de apoyo amigable para ayudar a organizar tareas.
  Inspirado en Google Tasks, esta herramienta fue creada para,
  obtener un producto similar sin dependencias de Google.

- Misión: Facilitar el manejo de responsabilidades de los usuarios.

- Visión: La visión de nuestra empresa es generar un mundo en donde todas las personas no tengan que sufrir por olvidarse de sus quehaceres del día a día.

## Tecnologías utilizadas

### Frontend
- Java
- XML

## Forma de Autenticación
- Nuestra Login y Register cuentan con autención de usuario, email y contraseña

## Manejo de Errores
- Manejamos errores de falta de data en los EditText

## Información sobre el app

### activity_main.xml
- LinearLayouts para ordenar los elementos de la vista
- TextViews para mostrar texto
- EditTexts para obtener la informacion ingresada por el usuario
- Buttons para ejecutrar las funciones de cambio de vistas y verificacion de errores

### activity_todos.xml
- LinearLayouts para ordenar los elementos de la vista
- TextViews para mostrar texto
- EditText para obtener la informacion ingresada por el usuario
- ListView para listar los todos ingresados por el usuario
- Buttons para ejecutrar las funciones para agregar todos, cambio de vistas y verificacion de errores

### MainActivity.java
- abrirtodos() funcion que se llama al cumplirse el login. Verifica que lso campos no esten vacios y abre la actividad todos. Tambien le pasa el username a la actividad todos.
- signup() funcion que se llama al cumplirse el Registro. Solo verifica que los campos no esten vacios.

### todos.java
- onCreate() jala el username que recibe del MainActivity y actualiza un text view para que se muestre el nombre del usuario
- setUpListViewListener() setea un listener para el ListView que contiene los todos y llama a onItemLongClick() que espera a un hold en los items para borrarlos usando el ArrayAdapter.
- addTodo() utiliza el ArrayAdapter para agregar el texto ingresado en el EditText
- logout() vuelve al MainActivity
