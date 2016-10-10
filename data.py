# coding=UTF-8
'''
Created on 26.09.2016

@author: sysoev
'''
from google.appengine.ext import db
from google.appengine.api import users

import datetime
import time

def force_unicode(string):
    if type(string) == unicode:
        return string
    return string.decode('utf-8')

class Client(db.Model):
    name = db.StringProperty(multiline = False)
    comment = db.StringProperty(multiline = True)
    user = db.UserProperty()
    created = db.DateTimeProperty(auto_now_add = True)
    updated = db.DateTimeProperty(auto_now = True)
    active = db.BooleanProperty()

def getClientsList():
    return db.GqlQuery("SELECT * FROM Client WHERE user = :1 AND active = True", users.get_current_user()).fetch(1000)

def addClient(name, comment):
    client = Client()
    client.user = users.get_current_user()
    client.name = force_unicode(name)
    client.comment = force_unicode(comment)
    client.active = True
    client.put()
    time.sleep(2)

def updateClient(key, name, comment, active):
    client = Client.get(key)
    client.name = force_unicode(name)
    client.comment = force_unicode(comment)
    client.active = active
    client.put()
    time.sleep(2)

