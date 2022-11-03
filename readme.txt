#######################################
#######################################

<--------OFTEN- The FlashCard Application------->

1. This app should be used with prior permission of the creator and user should respect the copyright and avoid any infringement whatsoever.
2. To see the app running, you shall need:
	a. PYTHON 3.9 or higher
	b. All modules in requirements.txt
	c. Running Redis Server -@ localhost:6379- for caching and Async Jobs
	d. MailHog server -@localhost:8025- for hosting SMTP server
	e. Celery worker (in main.py) using Redis DB for Async Jobs
3. After satisfying the requirements, run the file- 'main.py' in the console, which shall enable the flask app and deploy it @ http://localhost:5000/
4. Running the app, shall create a sqliteDB file in the root folder of the application.
5. To get an idea about the format of csv expected for importing, try creating a deck, adding cards and exporting it. (You need Celery & Redis for export & import)
6. Usage of the app should be for educational purposes only.
7. Prior consent of the creator should be taken before editing the source code and should be informed in case of any problem.

CREATOR : 21f1000075@student.onlinedegree.iitm.ac.in

#######################################
#######################################


