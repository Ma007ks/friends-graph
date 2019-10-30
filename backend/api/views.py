from flask import request, session
from flask.views import MethodView
import random


class AuthView(MethodView):
    def get(self):
        act = request.args.get('act', None)
        if act == 'logout':
            session.pop('id', None)
            return 'success'

    def post(self):
        act = request.args.get('act', None)
        if act == 'login':
            session['id'] = random.randint(0, 9999)
            return 'success'
