from celery import Celery
from flask import current_app as app

#celery=Celery("Application Jobs",backend="redis://localhost:6379/1",broker="redis://localhost:6379/2")

celery=Celery("Application Jobs",backend="redis://",broker="redis://")


class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)


#print("celery in tasks =",celery)
