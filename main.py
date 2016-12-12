# coding=UTF-8
'''
Created on 26.09.2016

@author: sysoev
'''
import webapp2
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
from google.appengine.api import users

from data import Service

import os
import data
import json
import datetime

def json_list(list, param_list):
    lst = []
    for pn in list:
        d = {'key': str(pn.key())}
        for param in param_list:
            d[param] = getattr(pn, param)
        lst.append(d)
    return json.dumps(lst, separators=(',', ':'))


class MainPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if not user:
            login_page = users.create_login_url('/')
            self.redirect(login_page)
            return
        userServices, keyList = data.get2lists(user)
        template_values = {
            'clients': data.getClientsList(),
            'assists': data.getAssistant(),
            'isAdmin': users.is_current_user_admin(),
            'activeServices': Service.all().filter("active = ", True),
            'inactiveServices': Service.all().filter("active = ", False),
            'userServices': userServices,
            'keyListUserServices': keyList,
            'userOffers': data.get_user_offers(user.user_id()),
            'newOffers': data.get_new_offer(),
            'offersWithComment': data.get_offer_with_comment(),
            'inactiveOffers': data.get_inactive_offers(),
            'events': data.getUserEvents(user.user_id()),
            'logOut': users.create_logout_url('/')
        }
        path = os.path.join(os.path.dirname(__file__), 'project.html')
        self.response.out.write(template.render(path, template_values))

class Catalogue(webapp2.RequestHandler):
    def get(self):
        userServices, keyList = data.get2lists(None)
        template_values = {
            'userServices': userServices
        }
        path = os.path.join(os.path.dirname(__file__), 'catalogue.html')
        self.response.out.write(template.render(path, template_values))

class ObjectList(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if not user:
            self.response.out.write('ERROR: NO USER')
            return

        object = self.request.get('object')

        if object == 'client':
            self.response.out.write(json_list(data.getClientsList(), ['name', 'comment']))
            return

        elif object == 'assist':
            self.response.out.write(json_list(data.getAssistant(), ['assistant_email']))
            return

        self.response.out.write('ERROR: UNSUPPORTED OBJECT')


class ObjectAdd(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if not user:
            self.response.out.write('ERROR: NO USER')
            return

        object_type = self.request.get("object_type")
        if object_type == "client":
            name = self.request.get('name')
            comment = self.request.get('comment')
            data.addClient(name, comment)
            self.response.out.write('OK')
            return
        elif object_type == "service":
            name = self.request.get('name')
            active = self.request.get('active')
            key = data.addService(name, active)
            self.response.out.write({key: key})
            return
        elif object_type == "assist":
            email = self.request.get('email')
            key = data.addAssistant(email)
            self.response.out.write('OK')
            return

        self.response.out.write('ERROR: UNSUPPORTED OBJECT')

    def post(self):
        user = users.get_current_user()
        events = data.getUserEvents(user.user_id())
        if not user:
            self.response.out.write('ERROR: NO USER')
            return

        object_type = self.request.get("object_type")
        if object_type == "client":
            name = self.request.get('name')
            comment = self.request.get('comment')
            data.addClient(name, comment)
            self.response.out.write('OK')
            return
        elif object_type == "service":
            name = self.request.get('name')
            active = self.request.get('active') == "True"
            key = data.addService(name, active)
            self.response.out.write(str(key))
            return
        elif object_type == "client_service":
            key = self.request.get('service_key')
            comment = self.request.get('comment')
            newKey = data.addClientService(key, comment, user.user_id())
            if newKey == "":
                self.error(500)
                return
            self.response.out.write(str(newKey))
            return
        elif object_type == "offer_service":
            name = self.request.get('name')
            user_comment = self.request.get('user_comment')
            user_id = user.user_id()
            newKey = data.add_offer(user_id, name, user_comment)
            self.response.out.write(str(newKey))
            return
        elif object_type == "user_event":
            client_key = self.request.get('client_key')
            comment = self.request.get('comment')
            user_id = user.user_id()
            event_date = datetime.datetime.strptime(self.request.get('event_date'),"%Y-%m-%d")
            event_time = datetime.datetime.strptime(self.request.get('event_time'),"%H:%M")
            duration = int(self.request.get('duration'))
            for an_event in events:
                moment = event_date
                moment = moment.replace(hour=event_time.hour)
                moment = moment.replace(minute=event_time.minute)
                engaged = an_event.event_date
                engaged = engaged.replace(hour=an_event.event_time.hour)
                engaged = engaged.replace(minute=an_event.event_time.minute)
                delta = moment - engaged
                moment_dur = datetime.timedelta(minutes=duration)
                engaged_dur = datetime.timedelta(minutes=an_event.duration)
                if delta > datetime.timedelta(days=0,hours=0,minutes=0):
                    if delta < engaged_dur:
                        newKey = 10 / 0
                if delta < datetime.timedelta(days=0,hours=0,minutes=0):
                    if -delta < moment_dur:
                        newKey = 10 / 0
            newKey = data.addUserEvent(client_key, comment, user_id, event_date, event_time, duration)
            self.response.out.write(str(newKey))
            return
        elif object_type == "assist":
            email = self.request.get('email')
            key = data.addAssistant(email)
            self.response.out.write('OK')
            return

        self.response.out.write('ERROR: UNSUPPORTED OBJECT')


class ObjectUpdate(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if not user:
            self.response.out.write('ERROR: NO USER')
            return

        object_type = self.request.get("object_type")
        if object_type == "client":
            key = self.request.get('key')
            name = self.request.get('name')
            comment = self.request.get('comment')
            active = (self.request.get('active') == "True")
            data.updateClient(key, name, comment, active)
            self.response.out.write('OK')
            return
        elif object_type == "assist":
            key = self.request.get('key')
            email = self.request.get('email')
            active = (self.request.get('active') == "True")
            data.updateAssist(key, email, active)
            self.response.out.write('OK')
            return

        self.response.out.write('ERROR: UNSUPPORTED OBJECT')

    def post(self):
        user = users.get_current_user()
        events = data.getUserEvents(user.user_id())
        if not user:
            self.response.out.write('ERROR: NO USER')
            return

        object_type = self.request.get("object_type")
        if object_type == "client":
            key = self.request.get('key')
            name = self.request.get('name')
            comment = self.request.get('comment')
            active = (self.request.get('active') == "True")
            data.updateClient(key, name, comment, active)
            self.response.out.write('OK')
            return
        elif object_type == "service":
            key = self.request.get('key')
            name = self.request.get('name')
            active = (self.request.get('active') == "True")
            data.updateService(key, name, active)
            self.response.out.write('OK')
            return
        elif object_type == "client_service":
            key = self.request.get('key')
            comment = self.request.get('comment')
            active = (self.request.get('active') == "True")
            if data.updateClientService(key, comment, active):
                self.response.out.write('OK')
            else:
                self.error(500)
            return
        elif object_type == "offer_service":
            key = self.request.get('key')
            name = self.request.get('name')
            user_comment = self.request.get('user_comment')
            admin_comment = self.request.get('admin_comment')
            active = self.request.get('active') == "True"
            admin_answer = self.request.get('admin_answer') == "True"
            data.update_offer(key, name=name, user_comment=user_comment, admin_comment=admin_comment, active=active,
                              adminAnswer=admin_answer)
            self.response.out.write("OK")
            return
        elif object_type == "assist":
            key = self.request.get('key')
            email = self.request.get('email')
            active = (self.request.get('active') == "True")
            data.updateAssist(key, email, active)
            self.response.out.write('OK')
            return
        elif object_type == "event":
            key = self.request.get('key')
            comment = self.request.get('comment')
            user_id = ""
            active = self.request.get('active') == "True"
            client = self.request.get('client')
            event_date = ""
            event_time = ""
            duration = ""
            if active == True:
                event_date = datetime.datetime.strptime(self.request.get('event_date'),"%Y-%m-%d")
                event_time = datetime.datetime.strptime(self.request.get('event_time'),"%H:%M")
                duration = int(self.request.get('duration'))
                for an_event in events:
                    moment = event_date
                    moment = moment.replace(hour=event_time.hour)
                    moment = moment.replace(minute=event_time.minute)
                    engaged = an_event.event_date
                    engaged = engaged.replace(hour=an_event.event_time.hour)
                    engaged = engaged.replace(minute=an_event.event_time.minute)
                    delta = moment - engaged
                    moment_dur = datetime.timedelta(minutes=duration)
                    engaged_dur = datetime.timedelta(minutes=an_event.duration)
                    if delta > datetime.timedelta(days=0,hours=0,minutes=0):
                        if delta < engaged_dur:
                            newKey = 10 / 0
                    if delta < datetime.timedelta(days=0,hours=0,minutes=0):
                        if -delta < moment_dur:
                            newKey = 10 / 0
                        
            data.update_event(key, comment=comment, user_id=user_id, event_date=event_date, event_time=event_time, client=client, duration=duration, active=active)
            self.response.out.write("OK")
            return

        self.response.out.write('ERROR: UNSUPPORTED OBJECT')


application = webapp2.WSGIApplication([('/', MainPage),
                                       ('/object_add/', ObjectAdd),
                                       ('/object_list/', ObjectList),
                                       ('/object_update/', ObjectUpdate),
                                       ('/catalogue', Catalogue)],
                                      debug=True)
