	
var current_object;

function is_empty(obj) {
	if (!obj || obj == "" || obj == "None")
		return true;
	return false;
}

$(document).ready(function() {
	//
	// Main menu handlers
	//
	$(".nav > li > a").click(function(e) {
	    e.preventDefault();
		
		// Show specific container
	   	$(".nav > li").removeClass("active");
		$(this).parent().addClass("active");	
	   	$(".inner").hide();
	   	container_id = $(this).attr("id") + "_container";
	   	$("#" + container_id).show();	

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
	$("#add_client").click(function(e) {
	    e.preventDefault();
	    client_name = $("#new_client_name").val();
	    client_comment = $("#new_client_comment").val();
		if (!client_name || client_name == "") {
		    alert("Client name can't be empty!");
		    return;
		}
		$.get("/object_add/", { object_type: "client", name: client_name, comment: client_comment }, function() {
			updateClientsList();
		});	
	    $("#new_client_name").val("");
	    $("#new_client_comment").val("");
	});
	//
	// deleting client
	$(document).on('click', 'a[class^="btn-small btn-warning delete_client"]', function(e){
		e.preventDefault();
		key = $(this).parent().parent().find('td:first').html();
		name = $(this).parent().parent().find('td')[1].innerHTML;
		comment = $(this).parent().parent().find('td')[2].innerHTML;
		active = "False";
		$.get("/object_update/", { object_type: "client", key: key, name: name, comment: comment, 
			active: active }, function() {
			updateClientsList();
	    }); 	
	});
	//
	// editing client
	$(document).on('click', 'a[class^="btn-small btn-warning edit_client"]', function(e){
		e.preventDefault();
		key = $(this).parent().parent().find('td:first').html();
		name = $("#new_client_name").val();
		comment = $("#new_client_comment").val();
		if (name == "") 
			name = $(this).parent().parent().find('td')[1].innerHTML;
		if (comment == "")
			comment = $(this).parent().parent().find('td')[2].innerHTML;
		active = "True";
		$.get("/object_update/", { object_type: "client", key: key, name: name, comment: comment, 
			active: active }, function() {
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
    for (var i = 0 ; i < list.length ; i++) {
        result += "<tr>";
		result += "<td style='display:none'>" + list[i]["key"] + "</td>";
        for (var j = 0 ; j < params.length ; j++) {
            var cellValue = list[i][params[j]];
            if (cellValue == null) { cellValue = ""; }
            result += "<td>" + cellValue + "</td>";
        }
		result += "<td>" + extra + "</td>";
        result += "</tr>";
    }
	return result;
}

function updateClientsList() {
	$.get("/object_list/", { object: "client" }, function(clients) {
			extra = "<a class='btn-small btn-warning delete_client' href='#' title='Delete client'> \
									<i class='icon-trash'></i></a> \
                     <a class='btn-small btn-warning edit_client' href='#' title='Edit client'> \
									<i class='icon-pencil'></i></a>";
			$("#clients_table tbody").html(buildHtmlTable(JSON.parse(clients), ["name", "comment"], extra));
	}); 		
}