function form_admin_comment(key, name, comment) {
    var $newTr = $("#new_offer_table").find(".answer_offer_form").clone(true,true);
    
    $newTr.find(".service_key").text(key);
    $newTr.find(".service_name").text(name);
    $newTr.find(".service_user_comment").text(comment);
    
    $newTr.removeAttr("style").removeClass("answer_offer_form");
    
    return $newTr;
}

function new_admin_offer_tr(key, name, comment) {


    var $newTr = $("#new_offer_table").find(".service_template").clone(true,true);

    $newTr.find(".service_key").text(key);
    $newTr.find(".service_name").text(name);
    $newTr.find(".service_user_comment").text(comment);

    $newTr.removeAttr("style").removeClass("service_template");

    return $newTr;

}

function new_offer_with_comment(key, name, comment, admin_comment) {
    


    var $newTr = $("#offer_with_answer_table").find(".service_template").clone(true,true);

    $newTr.find(".service_key").text(key);
    $newTr.find(".service_name").text(name);
    $newTr.find(".service_user_comment").text(comment);
    $newTr.find(".service_admin_comment").text(admin_comment);
    

    $newTr.removeAttr("style").removeClass("inactive_offer_template");

    return $newTr;
}

function new_inactive_offer_tr(key, name, comment, admin_comment) {


    var $newTr = $("#inactive_offer_table").find(".inactive_offer_template").clone(true,true);

    $newTr.find(".service_key").text(key);
    $newTr.find(".service_name").text(name);
    $newTr.find(".service_user_comment").text(comment);
    $newTr.find(".service_admin_comment").text(admin_comment);
    

    $newTr.removeAttr("style").removeClass("inactive_offer_template");

    return $newTr;

}


function new_offer_tr(key, name, comment) {
    var $newTr = $("#offer_service_table").find(".service_template");

    $newTr.find(".service_name").text(name);
    $newTr.find(".service_user_comment").text(comment);
    $newTr.find(".service_key").text(key);
    $newTr.removeClass("service_template").removeAttr("style");

    return $newTr;
}

function new_event_tr(key, client_name, date, time, duration, comment){
    var $newTr = $("#events_table").find(".event_template").clone(true, true, true, true, true, true);
    $newTr.find(".event_key").text(key);
    $newTr.find(".event_cl").text(client_name);
    $newTr.find(".date").text(date);
    $newTr.find(".time").text(time);
    $newTr.find(".duration").text(duration);
    $newTr.find(".comment").text(comment);
    $newTr.removeClass("event_template").removeAttr("style");
    
    return $newTr;
}


function form_edit_event(key, client, client_name, comment, event_date, event_time, duration) {
    var $form = $("#events_table").find(".event_edit").clone(true, true, true, true, true, true);
    $form.find("select#event_cl option").filter(function() { return $.trim( $(this).text() ) == $.trim(client); }).attr('selected',true);
    $form.find("input.comment").val(comment);
    $form.find("input.event_key").val(key);
    var now = new Date(Date.parse(event_date));
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    $form.find("input.date").val(today);
    
    var d = new Date();
    var time = event_time.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    d.setHours( parseInt(time[1]) + (time[3] ? 12 : 0) );
    d.setMinutes( parseInt(time[2]) || 0 );
    var h = d.getHours();
    var m = d.getMinutes();
    if(h < 10) h = '0' + h; 
    if(m < 10) m = '0' + m; 
    $form.find("input.time").val(h+':'+m);
    $form.find("input.duration").val(duration);
    $form.removeAttr("style").removeClass("event_edit");
    return $form;
}

function new_active_tr(key, name) {
    var $newTr = $("#active_service_table").find(".service_template").clone(true, true);
    $newTr.find("td.service_name").text(name);
    $newTr.find("td.service_key").text(key);
    $newTr.removeAttr("style").removeAttr("class");
    return $newTr;
}

function new_inactive_tr(key, name) {
    var $newTr = $("#inactive_service_table").find(".service_template").clone(true, true);
    $newTr.find("td.service_name").text(name);
    $newTr.find("td.service_key").text(key);
    $newTr.removeAttr("style").removeAttr("class");
    return $newTr;
}

function form_edit_active_service(key, name) {
    
    var $form = $("#active_service_table").find(".service_edit").clone(true, true);
    $form.removeAttr("style").removeClass("service_edit");
    $form.find("input.service_key").val(key);
    $form.find("input.service_name").val(name);
    $form.find("input.old_name").val(name);
    
    return $form;
}

function form_edit_inactive_service(key, name) {
    
    var $form = $("#inactive_service_table").find(".service_edit").clone(true, true);
    $form.removeAttr("style").removeClass("service_edit");
    $form.find("input.service_key").val(key);
    $form.find("input.service_name").val(name);
    $form.find("input.old_name").val(name);
    
    return $form;
}

function form_add_client_service(serviceKey, name) {
    
    var $form = $("#user_services_table").find(".client_service_add").clone(true, true);
    $form.removeClass("client_service_add").removeAttr("style");
    $form.find("input.service_key").val(serviceKey);
    $form.find("td.service_name").text(name);

    return $form;
}


function new_tr_service(key, name) {
    
    var $newTr =  $("#user_services_table").find(".service_template").clone(true, true);
    $newTr.find("td.service_key").text(key);
    $newTr.find("td.service_name").text(name);
    $newTr.removeAttr("style").removeAttr("class");
    
    return $newTr;

}


function new_tr_client_service(serviceKey, clientServiceKey, name, comment) {
    
    var $newTr = $("#user_services_table").find(".client_service_template").clone(true, true);
    $newTr.find("td.service_key").text(serviceKey);
    $newTr.find("td.client_service_key").text(clientServiceKey);
    $newTr.find("td.service_name").text(name);
    $newTr.find("td.service_comment").text(comment);
    $newTr.removeAttr("style").removeAttr("class");
    
    return $newTr;

}

function form_edit_client_service(serviceKey, clientServiceKey, name, comment) {
    var $form = $("#user_services_table").find(".client_service_edit").clone(true, true);
    $form.removeClass("client_service_edit").removeAttr("style");
    $form.find("input.service_key").val(serviceKey);
    $form.find("input.client_service_key").val(clientServiceKey);
    $form.find("input.old_comment").val(comment);
    $form.find("textarea.service_comment").val(comment);
    $form.find("td.service_name").text(name);
    
    return $form;

}