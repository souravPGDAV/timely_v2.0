web: gunicorn main:app
worker: celery -A main.celery worker -B
r-server: redis-server
