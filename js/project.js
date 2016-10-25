var current_object;

function is_empty(obj) {
    if (!obj || obj == "" || obj == "None")
        return true;
    return false;
}

$(document).ready(function () {
    //
    // Main menu handlers
    //
    $(".nav#main_menu > li > a").click(function (e) {
        e.preventDefault();

        // Show specific container
        $(".nav#main_menu > li").removeClass("active");
        $(this).parent().addClass("active");
        $(".inner").hide();
        container_id = $(this).attr("id") + "_container";
        $("#" + container_id).show();

    });

    function strip_html(str) {
        var html = str;
        var div = document.createElement("div");
        div.innerHTML = html;
        return div.innerText;
    }

    //
    //
    //
    // ADMIN PAGE
    //
    //
    //




    //
    // Service tabs handlers
    //
    $(".nav#admin_service > li > a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $(".nav#offer_service > li > a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    //
    //
    // ADMIN OFFERS
    //
    //

    var $newOfferTable = $("#new_offer_table");
    var $withAnswerTable = $("#offer_with_answer_table");
    var $adminAnswerForm = $newOfferTable.find(".answer_offer_form");

    $withAnswerTable.find(".delete_service").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find(".service_key");
        var $nameTd = $thisTr.find(".service_name");
        var $userCommentTd = $thisTr.find(".service_user_comment");
        var $adminCommentTd = $thisTr.find(".service_admin_comment");

        var key = $keyTd.text();
        var name = $nameTd.text();
        var adminComment = $adminCommentTd.text();
        var userComment = $userCommentTd.text();

        var result = confirm("Вы действительно хотите удалить предложение?");

        if (!result)
            return;

        $.post("/object_update/", {
            object_type: "offer_service",
            key: key,
            name: "",
            user_comment: "",
            admin_comment: "",
            active: "False",
            admin_answer: "False"
        }, function () {
            var $newTr = new_inactive_offer_tr(key,name,userComment, adminComment);
            $newTr.prependTo("#inactive_offer_table tbody");
            $thisTr.remove();

        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            })

    });

    $newOfferTable.find(".delete_service").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find(".service_key");
        var $nameTd = $thisTr.find(".service_name");
        var $userCommentTd = $thisTr.find(".service_user_comment");
        var $adminCommentTd = $thisTr.find(".service_admin_comment");

        var key = $keyTd.text();
        var name = $nameTd.text();
        var adminComment = $adminCommentTd.text();
        var userComment = $userCommentTd.text();



        $.post("/object_update/", {
            object_type: "offer_service",
            key: key,
            name: "",
            user_comment: "",
            admin_comment: "",
            active: "False",
            admin_answer: "False"
        }, function () {
            var $newTr = new_inactive_offer_tr(key,name,userComment, adminComment);
            $newTr.prependTo("#inactive_offer_table tbody");
            $thisTr.remove();

        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            })

    });

    $newOfferTable.find(".answer_offer").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find(".service_key");
        var $nameTd = $thisTr.find(".service_name");
        var $commentTd = $thisTr.find(".service_user_comment");

        var key = $keyTd.text();
        var name = $nameTd.text();
        var comment = $commentTd.text();

        var $newTr = form_admin_comment(key,name,comment);

        $newTr.insertAfter($thisTr);
        
        $thisTr.remove();

    });

    $adminAnswerForm.find(".cancel_answer").click(function (e) {
        e.preventDefault();
        
        

        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find(".service_key");
        var $nameTd = $thisTr.find(".service_name");
        var $commentTd = $thisTr.find(".service_user_comment");

        var key = $keyTd.text();
        var name = $nameTd.text();
        var comment = $commentTd.text();

        var $newTr = new_admin_offer_tr(key,name,comment);

        $newTr.insertAfter($thisTr);
        
        $thisTr.remove();

        
    });

    $adminAnswerForm.find(".accept_answer").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find(".service_key");
        var $commentTd = $thisTr.find(".service_admin_comment");
        var $nameTd = $thisTr.find(".service_name");
        var $ucommentTd = $thisTr.find(".service_user_comment");

        var key = $keyTd.text();
        var name = $nameTd.text();
        var ucom = $ucommentTd.text();
        var comment = strip_html($commentTd.val());

        $.post("/object_update/", {
            object_type: "offer_service",
            key: key,
            name: "",
            user_comment: "",
            admin_comment: comment,
            active: "True",
            admin_answer: "True"
        }, function () {
            var $newTr = new_offer_with_comment(key,name, ucom, comment);
            $newTr.prependTo("#offer_with_answer_table tbody");
            $thisTr.remove();

        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            })


    });
    
    //
    //
    // ACTIVE SERVICE HANDLERS
    //
    //
    var $adminActiveTable = $("#active_service_table");
    var $editActiveService = $adminActiveTable.find(".service_edit");
    //
    // adding services
    $adminActiveTable.find(".add_service").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();

        var $nameTd = $thisTr.find(".service_name");
        var name = $nameTd.val();

        if (!name || name == "") {
            alert("Service name can't be empty!");
            return;
        }

        $.post("/object_add/", {object_type: "service", name: name, active: "True"}, function (data) {
            $nameTd.val("");

            var $newTr = new_active_tr(data, name);

            $newTr.prependTo("#active_service_table tbody");
        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            })

    });


    //
    // Delete service
    $adminActiveTable.find(".delete_service").click(function (e) {
        e.preventDefault();
        var result = confirm("Вы действительно хотите удалить эту услугу?");

        if (!result)
            return;
        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find("td.service_key");
        var $nameTd = $thisTr.find("td.service_name");

        var key = $keyTd.text();
        var name = $nameTd.text();
        var active = "False";
        $.post("/object_update/", {
            object_type: "service",
            key: key,
            name: name,
            active: active
        }, function () {

            $thisTr.remove();
            var $newTr = new_inactive_tr(key, name);
            $newTr.prependTo("#inactive_service_table tbody");

        }).fail(function () {
            alert("Упс, что-то пошло не так")
        })
    });

    //
    //
    $adminActiveTable.find(".edit_service").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find("td.service_key");
        var $nameTd = $thisTr.find("td.service_name");

        var key = $keyTd.text();
        var name = $nameTd.text();

        var $form = form_edit_active_service(key, name);

        $form.insertAfter($thisTr);

        $thisTr.remove();
    });


    //
    // Cancel edit
    $editActiveService.find(".cancel_edit").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $keyInput = $thisTr.find("input.service_key");
        var $nameInput = $thisTr.find("input.old_name");

        var key = $keyInput.val();
        var name = $nameInput.val();

        var $newTr = new_active_tr(key, name);

        $newTr.insertAfter($thisTr);

        $thisTr.remove();
    });

    //
    // Accept edit
    $editActiveService.find(".accept_edit").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $keyInput = $thisTr.find("input.service_key");
        var $nameInput = $thisTr.find("input.service_name");

        var key = $keyInput.val();
        var name = strip_html($nameInput.val());

        $.post("/object_update/", {
            object_type: "service",
            key: key,
            name: name,
            active: "True"
        }, function () {

            var $newTr = new_active_tr(key, name);
            $newTr.insertAfter($thisTr);
            $thisTr.remove();


        }).fail(function () {
            alert("Упс, что-то пошло не так")
        })

    });

    //
    //
    // INACTIVE HANDLERS
    //
    //

    var $adminInactiveTable = $("#inactive_service_table");
    var $editInactiveService = $adminInactiveTable.find(".service_edit");
    //
    // adding services
    $adminInactiveTable.find(".add_service").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();

        var $nameTd = $thisTr.find(".service_name");
        var name = $nameTd.val();

        if (!name || name == "") {
            alert("Service name can't be empty!");
            return;
        }

        $.post("/object_add/", {object_type: "service", name: name, active: "False"}, function (data) {
            $nameTd.val("");

            var $newTr = new_inactive_tr(data, name);

            $newTr.prependTo("#inactive_service_table tbody");
        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            })

    });


    //
    // Delete service
    $adminInactiveTable.find(".restore_service").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find("td.service_key");
        var $nameTd = $thisTr.find("td.service_name");

        var key = $keyTd.text();
        var name = $nameTd.text();
        var active = "True";
        $.post("/object_update/", {
            object_type: "service",
            key: key,
            name: name,
            active: active
        }, function () {

            $thisTr.remove();
            var $newTr = new_active_tr(key, name);
            $newTr.prependTo("#active_service_table tbody");

        }).fail(function () {
            alert("Упс, что-то пошло не так")
        })
    });

    //
    //
    $adminInactiveTable.find(".edit_service").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find("td.service_key");
        var $nameTd = $thisTr.find("td.service_name");

        var key = $keyTd.text();
        var name = $nameTd.text();

        var $form = form_edit_inactive_service(key, name);

        $form.insertAfter($thisTr);

        $thisTr.remove();
    });


    //
    // Cancel edit
    $editInactiveService.find(".cancel_edit").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $keyInput = $thisTr.find("input.service_key");
        var $nameInput = $thisTr.find("input.old_name");

        var key = $keyInput.val();
        var name = $nameInput.val();

        var $newTr = new_inactive_tr(key, name);

        $newTr.insertAfter($thisTr);

        $thisTr.remove();
    });

    //
    // Accept edit
    $editInactiveService.find(".accept_edit").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $keyInput = $thisTr.find("input.service_key");
        var $nameInput = $thisTr.find("input.service_name");

        var key = $keyInput.val();
        var name = strip_html($nameInput.val());

        $.post("/object_update/", {
            object_type: "service",
            key: key,
            name: name,
            active: "False"
        }, function () {

            var $newTr = new_inactive_tr(key, name);
            $newTr.insertAfter($thisTr);
            $thisTr.remove();


        }).fail(function () {
            alert("Упс, что-то пошло не так")
        })

    });

    //
    //
    // CLIENT SERVICE TUT
    //
    //

    //
    // OFFER SERVICE
    //

    var $offerServiceTable = $("#offer_service_table");

    $offerServiceTable.find(".add_service").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $nameTd = $thisTr.find(".service_name");
        var $commentTag = $thisTr.find(".service_comment");

        var name = $nameTd.val();
        var comment = $commentTag.val();

        if (!name || name == "") {
            alert("В поле \"Название\" должно быть что-то написано!");
            return;
        }

        $.post("/object_add/", {object_type: "offer_service", name: name, user_comment: comment}, function (data) {
            $nameTd.val("");
            $commentTag.val("");
            var $newTr = new_offer_tr(data, name, comment);

            $newTr.prependTo("#offer_service_table tbody");
        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            })

    });

    $offerServiceTable.find(".delete_service").click(function (e) {
        e.preventDefault();
        var result = confirm("Вы действительно хотите удалить предложение?");

        if (!result)
            return;
        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find(".service_key");

        var key = $keyTd.text();


        $.post("/object_update/", {
            object_type: "offer_service",
            key: key,
            name: "",
            user_comment: "",
            admin_comment: "",
            active: "False",
            admin_answer: "False"
        }, function () {
            $thisTr.remove();
        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            })

    });

    //
    // SERVICE
    //
    $(".nav#user_service > li > a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    var $userServiceTable = $("#user_services_table");
    var $addClientService = $userServiceTable.find(".client_service_add");
    var $editClientService = $userServiceTable.find(".client_service_edit");
    //
    // Add comment
    $userServiceTable.find(".add_client_service").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find("td.service_key");
        var $nameTd = $thisTr.find("td.service_name");

        var key = $keyTd.text();
        var name = $nameTd.text();

        var $newTr = form_add_client_service(key, name);

        $newTr.insertAfter($thisTr);
        $thisTr.remove();
    });


    $addClientService.find(".cancel_add").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find("input.service_key");
        var $nameTd = $thisTr.find("td.service_name");

        var key = $keyTd.val();
        var name = $nameTd.text();

        var $newTr = new_tr_service(key, name);

        $newTr.insertAfter($thisTr);
        $thisTr.remove();

    });

    $addClientService.find(".accept_add").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();

        var $keyTd = $thisTr.find("input.service_key");
        var $nameTd = $thisTr.find("td.service_name");
        var $commentTag = $thisTr.find("textarea.service_comment");

        var key = $keyTd.val();
        var name = strip_html($nameTd.text());
        var comment = strip_html($commentTag.val());



        $.post("/object_add/", {
            object_type: "client_service",
            service_key: key,
            comment: comment
        }, function (data) {
            var $newTr = new_tr_client_service(key, data, name, comment);

            $newTr.prependTo("#user_services_table tbody");

            $thisTr.remove();
        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            })


    });

    $userServiceTable.find(".edit_client_service").click(function (e) {
        e.preventDefault();

        var $thisTr = $(this).parent().parent();

        var $serviceKeyTd = $thisTr.find("td.service_key");
        var $clientServiceKeyTd = $thisTr.find("td.client_service_key");
        var $nameTd = $thisTr.find("td.service_name");
        var $commentTag = $thisTr.find("td.service_comment");

        var serviceKey = $serviceKeyTd.text();
        var clientServiceKey = $clientServiceKeyTd.text();
        var name = $nameTd.text();
        var comment = $commentTag.text();

        var $newTr = form_edit_client_service(serviceKey, clientServiceKey, name, comment);

        $newTr.insertAfter($thisTr);
        $thisTr.remove();

    });

    $userServiceTable.find(".delete_client_service").click(function (e) {
        e.preventDefault();
        var result = confirm("Вы действительно хотите удалить предоставляемую услугу?");

        if (!result)
            return;
        var $thisTr = $(this).parent().parent();

        var $serviceKeyTd = $thisTr.find("td.service_key");
        var $clientServiceKeyTd = $thisTr.find("td.client_service_key");
        var $nameTd = $thisTr.find("td.service_name");
        var $commentTag = $thisTr.find("td.service_comment");

        var serviceKey = $serviceKeyTd.text();
        var clientServiceKey = $clientServiceKeyTd.text();
        var name = $nameTd.text();
        var comment = $commentTag.text();

        $.post("/object_update/", {
            object_type: "client_service",
            key: clientServiceKey,
            comment: comment,
            active: "False"
        }, function () {

            var $newTr = new_tr_service(serviceKey, name);

            $newTr.insertAfter($userServiceTable.find('.empty_tr'));

            $thisTr.remove();
        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            });

    });


    $editClientService.find(".cancel_edit").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();

        var $serviceKeyTd = $thisTr.find("input.service_key");
        var $clientServiceKeyTd = $thisTr.find("input.client_service_key");
        var $nameTd = $thisTr.find("td.service_name");
        var $commentTag = $thisTr.find("input.old_comment");

        var serviceKey = $serviceKeyTd.val();
        var clientServiceKey = $clientServiceKeyTd.val();
        var name = $nameTd.text();
        var comment = $commentTag.val();

        var $newTr = new_tr_client_service(serviceKey, clientServiceKey, name, comment);

        $newTr.insertAfter($thisTr);
        $thisTr.remove();

    });

    $editClientService.find(".accept_edit").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();

        var $serviceKeyTd = $thisTr.find("input.service_key");
        var $clientServiceKeyTd = $thisTr.find("input.client_service_key");
        var $nameTd = $thisTr.find("td.service_name");
        var $commentTag = $thisTr.find("textarea.service_comment");

        var serviceKey = $serviceKeyTd.val();
        var clientServiceKey = $clientServiceKeyTd.val();
        var name = strip_html($nameTd.text());
        var comment = strip_html($commentTag.val());


        $.post("/object_update/", {
            object_type: "client_service",
            key: clientServiceKey,
            comment: comment,
            active: "True"
        }, function () {

            var $newTr = new_tr_client_service(serviceKey, clientServiceKey, name, comment);

            $newTr.insertAfter($thisTr);

            $thisTr.remove();
        })
            .fail(function () {
                alert("Упс, что-то пошло не так")
            })


    });


    //
    //
    //
    // Clients Tab
    //
    //
    //

    //
    // adding client
    $("#add_client").click(function (e) {
        e.preventDefault();
        client_name = $("#new_client_name").val();
        client_comment = $("#new_client_comment").val();
        if (!client_name || client_name == "") {
            alert("Client name can't be empty!");
            return;
        }
        $.get("/object_add/", {object_type: "client", name: client_name, comment: client_comment}, function () {
            updateClientsList();
        });
        $("#new_client_name").val("");
        $("#new_client_comment").val("");
    });
    //
    // deleting client
    $(document).on('click', 'a[class^="btn-small btn-warning delete_client"]', function (e) {
        e.preventDefault();
        key = $(this).parent().parent().find('td:first').html();
        name = $(this).parent().parent().find('td')[1].innerHTML;
        comment = $(this).parent().parent().find('td')[2].innerHTML;
        active = "False";
        $.get("/object_update/", {
            object_type: "client", key: key, name: name, comment: comment,
            active: active
        }, function () {
            updateClientsList();
        });
    });
    //
    // editing client
    $(document).on('click', 'a[class^="btn-small btn-warning edit_client"]', function (e) {
        e.preventDefault();
        key = $(this).parent().parent().find('td:first').html();
        name = $("#new_client_name").val();
        comment = $("#new_client_comment").val();
        if (name == "")
            name = $(this).parent().parent().find('td')[1].innerHTML;
        if (comment == "")
            comment = $(this).parent().parent().find('td')[2].innerHTML;
        active = "True";
        $.get("/object_update/", {
            object_type: "client", key: key, name: name, comment: comment,
            active: active
        }, function () {
            updateClientsList();
        });
        $("#new_client_name").val("");
        $("#new_client_comment").val("");
    });

    // after everything is loaded, display the page
    $("#all_content").show();
});

//
//
//      Functions
//
//

function buildHtmlTable(list, params, extra) {
    result = "";
    for (var i = 0; i < list.length; i++) {
        result += "<tr>";
        result += "<td style='display:none'>" + list[i]["key"] + "</td>";
        for (var j = 0; j < params.length; j++) {
            var cellValue = list[i][params[j]];
            if (cellValue == null) {
                cellValue = "";
            }
            result += "<td>" + cellValue + "</td>";
        }
        result += "<td>" + extra + "</td>";
        result += "</tr>";
    }
    return result;
}

function updateClientsList() {
    $.get("/object_list/", {object: "client"}, function (clients) {
        extra = "<a class='btn-small btn-warning delete_client' href='#' title='Delete client'> \
									<i class='icon-trash'></i></a> \
                     <a class='btn-small btn-warning edit_client' href='#' title='Edit client'> \
									<i class='icon-pencil'></i></a>";
        $("#clients_table tbody").html(buildHtmlTable(JSON.parse(clients), ["name", "comment"], extra));
    });
}