import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Users, News, Adoptions, SosCases, Donations, Veterinary, AnimalShelter


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Users, db.session))  # You can duplicate that line to add mew models
    admin.add_view(ModelView(News, db.session))
    admin.add_view(ModelView(Adoptions, db.session))
    admin.add_view(ModelView(SosCases, db.session))
    admin.add_view(ModelView(Donations, db.session))
    admin.add_view(ModelView(Veterinary, db.session))
    admin.add_view(ModelView(AnimalShelter, db.session))