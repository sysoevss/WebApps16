# coding=UTF-8
'''
Created on 26.09.2016

@author: sysoev
'''
import webapp2
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
from google.appengine.api import users

import os
import data
import table
import json

def json_list(list, param_list):
    lst = []
    for pn in list:
        d = {}
        d['key'] = str(pn.key())
        for param in param_list:
            d[param] = getattr(pn, param)
        lst.append(d)
    return json.dumps(lst, separators=(',',':'))

class MainPage(webapp2.RequestHandler):  
    def get(self):
        user = users.get_current_user()
        if not user:
            login_page = users.create_login_url('/')
            self.redirect(login_page)
            return 
        
        template_values = {
           'clients': data.getClientsList()
        }
        path = os.path.join(os.path.dirname(__file__), 'project.html')
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

        self.response.out.write('ERROR: UNSUPPORTED OBJECT')
                


application = webapp2.WSGIApplication([('/', MainPage),
                                      ('/object_add/', ObjectAdd), 
                                      ('/object_list/', ObjectList), 
                                      ('/object_update/', ObjectUpdate)], 
                                     debug=True)


