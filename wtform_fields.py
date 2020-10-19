from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired, Length, EqualTo

class RegistartionForm(FlaskForm):
	""" Registartion Form """

	username = StringField('username_label')
	password = StringField('password_label')
	confirm_password = StringField('confirm_password_label')
