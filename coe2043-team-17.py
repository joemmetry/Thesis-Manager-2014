import os
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import jinja2
import webapp2
import time


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

DEFAULT_GUESTBOOK_NAME = 'default_guestbook'
POST_JOEM = 'joem_guestbook'
POST_AB = 'ab_guestbook'

def guestbook_key(guestbook_name=DEFAULT_GUESTBOOK_NAME):
    """Constructs a Datastore key for a Guestbook entity with guestbook_name."""
    return ndb.Key('Guestbook', guestbook_name)

class Greeting(ndb.Model):
    """Models an individual Guestbook entry."""
    author = ndb.UserProperty()
    content = ndb.StringProperty(indexed=False)
    date = ndb.DateTimeProperty(auto_now_add=True)

class MainPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'

        template_values = {
            'user_name': user,
            'url': url,
            'url_linktext': url_linktext,
        }

        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render(template_values))

class MemberOnePage(webapp2.RequestHandler):
    def get(self):
        guestbook_name = self.request.get('guestbook_name',
                                          POST_JOEM)
        greetings_query = Greeting.query(
            ancestor=guestbook_key(guestbook_name)).order(-Greeting.date)
        greetings = greetings_query.fetch(10)

        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'

        template_values = {
            'greetings': greetings,
            'user_name':users.get_current_user(),
            'guestbook_name': urllib.quote_plus(guestbook_name),
            'url': url,
            'url_linktext': url_linktext,
        }

        template = JINJA_ENVIRONMENT.get_template('profile-member-1.html')
        self.response.write(template.render(template_values))

class MemberTwoPage(webapp2.RequestHandler):
    def get(self):
        guestbook_name = self.request.get('guestbook_name',
                                          POST_AB)
        greetings_query = Greeting.query(
            ancestor=guestbook_key(guestbook_name)).order(-Greeting.date)
        greetings = greetings_query.fetch(10)

        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'

        template_values = {
            'greetings': greetings,
            'user_name':users.get_current_user(),
            'guestbook_name': urllib.quote_plus(guestbook_name),
            'url': url,
            'url_linktext': url_linktext,
        }
        template = JINJA_ENVIRONMENT.get_template('profile-member-2.html')
        self.response.write(template.render(template_values))

class NewPage(webapp2.RequestHandler):
    def get(self,pageType):
        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        parseType = str(pageType)
        
        template_values = {
            'formtype': parseType,
            'user_name':users.get_current_user(),
            'url': url,
            'url_linktext': url_linktext,
        }

        if (pageType == 'thesis') or (pageType == 'adviser') or (pageType == 'student'):
            template = JINJA_ENVIRONMENT.get_template('templates/new.html')
            self.response.write(template.render(template_values))

    def post(self, pageType):
        parseType = str(pageType)
        if (pageType == 'thesis') or (pageType == 'adviser') or (pageType == 'student'):
            if pageType == 'thesis':
                postThesis = ThesisProcess()
                postThesis.thesis_author = self.request.get('author')
                postThesis.thesis_title = self.request.get('thesis_title')
                postThesis.thesis_desc = self.request.get('thesis_desc')
                postThesis.thesis_year = self.request.get('thesis_year')
                postThesis.thesis_status = self.request.get('thesis_status')
                if postThesis.thesis_title and postThesis.thesis_desc:
                    postThesis.put()
                    self.redirect('/thesis/success')
                elif (postThesis.thesis_title == "") and (postThesis.thesis_desc != ""):
                    self.redirect('/thesis/new?err=NoTitle')
                elif (postThesis.thesis_desc == "") and (postThesis.thesis_title != ""):
                    self.redirect('/thesis/new?err=NoDesc')
                else:
                    self.redirect('/thesis/new?err=NoInfo')
            elif pageType == 'adviser':
                postAdviser = AdviserProcess()
                postAdviser.adviser_author = self.request.get('author')
                postAdviser.adviser_title = self.request.get('adviser_title')
                postAdviser.adviser_firstname = self.request.get('adviser_firstname')
                postAdviser.adviser_lastname = self.request.get('adviser_lastname')
                postAdviser.adviser_email = self.request.get('adviser_email')
                postAdviser.adviser_phone = self.request.get('adviser_phone')
                postAdviser.adviser_dept = self.request.get('adviser_dept')
                #if postThesis.thesis_title and postThesis.thesis_desc:
                postAdviser.put()
                self.redirect('/adviser/success')
                #elif (postThesis.thesis_title == "") and (postThesis.thesis_desc != ""):
                #    self.redirect('/adviser/new?err=NoTitle')
                #elif (postThesis.thesis_desc == "") and (postThesis.thesis_title != ""):
                #    self.redirect('/adviser/new?err=NoDesc')
                #else:
                #    self.redirect('/adviser/new?err=NoInfo')
            elif pageType == 'student':
                postStudent = StudentProcess()
                postStudent.student_author = self.request.get('author')
                postStudent.student_firstname = self.request.get('student_firstname')
                postStudent.student_lastname = self.request.get('student_lastname')
                postStudent.student_number = self.request.get('student_number')
                postStudent.student_email = self.request.get('student_email')
                postStudent.student_dept = self.request.get('student_dept')
                postStudent.student_remarks = self.request.get('student_remarks')
                postStudent.put()
                self.redirect('/student/success')
                

class SuccessPage(webapp2.RequestHandler):
    def get(self,pageType):
        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        parseType = str(pageType)
        template_values = {
            'formtype' : parseType,
            'user_name':users.get_current_user(),
            'url': url,
            'url_linktext': url_linktext,
        }

        if (pageType == 'thesis') or (pageType == 'adviser') or (pageType == 'student'):
            template = JINJA_ENVIRONMENT.get_template('templates/success.html')
            self.response.write(template.render(template_values))

class ListPage(webapp2.RequestHandler):
    def get(self,pageType):
        parseType = str(pageType)
        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        if (pageType == 'thesis') or (pageType == 'adviser') or (pageType == 'student'):
            if pageType == 'thesis':
                titles = ThesisProcess.query().fetch()
            elif pageType == 'adviser':
                titles = AdviserProcess.query().fetch()
            elif pageType == 'student':
                titles = StudentProcess.query().fetch()
            template_values = {
                'formtype' : parseType,
                "fetchList"   :  titles,
                'user_name':users.get_current_user(),
                'url': url,
                'url_linktext': url_linktext,
            }   
            template = JINJA_ENVIRONMENT.get_template('templates/list.html')
            self.response.write(template.render(template_values))            

#Viewers        
class ThesisViewPage(webapp2.RequestHandler):
    def get(self, thesis_id):
        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        thesis_id = int(thesis_id)
        thesisTitles = ThesisProcess.query().fetch()
        
        values = {
            'thesisList'   :   thesisTitles,
            'id': thesis_id,
            'user_name':users.get_current_user(),
            'url': url,
            'url_linktext': url_linktext,
        }
        template = JINJA_ENVIRONMENT.get_template('templates/view/thesisView.html')
        self.response.write(template.render(values))

class ThesisEditPage(webapp2.RequestHandler):
    def get(self, thesis_id):
        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        thesis_id = int(thesis_id)
        thesisTitles = ThesisProcess.query().fetch()
        
        values = {
            'thesisList'   :   thesisTitles,
            'id': thesis_id,
            'user_name':users.get_current_user(),
            'url': url,
            'url_linktext': url_linktext,
        }
        template = JINJA_ENVIRONMENT.get_template('templates/edit/thesisEdit.html')
        self.response.write(template.render(values))

    def post(self,thesis_id):
        postThesis = ThesisProcess().get_by_id(int(thesis_id))
        postThesis.thesis_author = self.request.get('author')
        postThesis.thesis_title = self.request.get('thesis_title')
        postThesis.thesis_desc = self.request.get('thesis_desc')
        postThesis.thesis_year = self.request.get('thesis_year')
        postThesis.thesis_status = self.request.get('thesis_status')
        postThesis.put()
        time.sleep(3)
        self.redirect('/thesis/list?msg=update_thesis_success')
                

class AdviserViewPage(webapp2.RequestHandler):
    def get(self, adviser_id):
        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        adviser_id = int(adviser_id)
        advisers = AdviserProcess.query().fetch()
        
        values = {
            'adviserList'   :   advisers,
            'id': adviser_id,
            'user_name':users.get_current_user(),
            'url': url,
            'url_linktext': url_linktext,
        }
        template = JINJA_ENVIRONMENT.get_template('templates/view/adviserView.html')
        self.response.write(template.render(values))
                
class AdviserEditPage(webapp2.RequestHandler):
    def get(self, adviser_id):
        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        adviser_id = int(adviser_id)
        advisers = AdviserProcess.query().fetch()
        
        values = {
            'adviserList'   :   advisers,
            'id': adviser_id,
            'user_name':users.get_current_user(),
            'url': url,
            'url_linktext': url_linktext,
        }
        template = JINJA_ENVIRONMENT.get_template('templates/edit/adviserEdit.html')
        self.response.write(template.render(values))
    
    def post(self,adviser_id):
        postAdviser = AdviserProcess().get_by_id(int(adviser_id))
        postAdviser.adviser_author = self.request.get('author')
        postAdviser.adviser_title = self.request.get('adviser_title')
        postAdviser.adviser_firstname = self.request.get('adviser_firstname')
        postAdviser.adviser_lastname = self.request.get('adviser_lastname')
        postAdviser.adviser_email = self.request.get('adviser_email')
        postAdviser.adviser_phone = self.request.get('adviser_phone')
        postAdviser.adviser_dept = self.request.get('adviser_dept')
        postAdviser.put()
        time.sleep(3)
        self.redirect('/adviser/list?msg=update_adviser_success')

class StudentViewPage(webapp2.RequestHandler):
    def get(self, student_id):
        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        student_id = int(student_id)
        students = StudentProcess.query().fetch()
        
        values = {
            'studentList'   :   students,
            'id': student_id,
            'user_name':users.get_current_user(),
            'url': url,
            'url_linktext': url_linktext,
        }
        template = JINJA_ENVIRONMENT.get_template('templates/view/studentView.html')
        self.response.write(template.render(values))

class StudentEditPage(webapp2.RequestHandler):
    def get(self, student_id):
        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
        student_id = int(student_id)
        students = StudentProcess.query().fetch()
        
        values = {
            'studentList'   :   students,
            'id': student_id,
            'user_name':users.get_current_user(),
            'url': url,
            'url_linktext': url_linktext,
        }
        template = JINJA_ENVIRONMENT.get_template('templates/edit/studentEdit.html')
        self.response.write(template.render(values))

    def post(self,student_id):
        postStudent = StudentProcess().get_by_id(int(student_id))
        postStudent.student_author = self.request.get('author')
        postStudent.student_firstname = self.request.get('student_firstname')
        postStudent.student_lastname = self.request.get('student_lastname')
        postStudent.student_number = self.request.get('student_number')
        postStudent.student_email = self.request.get('student_email')
        postStudent.student_dept = self.request.get('student_dept')
        postStudent.student_remarks = self.request.get('student_remarks')
        postStudent.put()
        time.sleep(3)
        self.redirect('/student/list?msg=update_student_success')


#Field Fetchers
class ThesisProcess(ndb.Model):
    post_date = ndb.DateTimeProperty(auto_now_add=True)
    thesis_author = ndb.StringProperty(indexed=False)
    thesis_title = ndb.StringProperty(indexed=False)
    thesis_desc = ndb.StringProperty(indexed=False)
    thesis_year = ndb.StringProperty(indexed=False)
    thesis_status = ndb.StringProperty(indexed=False)

class AdviserProcess(ndb.Model):
    post_date = ndb.DateTimeProperty(auto_now_add=True)
    adviser_author = ndb.StringProperty(indexed=False)
    adviser_title = ndb.StringProperty(indexed=False)
    adviser_firstname = ndb.StringProperty(indexed=False)
    adviser_lastname = ndb.StringProperty(indexed=False)
    adviser_email = ndb.StringProperty(indexed=False)
    adviser_phone = ndb.StringProperty(indexed=False)
    adviser_dept = ndb.StringProperty(indexed=False)        

class StudentProcess(ndb.Model):
    post_date = ndb.DateTimeProperty(auto_now_add=True)
    student_author = ndb.StringProperty(indexed=False)
    student_firstname = ndb.StringProperty(indexed=False)
    student_lastname = ndb.StringProperty(indexed=False)
    student_email = ndb.StringProperty(indexed=False)
    student_number = ndb.StringProperty(indexed=False)
    student_dept = ndb.StringProperty(indexed=False)        
    student_remarks = ndb.StringProperty(indexed=False)        


application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/(\w+)/new', NewPage),
    ('/(\w+)/success', SuccessPage),
    ('/(\w+)/list', ListPage),
    ('/student/view/(\d+)', StudentViewPage),
    ('/thesis/view/(\d+)', ThesisViewPage),
    ('/adviser/view/(\d+)', AdviserViewPage),
    ('/student/edit/(\d+)', StudentEditPage),
    ('/thesis/edit/(\d+)', ThesisEditPage),
    ('/adviser/edit/(\d+)', AdviserEditPage),
    ('/module-1/1', MemberOnePage),
    ('/module-1/2', MemberTwoPage)
], debug=True)