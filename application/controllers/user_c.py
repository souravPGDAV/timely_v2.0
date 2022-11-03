from flask import render_template, request, redirect,make_response, send_file
from flask import Flask, session
from datetime import datetime
from application.models import *
from flask import current_app as app
from flask_security import login_required, roles_accepted, roles_required
from flask_login import logout_user
import random
import json
#from flask_cors import cross_origin
#from application import tasks2 
from flask import current_app as app
import time
from datetime import datetime, timedelta
import requests


@app.route('/sw.js')
def sw():
    response=make_response(send_file('static/sw.js'))
    #change the content header file. Can also omit; flask will handle correctly.
    response.headers['Content-Type'] = 'application/javascript'
    return response


@app.route('/', methods=["POST","GET"])
#@login_required
def home_page():
    #a=export_csv(1,1)
    #print("got a=",a)
    if request.method=="GET":
        
        return render_template('home.html')
    else:
        username=request.form['username']
        password=request.form['password']
        
        user_obj=Users.query.filter(Users.username==username).first()
        if user_obj:
    
            if password!=user_obj.password:
                return render_template('error_login.html')
            else:
                session['username']=user_obj.username
                return redirect('/user/'+user_obj.username)
        else:
            return render_template('error_regn.html', err="Invalid Username or Password")


'''
@app.route('/oauthendpoint',methods=["GET"])
def oauth_handler():
    if request.method=="GET":
        print("in here")
        url=request.headers
        print('url=',url)
        access_token=url['Authorization']
        
        print(access_token)
        r=requests.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json',headers={'Authorization':access_token})
        print(r.text)
        #d=dict(r.text)
            return redirect('/?name='+json.loads(r.text)['given_name'])
        #return render_template('home.html',messages=msg)
        #returnurn redirect('/')
    else:
        return redirect('/')
'''
