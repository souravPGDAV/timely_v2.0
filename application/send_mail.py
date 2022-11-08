import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
import time
SMTP_SERVER_HOST='localhost'
SMTP_SERVER_PORT=1025
SENDER_ADDRESS='test@example.com'
SENDER_PASSWORD=''

def send_email(to_address,subject,message,attachment_file=None):
    msg=MIMEMultipart()
    msg['From']=SENDER_ADDRESS
    msg['To']=to_address
    msg['Subject']=subject

    msg.attach(MIMEText(message, 'html'))   
    if attachment_file:
        print("in atfile~!!!!!",attachment_file)
        dirname='application/user_reports'
        #f=open(os.path.join(dirname,attachment_file),'r')
        #f.close()
        time.sleep(2)
        with open(os.path.join(dirname,attachment_file),'rb') as attachment:
                part= MIMEBase('application','octet-stream')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",f"attachment; filename={attachment_file}",
                    )
                msg.attach(part)
    s=smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS,SENDER_PASSWORD)
    s.send_message(msg)
    print("sent")
    s.quit()

    return True
