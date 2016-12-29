# coding=UTF-8
'''
Created on 26.09.2016

@author: sysoev
'''
from google.appengine.ext import db
from google.appengine.api import users

import datetime
import time
import logging


def force_unicode(string):
    if type(string) == unicode:
        return string
    return string.decode('utf-8')


class Service(db.Model):
    name = db.StringProperty(multiline=False)
    active = db.BooleanProperty(default=True)


def getServicesList(where=""):
    return Service.all().filter()


def addService(name, active):
    service = Service()
    service.name = name
    service.active = active
    service.put()
    return service.key()

class Assistants(db.Model):
    user = db.UserProperty()
    assistant_email = db.EmailProperty()
    active = db.BooleanProperty()


def getAssistant():
    assistants = Assistants.all().filter("active = ", True).filter("user = ", users.get_current_user()).fetch(1000)
    return assistants


def addAssistant(assis_email):
    assistant = Assistants()
    assistant.user = users.get_current_user()
    assistant.assistant_email = db.Email(assis_email)
    assistant.active = True
    assistant.put()

def updateAssist(key, email, active):
    assist = Assistants.get(key)
    assist.assistent_email = db.Email(email)
    assist.active = active
    assist.put()

class Client(db.Model):
    name = db.StringProperty(multiline=False)
    comment = db.StringProperty(multiline=True)
    user = db.UserProperty()
    created = db.DateTimeProperty(auto_now_add=True)
    updated = db.DateTimeProperty(auto_now=True)
    active = db.BooleanProperty()


def getClientsList():
    assistants = Assistants.all().filter("active = ", True).filter("assistant_email = ",
                                                                   users.get_current_user().email()).fetch(1000)
    user_for_as = [users.get_current_user()]
    for a in assistants:
        user_for_as.append(a.user)
    results = Client.all().filter("user IN ", user_for_as).filter("active = ", True).fetch(1000)
    return results


def addClient(name, comment):
    client = Client()
    client.user = users.get_current_user()
    client.name = force_unicode(name)
    client.comment = force_unicode(comment)
    client.active = True
    client.put()
    time.sleep(2)


def updateService(key, name, active):
    service = Service.get(key)
    service.name = name
    service.active = active
    service.put()


def updateClient(key, name, comment, active):
    client = Client.get(key)
    client.name = force_unicode(name)
    client.comment = force_unicode(comment)
    client.active = active
    client.put()
    time.sleep(2)


class ClientService(db.Model):
    comment = db.StringProperty(multiline=True)
    user_id = db.StringProperty()
    service = db.ReferenceProperty(Service, collection_name="service_set")
    active = db.BooleanProperty(default=True)


def get2lists(user):
    if not user:
        userServices = ClientService.all().filter("active = ", True)
    else:
        userServices = ClientService.all().filter("user_id = ", user.user_id()).filter("active = ", True)
    keyList = []
    for su in userServices:
        keyList.append(su.service.key())
    return userServices, keyList


def addClientService(key, comment, user_id):
    service = Service.get(key)
    # check_unique = ClientService.all().filter("user_id = ", user_id).filter("service = ", service).filter("active = ",
    #                                                                                                       True).count()
    #
    # if check_unique != 0:
    #     return ""
    client_service = ClientService()
    client_service.service = service
    client_service.comment = comment
    client_service.user_id = user_id
    client_service.put()
    return client_service.key()


def updateClientService(key, comment, active):
    client_service = ClientService.get(key)
    if client_service.active:
        client_service.comment = comment
        client_service.active = active
        client_service.put()
        return True
    else:
        return False


class OfferService(db.Model):
    user_id = db.StringProperty()
    active = db.BooleanProperty(default=True)
    name = db.StringProperty(multiline=False)
    userComment = db.StringProperty(multiline=True, default="")
    adminComment = db.StringProperty(multiline=True, default="")
    adminAnswer = db.BooleanProperty(default=False)


def get_user_offers(user_id):
    offers = OfferService.all().filter("user_id = ", user_id).filter("active = ", True)
    return offers


def get_new_offer():
    return OfferService.all().filter("active = ", True).filter("adminAnswer = ", False)


def get_offer_with_comment():
    return OfferService.all().filter("active =", True).filter("adminAnswer = ", True)


def get_inactive_offers():
    return OfferService.all().filter("active =", False)


def add_offer(user_id, name, user_comment):
    offer = OfferService()
    offer.user_id = user_id
    offer.name = name
    offer.userComment = user_comment
    offer.put()
    return offer.key()


def update_offer(key, name="", user_comment="", admin_comment="", active=True, adminAnswer=False):
    offer = OfferService.get(key)
    if name != "":
        offer.name = name
    if user_comment != "":
        offer.userComment = user_comment
    if admin_comment != "":
        offer.adminComment = admin_comment
    if active != "":
        offer.active = active
    if adminAnswer != "":
        offer.adminAnswer = adminAnswer
    offer.put()
    
    
class UserEvent(db.Model):
    comment = db.StringProperty(multiline=True)
    user_id = db.StringProperty()
    event_date = db.DateTimeProperty()
    event_time = db.DateTimeProperty()
    client = db.ReferenceProperty(Client)
    duration = db.IntegerProperty()
    active = db.BooleanProperty(default=True)
    
def addUserEvent(client_key, comment, user_id, event_date, event_time, duration):
    client = Client.get(client_key)
    UE = UserEvent()
    UE.comment = comment
    UE.user_id = user_id
    UE.event_date = event_date
    UE.event_time = event_time
    UE.duration = duration
    UE.client = client
    UE.put()
    return UE.key()
    
def update_event(key, comment="", user_id="", event_date="", event_time="", client="", duration="", active = True):
    event = UserEvent.get(key)
    logging.info("client key = "+client)
    if comment != "":
        event.comment = comment
    if user_id != "":
        event.user_id = user_id
    if event_date != "":
        event.event_date = event_date
    if event_time != "":
        event.event_time = event_time
    if active != "":
        event.active = active
    if client != "":
        logging.info("client key = "+client)
        cl = Client.get(client)
        event.client = cl
    if duration != "":
        event.duration = duration
    event.put()
    
def getUserEvents(user_id):
    assistants = Assistants.all().filter("active = ", True).filter("assistant_email = ",
                                                                   users.get_current_user().email()).fetch(1000)
    user_for_as = [users.get_current_user().user_id()]
    for a in assistants:
        user_for_as.append(a.user.user_id())
    events = sorted(UserEvent.all().filter("user_id IN ", user_for_as), key=moment)
    return events
    
def moment(ev):
    the_moment = ev.event_date
    the_moment = the_moment.replace(hour=ev.event_time.hour)
    the_moment = the_moment.replace(minute=ev.event_time.minute)
    return the_moment
    
    
