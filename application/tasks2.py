import numpy as np
from application.workers2 import *
from datetime import datetime
import os
import pandas as pd
import csv
from application.models import *
from celery.schedules import crontab
#from application.send_mail import *
import time
from dateutil import parser
import requests
import pandas

#@celery.on_after_finalize.connect
#def setup_periodic_tasks(sender,**kwargs):
 #       sender.add_periodic_task(10,just_say_hello.s(),name='running at every 10s?')
#print('app from tasks=',app)
celery.conf.enable_utc = False
@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    #sender.add_periodic_task(5, chance_update.s(), name='add every 10')
    sender.add_periodic_task(
        crontab(hour=0, minute=0,day_of_week=0),
        statsReset.s(),
        
    )
    sender.add_periodic_task(
        crontab(hour=0, minute=0,day_of_week=1),
        sat_statsReset.s(),
        
    )
    #sender.add_periodic_task(10.0, test.s('hello'), name='add every 10')
    #print('task set up')
    '''
    sender.add_periodic_task(
        crontab(hour=11,minute=46),
        monthlyPDFReport.s(),)
    sender.add_periodic_task(
        crontab(hour=0,minute=0), dailyStatsReset.s(),)
    
celery.conf.beat_schedule = {
    'add-every-30-seconds': {
        'task': 'tasks.add',
        'schedule': 30.0,
        'args': (16, 16)
    },
    
}
'''
@celery.task
def add(arg):
    print(arg)


'''
print("celery in tasks =",celery)
@celery.task()
def just_say_hello():
        
            
            print("INSIDE TASKE")
            print("Hello {}")
            #app = create_app('default' or 'development')
        
            return 'rs'
'''
@celery.task
def sat_statsReset():
    all_sat_classes=classes.query.filter(classes.day==0).all()
    all_c_o=classes_o.query.filter().all()
    sat_c_id=[x.class_id for x in all_sat_classes]
    for c in all_sat_classes:
        found=False
        for co in all_c_o:
            if (c.class_id==co.class_id):
                found=True
                
                c.status=0
                c.last_updated=None
                c.absence=0
                c.contradicted=0
                c.room=co.room
                c.start_time=co.start_time
                c.end_time=co.end_time
        if not found:
            #new class
            db.session.delete(c)
    all_studs=Students.query.filter().all()
    for s in all_studs:
        new_votes='0'
        c_votes=str(s.votes).split(',')
        for cid in c_votes:
            if (int(cid) not in sat_c_id) and len(cid)>=1 and cid!='0':
                new_votes+=','+str(cid)
        if new_votes=='0':
            s.votes=''
        else:
            s.votes=new_votes
        
            
    
    db.session.commit()
    print('after saturday reset votes=',s.votes)
@celery.task
def statsReset():
    df=pd.read_csv(os.path.join('static','timely_v2.csv'))
    all_classes=classes.query.filter().all()
    '''
    following to be done manually. It is nothing but appending whether the class happened or not...
    for c in all_classes:
        df.loc[df.shape[0]]=[c.class_id,c.status,final_status]
    '''
    all_c_o=classes_o.query.filter().all()
    all_sat_classes=classes.query.filter(classes.day==0).all()
    sat_c_id=[x.class_id for x in all_sat_classes]
    #assuming manual editing for the day has been done
    for c in all_classes:
        found=False
        for co in all_c_o:
            if (c.class_id==co.class_id) and c.day!=0:
                found=True
                
                c.status=0
                c.last_updated=None
                c.absence=0
                c.contradicted=0
                c.room=co.room
                c.start_time=co.start_time
                c.end_time=co.end_time
        if (not found) and c.day!=0:
            #new class
            db.session.delete(c)
    all_teachers=Teachers.query.filter().all()
    for t in all_teachers:
        t.contradictions=0
        t.helps=0
    all_studs=Students.query.filter().all()
    
    for s in all_studs:
        new_votes='0'
        
        for cid in sat_c_id:
            if str(cid) in str(s.votes):
                new_votes+=','+str(cid)

        if new_votes=='0':
            s.votes=''
        else:
            s.votes=new_votes
    db.session.commit()
    #all of this assuming no classes on sunday
    print('after non saturday reset votes=',s.votes)
    return 'done'

######################################################################################################################33
'''
@celery.task
def chance_update():
    
    df=pd.read_csv(os.path.join('static','timely_v2.csv'))
    for c in np.unique(df['class_id']):
        print('in chance_update,c_p=',c)
        print(df)
        
        for status in [0,1,-1]:
            total_r=len(np.where(df.iloc[np.where(df['status']==status)]['class_id']==c)[0])
            print('t_r=',df.iloc[np.where(df['status']==status)])
            #print(np.where(df.iloc[np.where(df.iloc[np.where(df['status']==status)]['class_id']==1)[0]]['final']==1)[0])
            #print(np.where(df[np.where(df.loc['status']==status)]['class_id']==1)[0])    
            final_r=len(np.where(df.iloc[np.where(df.iloc[np.where(df['status']==status)]['class_id']==c)[0]]['final']==1)[0])
            print('f_r=',df.iloc[np.where(df.iloc[np.where(df['status']==status)]['class_id']==c)[0]])
            #print('final_r=',final_r,'t_r=',total_r,' for c=',c)
            
            continue
            try:
                ans=(final_r/total_r)
            except ZeroDivisionError:
                ans=0
            
            
            if ans!=0:
            #new_prob=Proba(class_id=c,status=status,final=(final_r/total_r))
                c_p=Proba.query.filter(Proba.class_id==int(c),Proba.status==status).first()
                c_p.final=ans
            
            
    db.session.commit()
'''    
#########################################################################################################################33
'''    
@celery.task()
def importCSV(user_id,csv_file):
    user_obj=Users.query.filter(Users.id==user_id).first()
    #print("entered")
    if user_obj:
       # try:
            f=open(csv_file,'r')
            format_expected=True
            expected=['user_email','======',0,'*======*','deck_code,title,deck_lang,num_cards,num_revised,num_correct_revised,last_revised'
                      ,'======',1,'*======*','deck_code,card_code,front,back,correct_ans,num_ans,difficulty,last_revised',
                      '======',2,'*======*']
            error_encountered=False
            errror=''
            lines=f.readlines()
            if len(lines)<12:
                error_encountered=True
                errror='Sufficient lines not in the file'
                
            i=0
            #print(lines)
            #print("expected=",expected)
            while i<len(lines) and error_encountered==False:
                #print("now expected",expected[0],"and readline=",lines[i])
                #print("expected=",expected)
                if type(expected[0])==str:
                    if lines[i].strip()!=expected[0]:
                        #print("ERROR!")
                        error_encountered=True
                        errror='FORMAT ERROR:'+expected[0]+' expected at line '+str(i+1)
                        break
                    else:
                        expected.pop(0)
                        #print("REMOVED")
                elif expected[0]==0:
                    #print("USER:",user_obj.email," and line=",lines[i])
                    if user_obj.email!=lines[i].strip():
                        error_encountered=True
                        errror='User Email does not match'
                        break
                    else:
                        expected.pop(0)
                elif expected[0]==1:
                    deck=lines[i].strip().split(',')
                    if len(deck)!=7:
                        error_encountered=True
                        errror='Deck Details at line'+ str(i+1)+' do not match the headers and requirements'
                        break
                    
                    
                    if sanity_check(deck[0],'DCode',user_id):
                        deckCode=int(deck[0])
                        #print("fine")
                    else:
                        error_encountered=True
                        errror='DeckCode at line '+str(i+1)+' should be integer and not equal to any of the existing deckCodes'
                        break
                    if sanity_check(deck[1],'Others',user_id):
                        deckTitle=deck[1]
                    else:
                        error_encountered=True
                        errror='DeckTitle at line '+str(i+1)+' should be alphanumeric only'
                        break
                    if sanity_check(deck[2],'Others',user_id):
                        deckLanguage=deck[2]
                    else:
                        error_encountered=True
                        errror='DeckLanguage at line '+str(i+1)+' should be alphanumeric only'
                        break
                    
                    if sanity_check(deck[3],'Count',user_id):
                        count_cards=int(deck[3])
                    else:
                        error_encountered=True
                        errror='num_cards at line '+str(i+1)+' should be integer'
                        break
                    if sanity_check(deck[4],'Count',user_id):
                        count_revisions=int(deck[4])
                    else:
                        error_encountered=True
                        errror='count_revisions at line '+str(i+1)+' should be integer'
                        break
                    
                    if sanity_check(deck[5],'Count',user_id):
                        count_correct_revisions=int(deck[5])
                    else:
                        error_encountered=True
                        errror='count_correct_revisions at line '+str(i+1)+' should be integer'
                        break
                    if count_revisions<count_correct_revisions:
                        error_encountered=True
                        errror='count_correct_revisions at line '+str(i+1)+' should be less than or equal to count_revisions'
                        break
                    
                    if deck[6] != 'None':
                        try:
                            last_revised=parser.parse(deck[6])
                            deck_obj=Decks(user_id=user_id,deck_code=deckCode,title=deckTitle,deck_lang=deckLanguage,num_cards=count_cards,num_revised=count_revisions,num_correct_revised=count_correct_revisions, last_revised=last_revised)
                        except Exception as e:
                            
                            error_encountered=True
                            errror='last_revised at line '+str(i+1)+' should be either None or a datetime object PYTHON'+str(e)
                            break
                    else:
                        last_revised=''
                        deck_obj=Decks(user_id=user_id,deck_code=deckCode,date_added=datetime.now(),title=deckTitle,deck_lang=deckLanguage,num_cards=count_cards,num_revised=count_revisions,num_correct_revised=count_correct_revisions, last_revised=None,)
                    deck_details_data={}
                    if last_revised:
                        deck_details_data[deckCode]= {'deckCode':deckCode,'deckTitle':deckTitle, 'count_cards':count_cards, \
                                                                'deckLanguage': deckLanguage, 'count_revisions':count_revisions, 'count_correct_revisions':count_correct_revisions,\
                                                                'last_revised':last_revised}
                    else:
                         deck_details_data[deckCode]= {'deckCode':deckCode,'deckTitle':deckTitle, 'count_cards':count_cards, \
                                                            'deckLanguage': deckLanguage, 'count_revisions':count_revisions, 'count_correct_revisions':count_correct_revisions,\
                                                     'last_revised':None}
                    #print
                    db.session.add(deck_obj)
                    #db.session.commit()
                    expected.pop(0)
                    #print("hello ji")
                elif expected[0]==2:
                    #print("num)cards=",count_cards)
                    for _ in range(count_cards):
                        #print("in cards",lines[i])
                        card=lines[i].strip().split(',')
                        if len(card)!=8:
                            error_encountered=True
                            errror='Card Details at line '+str(i+1)+' do not match the headers and requirements'
                            break
                        
                        
                        if int(card[0])==deckCode:
                            deckCode_c=int(card[0])
                        else:
                            error_encountered=True
                            errror='deck_code at line '+str(i+1)+' should be integer, not equal to existing ones and equal to the given deckCode'
                            break
                        
                        
                        if sanity_check(card[1],'ACode',user_id):
                            cardCode=int(card[1])
                        else:
                            error_encountered=True
                            errror='card_code at line '+str(i+1)+' should be integer and not equal to any of the existing ones'
                            break
                        if sanity_check(card[2],'Others',user_id):
                            front=card[2]
                        else:
                            error_encountered=True
                            errror='front at line '+str(i+1)+' should only be alphanumeric'
                            break
                        if sanity_check(card[3],'Others',user_id):
                            back=card[3]
                        else:
                            error_encountered=True
                            errror='back at line '+str(i+1)+' should only be alphanumeric'
                            break
                        if sanity_check(card[4],'Count',user_id):
                            correct_ans=int(card[4])
                        else:
                            error_encountered=True
                            errror='correct_ans at line '+str(i+1)+' should be integer'
                            break
                        if sanity_check(card[5],'Count',user_id):
                            num_ans=int(card[5])
                        else:
                            error_encountered=True
                            errror='num_ans at line '+str(i+1)+' should be integer'
                            break
                        
                        if sanity_check(card[6],'Toughness',user_id):
                            difficulty=int(card[6])
                        else:
                            error_encountered=True
                            errror='difficulty at line '+str(i+1)+' should be integer only among 0,1,2,3'
                            break
                        if num_ans<correct_ans:
                            error_encountered=True
                            errror='correct_ans at line '+str(i+1)+' should be less than or equal to num_ans'
                            break
                        
                        if card[7] != 'None':
                            try:
                                last_revised_c=parser.parse(card[6])
                                print("here")
                                card_obj=cards(user_id=user_id,deck_code=deckCode,card_code=cardCode,front=front,back=back,correct_ans=correct_ans,num_ans=num_ans,difficulty=difficulty,last_revised=last_revised_c)
                            except:
                                error_encountered=True
                                errror='last_revised at line '+str(i+1)+' should be either None or a datetime object PYTHON'
                                break
                        else:
                            last_revised_c=''
                            card_obj=cards(user_id=user_id,deck_code=deckCode_c,card_code=cardCode,front=front,back=back,correct_ans=correct_ans,num_ans=num_ans,difficulty=difficulty,last_revised=None)
                        db.session.add(card_obj)
                        i+=1
                        #db.session.commit()
                    expected.pop(0)
                i+=1        
            if error_encountered:
                db.session.rollback()
                return errror
            else:
                
                
                db.session.commit()
                return ['done',deckCode,deck_details_data]
        #except Exception as e:
         #   db.session.rollback()
          #  return 'error'+str(e)
        #finally:
         #   f.close()

@celery.task()
def dailyRevisionReminder():
    users_obj=Users.query.all()
    recipients={}
    for user_obj in users_obj:
        #if user_obj.dont_send_daily_reminders==0:
            decks_obj=Decks.query.filter(Decks.user_id==user_obj.id).all()
            if len(decks_obj)>0:
                for deck_obj in decks_obj:
                    cards_obj=cards.query.filter(cards.deck_code==deck_obj.deck_code).all()
                    if len(cards_obj)>0:
                        a=datetime.now()
                        print("in a")
                        if deck_obj.last_revised==None or deck_obj.last_revised<datetime(a.year,a.month,a.day):
                            if not user_obj.email in recipients:
                                recipients[user_obj.email]=[deck_obj.deck_code]
                            else:
                                recipients[user_obj.email].append(deck_obj.deck_code)
                            break
                        
    #print('recipients=',recipients)
    for recipient in recipients:
        
        msg='not revised these:'
        for deck in recipients[recipient]:
            msg+=str(deck)
        send_email(recipient,'Not revised',msg)
        
        base_url='https://hooks.zapier.com/hooks/catch/12178257/b8ohypl?to='+recipient

        get_r=requests.get(base_url)
        #print("sent at",base_url)
        #print(get_r," DONE!")
        user_obj.Mreminders_sent+=1
        db.session.commit()
    return 'done'


        
@celery.task()
def export_csv(user_id,deckCode):
        try:
            with open(os.path.join('application/csv_files/generated', str(user_id)+'decks'+str(deckCode)+'.csv'), 'w', encoding='UTF8') as f:
                #writer = csv.writer(f)
                user_obj=Users.query.filter(Users.id==user_id).first()
                #print("in")
                if user_obj:
                    #print("here")
                    f.write('user_email\n')    
                    f.write('======\n')
                    f.write(user_obj.email+'\n')
                    f.write('*======*\n')
                    f.write('deck_code,title,deck_lang,num_cards,num_revised,num_correct_revised,last_revised\n')
                    f.write('======\n')
                    deck_obj=Decks.query.filter(Decks.user_id==user_obj.id,Decks.deck_code==deckCode).first()
            
                    f.write(str(deck_obj.deck_code)+','+deck_obj.title+','+deck_obj.deck_lang+','\
                    +str(deck_obj.num_cards)+','+str(deck_obj.num_revised)+','+str(deck_obj.num_correct_revised)+','\
                    +str(deck_obj.last_revised)+'\n')
                    f.write('*======*\n')
                    f.write('deck_code,card_code,front,back,correct_ans,num_ans,difficulty,last_revised\n')
                    f.write('======\n')
                    cards_obj=cards.query.filter(cards.deck_code==deckCode).all()
                    for card_obj in cards_obj:

                        f.write(str(card_obj.deck_code)+','+str(card_obj.card_code)+','+card_obj.front+','\
                        +card_obj.back+','+str(card_obj.correct_ans)+','+str(card_obj.num_ans)+','\
                        +str(card_obj.difficulty)+','+str(card_obj.last_revised)+'\n')
                    f.write('*======*\n')
                    

                    return str(user_id)+'decks'+str(deckCode)+'.csv'
                else:
                    return 'errorN'
        except:
            return 'error'
        finally:
            f.close()

from jinja2 import Template
from weasyprint import HTML
import uuid
def format_report(template_file,data={}):
    with open(template_file) as file_:
        template=Template(file_.read())
        
        return template.render(data=data)

def create_pdf_report(data,file_name):
    message=format_report('templates/report-template.html',data=data)
    
    html=HTML(string=message)
    
    #print("received data=",data)
    pdf=html.write_pdf()
    dirname='application/user_reports'
    f = open( os.path.join(dirname,file_name), 'wb')
    f.write(pdf)
    f.close()
    return  file_name

@celery.task()
def createReportforUSER(user_id,file_name,type_report):
    user_obj=Users.query.filter(Users.id==user_id).first()
    decks=[]
    deck_objs=Decks.query.filter(Decks.user_id==user_id).all()
    for deck_obj in deck_objs:
        deck_dict={}
        deck_dict['deckTitle']=deck_obj.title
        if deck_obj.date_added.month == datetime.now().month-1:
            deck_dict['new']=True
        else:
            deck_dict['new']=False
        ###
        if deck_obj.Mnum_cards==0:
            if deck_obj.num_cards>0:
                deck_dict['cards_change']='S'+str(deck_obj.num_cards)
            else:
                deck_dict['cards_change']='NS'

        else:
            change= round((deck_obj.Mnum_cards-deck_obj.num_cards)/deck_obj.Mnum_cards,2)
            deck_dict['cards_change']=str(change*100)+'%'
        deck_obj.Mnum_cards=deck_obj.num_cards
        ###
        
        if deck_obj.num_revised>0:
            deck_dict['accuracy_total']=str(round((deck_obj.num_correct_revised/deck_obj.num_revised)*100,2))+'%'        
        else:
            deck_dict['accuracy_total']='N'
        if deck_obj.Mtimes_revised>0:
            deck_dict['accuracy_monthly']=str(round((deck_obj.Mtimes_correctly_revised/deck_obj.Mtimes_revised)*100,2))+'%'        
        else:
            deck_dict['accuracy_monthly']='N'
        deck_dict['Mtimes_reset']=deck_obj.Mtimes_reset
        decks.append(deck_dict)
        deck_obj.Mtimes_revised=0
        deck_obj.Mtimes_correctly_revised=0
        
        deck_obj.Mtimes_reset=0
        

    ########
    user={}
    user['fname']=user_obj.fname
    user['lname']=user_obj.lname
    user['email']=user_obj.email
    user['month_year']=datetime.now().strftime('%B')+'-'+str(datetime.now().year)
    
    user['num_reminders_monthly']=str(user_obj.Mreminders_sent)
    if user_obj.dont_send_daily_reminders==0:
        user['num_reminders_monthly']='NA'

    if user_obj.Mdecks_at_start==0:
        user['decks_change']='S'+str(len(deck_objs))
        if len(deck_objs)==0:
            user['decks_change']='NS'
    else:
        #MARK!
        change=(len(deck_objs)-user_obj.Mdecks_at_start)/user_obj.Mdecks_at_start
        user['decks_change']=str(round(change*100,2))+'%'
    user_obj.Mdecks_at_start=len(deck_objs)
    user['Mdays_not_visited']=user_obj.Mdays_not_visited
    user_obj.Mdays_not_visited=0
    user['Mdays_not_revised']=user_obj.Mdays_not_revised
    user_obj.Mdays_not_revised=0
    #######
    cards_dict={}
    card_objs=cards.query.all()
    cards_dict['num_cards']=len(card_objs)
    if cards_dict['num_cards']>0:
        cards_dict['0-S']=0
        cards_dict['S-0']=0
        cards_dict['1-2']=0
        cards_dict['1-3']=0
        cards_dict['2-1']=0
        cards_dict['2-3']=0
        cards_dict['3-2']=0
        cards_dict['3-1']=0
        cards_dict['N']=0
        for card_obj in card_objs:
            if card_obj.Mdifficulty==card_obj.difficulty:
                cards_dict['N']+=1
            elif card_obj.Mdifficulty==0:
                    cards_dict['0-S']+=1
            elif card_obj.Mdifficulty==1:
                if card_obj.difficulty==2:
                    cards_dict['1-2']+=1
                else:
                    cards_dict['1-3']+=1
            elif card_obj.Mdifficulty==2:
                if card_obj.difficulty==1:
                    cards_dict['2-1']+=1
                else:
                    cards_dict['2-3']+=1
            elif card_obj.Mdifficulty==3:
                if card_obj.difficulty==2:
                    cards_dict['3-2']+=1
                else:
                    cards_dict['3-1']+=1
            card_obj.Mdifficulty=card_obj.difficulty
            card_obj.Mcorrect_revisions=0
    db.session.commit()
    data={'user':user,'cards':cards_dict,'decks':decks}
                
                    
            
    
    
    #print(data)
    if type_report!='html':
        ffile=create_pdf_report(data,file_name)
    #print(ffile, ' created')
    
        return ffile
    else:
        rendered_html=format_report('templates/report-template.html' ,data)
        
        send_email(user['email'],'Progress Report- OFTEN',rendered_html)
    return 'report_sent'

@celery.task()
def dailyStatsReset():
    user_objs=Users.query.all()
    for user_obj in user_objs:
        if user_obj.last_visited.day!=datetime.now().day:
            user_obj.Mdays_not_visited+=1
        deck_objs=Decks.query.filter(Decks.user_id==user_obj.id).all()
        if len(deck_objs)>0:
            if any(x.last_revised.day!=datetime.now().day for x in deck_objs):
                user_obj.Mdays_not_revised+=1
        db.session.commit()

@celery.task()
def monthlyPDFReport():
    users_obj=Users.query.all()
    #recipients=[user.email for user in users_obj if user.dont_send_monthly_report!=1]
    for user in users_obj:
        if user.dont_send_monthly_report==0:
            file_name=str(uuid.uuid4())+".pdf"
            #print(file_name)
            
            job=createReportforUSER.delay(user.id,file_name,'pdf')
            send_email(user.email,'Progress Report- OFTEN','PFA',file_name)
            while not job.ready():
                time.sleep(1)
        elif user.dont_send_monthly_report==2:
            job=createReportforUSER.delay(user.id,'just_html','html')
            while not job.ready():
                time.sleep(1)
            
        if job.state=='SUCCESS':
            return 'success'
        else:
            return 'failure'
        
        
        
        
        
        
   
    
'''
