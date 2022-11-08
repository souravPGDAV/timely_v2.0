import pandas as pd
from flask import Flask,request,session,json,send_file,jsonify,make_response
import flask_login
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from application.database import db
from application.models import *
from flask_restful import fields, marshal
from flask_security import auth_required, login_required, roles_accepted, roles_required, auth_token_required,admin_change_password
from flask import current_app as app
import random
from datetime import datetime, timedelta
from dateutil import parser
from dateutil.tz import tzutc
#from application import tasks2
import time
from werkzeug.utils import secure_filename
import os
import json
#from application import cached_funcs
from application.api.funcs import *
import requests


def class_chances(class_id):
    chances=None
    t=classes.query.filter(classes.class_id==class_id).first()
    p_result=Proba.query.filter(Proba.class_id==class_id).all()
    ab=int(get_absence(t.absence,len(Students.query.filter().all())))
    if p_result:
        for c in p_result:
            if c.status==t.status:
                if c.final<0.3:
                    
                    chances='Low'
                elif c.final<0.6:
                    if ab>=50:
                        chances='Low'
                    else:
                        chances='Medium'
                else:
                    if ab>=60:
                        chances='Medium'
                    else:
                        chances='High'
    return chances
        
def get_current_user(headers):
    print('headers=',headers)
    if 'Authentication-Token' in headers:
        token=headers['Authentication-Token']
        print('token is=',token)
        user_obj=Users.query.filter(Users.token==token).first()
        return user_obj
    else:
        return None

print('here')

def get_absence(ab,students):
    try:
        ans=str(int((ab/students)*100))
    except ZeroDivisionError :
        ans='0'
    return ans


api=Api(app)

class apiTeachers(Resource):
    def get(self):
        teachers=Teachers.query.all()
        result={}
        teacher_details={}
        teacher_details['t_id']=fields.Integer
        teacher_details['fname']=fields.String
        teacher_details['lname']=fields.String
        teacher_details['subject']=fields.String
        teacher_details['registered']=fields.Boolean
        teacher_details['contradictions']=fields.Integer
        teacher_details['helps']=fields.Integer
        
        resource_fields={}
        for idx,t in enumerate(teachers):
            temp={}
            user_if=Users.query.filter(Users.user_id==t.t_id).first()
            temp['t_id']=t.t_id
            temp['fname']=t.fname
            temp['lname']=t.lname
            temp['subject']=t.subject
            temp['contradictions']=t.contradictions
            temp['helps']=t.helps
            
            resource_fields[t.t_id]=fields.Nested(teacher_details)
            result[t.t_id]=temp.copy()
        db.session.commit()
        print(result)
        return marshal(result,resource_fields),200
        #return result
        
api.add_resource(apiTeachers,'/api/teachers')

class apiUser(Resource):
    
    def get(self):
        #start=time.perf_counter_ns()
        
        user_obj=get_current_user(request.headers)
        if not user_obj:
            return '',400
        query_result=Teachers.query.filter(Teachers.t_id==user_obj.user_id).all()
        if len(query_result)!=1:
            return marshal({'error':'Invalid Request'},{'error':fields.String}),500
        
        teacher_details={}
        teacher_details['t_id']=fields.Integer
        teacher_details['fname']=fields.String
        teacher_details['lname']=fields.String
        teacher_details['subject']=fields.String
        teacher_details['registered']=fields.Boolean
        teacher_details['contradictions']=fields.Integer
        teacher_details['helps']=fields.Integer
        
        
        resource_fields={}
        result={}
        for t in query_result:
            temp={}
            temp['t_id']=t.t_id
            temp['fname']=t.fname
            temp['lname']=t.lname
            temp['subject']=t.subject
            temp['contradictions']=t.contradictions
            temp['helps']=t.helps
            
            resource_fields[t.t_id]=fields.Nested(teacher_details)
            result[t.t_id]=temp.copy()
        #stop=time.perf_counter_ns()
        #print("time taken USERs=",stop-start)
        return marshal(result,resource_fields),200

        

api.add_resource(apiUser,'/api/user')



class apiTClasses(Resource):
        
    #@api.representation('text/csv')
    
    def get(self):
        user_obj=get_current_user(request.headers)
        if not user_obj:
            return '',400
        today=datetime.today().weekday()
        #print('get tclasses, user_obj=',user_obj)
        q_result=classes.query.filter(classes.teacher_id==user_obj.user_id).filter(classes.day==today).all()
        class_details={}
        class_details['class_id']=fields.Integer
        class_details['teacher_id']=fields.Integer
        class_details['day']=fields.Integer
        class_details['start_time']=fields.String
        class_details['end_time']=fields.String
        class_details['status']=fields.Integer
        class_details['room']=fields.Integer
        class_details['last_updated']=fields.String
        class_details['contradicted']=fields.Boolean
        class_details['absence']=fields.String
        resource_fields={}
        result={}
        for t in q_result:
            temp={}
            temp['class_id']=t.class_id
            temp['teacher_id']=t.teacher_id
            temp['day']=t.day
            temp['start_time']=t.start_time
            temp['end_time']=t.end_time
            temp['status']=t.status
            temp['room']=t.room
            temp['contradicted']=t.contradicted
            temp['absence']=get_absence(t.absence,len(Students.query.filter().all()))
            if t.last_updated:
                temp['last_updated']=t.last_updated.isoformat()
            else:
                temp['last_updated']=None
            resource_fields[t.class_id]=fields.Nested(class_details)
            result[t.class_id]=temp.copy()
        print(result)
        return marshal(result,resource_fields),200
        

    
    
    def post(self):
        
        user_obj=get_current_user(request.headers)
        if not user_obj:
            return '',400
        req_body=request.get_json()
        today=datetime.today().weekday()
        
        
        try:
            time=req_body['time']
        except:
            return marshal({'error':'time is required and should be string'},{'error':fields.String}),400
                
        try:
            room=req_body['room']
        except:
            return marshal({'error':'room is required and should be an integer for this requirement'},{'error':fields.String}),400

        try:
            start_time=req_body['start_time']
        except:
            return marshal({'error':'start_time is required and should be a string for this requirement'},{'error':fields.String}),400

        try:
            end_time=req_body['end_time']
        except:
            return marshal({'error':'end_time is required and should be a string for this requirement'},{'error':fields.String}),400

        class_obj=classes(teacher_id=user_obj.user_id,day=today,start_time=start_time,end_time=end_time,
                          status=3,room=room,last_updated=parser.parse(time))
        classes_ob=classes.query.all()
        ids=[0]
        for c in classes_ob:
            ids.append(c.class_id)
        db.session.add(class_obj)
        class_details={}
        class_details['class_id']=fields.Integer
        class_details['teacher_id']=fields.Integer
        class_details['day']=fields.Integer
        class_details['start_time']=fields.String
        class_details['end_time']=fields.String
        class_details['status']=fields.Integer
        class_details['room']=fields.Integer
        class_details['last_updated']=fields.String
        class_details['absence']=fields.String
        resource_fields={}
        result={}
        t=class_obj
        print('t=',t)
        temp={}
        temp['class_id']=max(ids)+1
        temp['teacher_id']=t.teacher_id
        temp['day']=t.day
        temp['start_time']=t.start_time
        temp['end_time']=t.end_time
        temp['status']=t.status
        temp['room']=t.room
        temp['last_updated']=t.last_updated.isoformat()
        temp['absence']=get_absence(t.absence,len(Students.query.filter().all()))
        result[max(ids)+1]=temp.copy()
        resource_fields[max(ids)+1]=fields.Nested(class_details)            
        db.session.commit()
        print('returning =',result)
        return marshal(result,resource_fields),202

    


    
    
    def put(self):
        user_obj=get_current_user(request.headers)
        print('user_obj=',user_obj)
        if not user_obj:
            return '',400
        req_body=request.get_json()       
        
        try:
            requirement=req_body['requirement']
        except:
            return marshal({'error':'requirement is required and should be string'},{'error':fields.String}),400
        try:
            if requirement=='confirm' or requirement=='abort' or requirement=='update':
                time=req_body['time']
        except:
            return marshal({'error':'time is required and should be string'},{'error':fields.String}),400
        
        if requirement=='confirm' or requirement=='abort' or requirement=='update' or requirement=='contradict' or requirement=='vote':
            
            try:
                class_id=req_body['class_id']
            except:
                return marshal({'error':'class_id is required and should be an integer for this requirement'},{'error':fields.String}),400
            
        if requirement=='get':
            req_body=request.get_json()  
            try:
                get_day=req_body['get_day']
            except:
                print('here=',get_day)
                return marshal({'error':'get_day is required and should be a number(-1,0,1) for this requirement'},{'error':fields.String}),400
            today=datetime.today().weekday()
            #print('get tclasses, user_obj=',user_obj)
            q_result=classes.query.filter(classes.teacher_id==user_obj.user_id).all()
            
            class_details={}
            class_details['class_id']=fields.Integer
            class_details['teacher_id']=fields.Integer
            class_details['day']=fields.Integer
            class_details['start_time']=fields.String
            class_details['end_time']=fields.String
            class_details['status']=fields.Integer
            class_details['room']=fields.Integer
            class_details['last_updated']=fields.String
            class_details['contradicted']=fields.Boolean
            class_details['absence']=fields.String
            resource_fields={}
            result={}
            print('q_result=',q_result)
            for t in q_result:
                print('for ',t,' in loop')
                proceed=False
                if get_day==0:
                    if today==t.day:
                        proceed=True
                if get_day==1:            
                    if today==6:
                        if t.day==0:
                            proceed=True
                    else:
                        if t.day-today==1:
                            proceed=True
                if get_day==-1:            
                    if today==0:
                        if t.day==6:
                            proceed=True
                    else:
                        if today-t.day==1:
                            proceed=True
                if proceed:
            
                    temp={}
                    temp['class_id']=t.class_id
                    temp['teacher_id']=t.teacher_id
                    temp['day']=t.day
                    temp['start_time']=t.start_time
                    temp['end_time']=t.end_time
                    temp['status']=t.status
                    temp['room']=t.room
                    temp['contradicted']=t.contradicted
                    temp['absence']=get_absence(t.absence,len(Students.query.filter().all()))
                    if t.last_updated:
                        temp['last_updated']=t.last_updated.isoformat()
                    else:
                        temp['last_updated']=None
                    resource_fields[t.class_id]=fields.Nested(class_details)
                    result[t.class_id]=temp.copy()
                    print('done for',t)
                else:
                    print('no for',t)
            print(result)
            return marshal(result,resource_fields),200
                    
            
            
        
        if requirement=='confirm':
            class_obj=classes.query.filter(classes.class_id==class_id).first()
            print('class_obj=',class_obj)
            if class_obj:
                class_obj.status=1
                class_obj.last_updated=parser.parse(time)
                db.session.commit()
                chances=class_chances(class_obj.class_id)
                
                return marshal({'chances':chances},{'chances':fields.String}),200

            return '',400

        elif requirement=='vote':
            try:
                s_id=req_body['s_id']
                
            except KeyError:
                return '',400
            
            class_obj=classes.query.filter(classes.class_id==class_id).first()
            student_obj=Students.query.filter(Students.s_id==s_id).first()
            if student_obj and class_obj:
                
                
                class_obj.absence+=1
                student_obj.votes+=str(class_obj.class_id)
                db.session.commit()
                chances=class_chances(class_obj.class_id)
                
                return marshal({'chances':chances},{'chances':fields.String}),200

            return '',400
        
        elif requirement=='abort':
            class_obj=classes.query.filter(classes.class_id==class_id).first()
            if class_obj:
                class_obj.status=-1
                class_obj.last_updated=parser.parse(time)
                db.session.commit()
                chances=class_chances(class_obj.class_id)
                
                return marshal({'chances':chances},{'chances':fields.String}),200

            return '',400
        
        elif requirement=='contradict':
            class_obj=classes.query.filter(classes.class_id==class_id).first()
            if class_obj:
                teacher_obj=Teachers.query.filter(Teachers.t_id==class_obj.teacher_id).first()
                if teacher_obj:
                    teacher_obj.contradictions+=1
                    class_obj.contradicted=1
                    db.session.commit()
                    return '',200
        elif requirement=='update':
            try:
                room=req_body['room']
            except:
                return marshal({'error':'room is required and should be an integer for this requirement'},{'error':fields.String}),400

            try:
                start_time=req_body['start_time']
            except:
                return marshal({'error':'start_time is required and should be a string for this requirement'},{'error':fields.String}),400

            try:
                end_time=req_body['end_time']
            except:
                return marshal({'error':'end_time is required and should be a string for this requirement'},{'error':fields.String}),400

            class_obj=classes.query.filter(classes.class_id==class_id).first()
            if class_obj:
                print('received start time=',start_time)
                print('received end time=',end_time)
                class_obj.room=room
                class_obj.start_time=start_time
                class_obj.end_time=end_time
                class_obj.last_updated=parser.parse(time)
                db.session.commit()
                return '',200
            return '',400

        
        else:
            return marshal({'error':'This requirement is not served. Try requesting out of - confirm or update or abort'},{'error':fields.String}),400
   
'''
    @auth_required("token")
    def delete(self):        
            user_obj=flask_login.current_user
            req_body=request.get_json()
            try:
                deckCode=req_body['deckCode']
            except:
                return marshal({'error':'deckCode is required and should be a string'}),400
            
            
            deck_obj=Decks.query.filter(Decks.user_id==user_obj.id,Decks.deck_code==deckCode).first()
            card_obj=cards.query.filter(cards.user_id==user_obj.id, cards.deck_code==deckCode).all()
            if deck_obj:
                for j in card_obj:
                    db.session.delete(j)
                db.session.delete(deck_obj)
                db.session.commit()
                cached_funcs.cache.delete_memoized(cached_funcs.get_decks_details,user_obj.id)
                cached_funcs.cache.delete_memoized(cached_funcs.get_cached_csv,user_obj.id,deckCode)
                cached_funcs.cache.delete_memoized(cached_funcs.get_deck,user_obj.id,deckCode)
                orders=['serial','None','l_d','d_l','c_i','c_d']
                for order in orders:
                    cached_funcs.cache.delete_memoized(cached_funcs.get_decks_ordered,user_obj.id,order)
                orders=['serial','serial_d','None','l_d','d_l']
                for order in orders:
                    cached_funcs.cache.delete_memoized(cached_funcs.get_cards_ordered,deckCode,order)
                
                #print("deletion done")
                return '',204
            return marshal({'error':'No such deck found'}),400
'''
api.add_resource(apiTClasses,'/api/t/classes')


class apiClasses(Resource):
    
    def put(self):
        
        req_body=request.get_json()  
        try:
            get_day=req_body['get_day']
            print('here=',get_day)
            
        except:
            print('here=',get_day)
            return marshal({'error':'get_day is required and should be a number(-1,0,1) for this requirement'},{'error':fields.String}),400
        
        today=datetime.today().weekday()
        print('today=',today)
        q_result=classes.query.all()
        #df_p=pd.read_excel('https://docs.google.com/spreadsheets/d/1eayDVbgT5OyTYFNdMnQ7Qs0ubB8bnYlE/edit?usp=sharing&ouid=116290909138343351929&rtpof=true&sd=true')
        #print(df_p)
        
        class_details={}
        class_details['class_id']=fields.Integer
        class_details['teacher_id']=fields.Integer
        class_details['day']=fields.Integer
        class_details['start_time']=fields.String
        class_details['end_time']=fields.String
        class_details['status']=fields.Integer
        class_details['room']=fields.Integer
        class_details['last_updated']=fields.String
        class_details['t_fname']=fields.String
        class_details['t_lname']=fields.String
        class_details['subject']=fields.String
        class_details['contradicted']=fields.Boolean
        class_details['absence']=fields.String
        class_details['chances']=fields.String
        resource_fields={}
        result={}
        for t in q_result:
            print('for ',t,', in loop and t.day=',t.day)
            proceed=False
            if get_day==0:
                
                if today==t.day:
                    proceed=True
            if get_day==1:            
                if today==6:
                    if t.day==0:
                        proceed=True
                else:
                    if t.day-today==1:
                        proceed=True
            if get_day==-1:            
                if today==0:
                    if t.day==6:
                        proceed=True
                else:
                    if today-t.day==1:
                        proceed=True
            
           
            if proceed:
                    chances=class_chances(t.class_id)
                    temp={}
                    temp['class_id']=t.class_id
                    temp['teacher_id']=t.teacher_id
                    temp['day']=t.day
                    temp['start_time']=t.start_time
                    temp['end_time']=t.end_time
                    temp['status']=t.status
                    temp['room']=t.room
                    t_details=Teachers.query.filter(Teachers.t_id==t.teacher_id).first()
                    temp['helps']=t_details.helps
                    temp['t_fname']=t_details.fname
                    temp['t_lname']=t_details.lname
                    temp['subject']=t_details.subject
                    temp['contradicted']=t.contradicted
                    temp['absence']=get_absence(t.absence,len(Students.query.filter().all()))
                    temp['chances']=chances
                    if t.last_updated:
                        temp['last_updated']=t.last_updated.isoformat()
                    else:
                        temp['last_updated']=None
                    resource_fields[t.class_id]=fields.Nested(class_details)
                    result[t.class_id]=temp.copy()
        print(result)
        return marshal(result,resource_fields),200
    
api.add_resource(apiClasses,'/api/classes')        


class g_signin(Resource):
    def get(self):
        access_token=request.headers['Authorization']
        r=requests.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json',headers={'Authorization':access_token})
        resp=json.loads(r.text)
        
        user_obj=Users.query.filter(Users.email==resp['email']).first()
        
        if user_obj:
            is_student=Students.query.filter(Students.s_id==user_obj.user_id).first()
            if is_student:
                
                resp['role']='student'
                resp['votes']=is_student.votes
            else:
                #for sure, the user should be a teacher
                resp['role']='teacher'
            resp['u_id']=user_obj.user_id    
            #user_obj.token=''.join(secrets.choice(string.ascii_uppercase + string.ascii_lowercase) for i in range(40))
            #db.session.commit()
            resp['token']=user_obj.token
            resource_fields={}
            resource_fields['id']=fields.String
            resource_fields['u_id']=fields.Integer
            resource_fields['email']=fields.String
            resource_fields['role']=fields.String
            resource_fields['verified_email']=fields.Boolean
            resource_fields['name']=fields.String
            resource_fields['given_name']=fields.String
            resource_fields['family_name']=fields.String
            resource_fields['picture']=fields.String
            resource_fields['locale']=fields.String
            resource_fields['hd']=fields.String
            resource_fields['token']=fields.String
            resource_fields['votes']=fields.String
            print('sending ',resp)
            return marshal(resp,resource_fields),200

api.add_resource(g_signin,'/api/g_signin')
