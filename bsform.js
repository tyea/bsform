$.fn.bsForm = function (options) {
	options = $.bsForm.defaults(options);
	$(this).each(function (i, wrapper) {
		wrapper = $(wrapper);
		$.bsForm.init(wrapper, options);
	});
};

// -----------------------------------------------------------------------------

$.bsForm = {};

// -----------------------------------------------------------------------------

$.bsForm.defaults = function (options) {
	if (!options.hasOwnProperty("buttons")) {
		options.buttons = [
			{
				type: "SUBMIT",
				text: "Submit"
			}
		];
	}
	if (!options.hasOwnProperty("ready")) {
		options.ready = $.bsForm.ready;
	}
	if (!options.hasOwnProperty("load")) {
		options.load = null;
	}
	if (options.load) {
		if (!options.load.hasOwnProperty("before")) {
			options.load.before = $.bsForm.loadBefore;
		}
		if (!options.load.hasOwnProperty("success")) {
			options.load.success = $.bsForm.loadSuccess;
		}
		if (!options.load.hasOwnProperty("error")) {
			options.load.error = $.bsForm.loadError;
		}
	}
	if (!options.hasOwnProperty("submit")) {
		options.submit = null;
	}
	if (options.submit) {
		if (!options.submit.hasOwnProperty("before")) {
			options.submit.before = $.bsForm.submitBefore
		}
		if (!options.submit.hasOwnProperty("error")) {
			options.submit.error = $.bsForm.submitError;
		}
	}
	return options;
};

// -----------------------------------------------------------------------------

$.bsForm.init = function (wrapper, options) {
	var html = $.bsForm.create(options);
	wrapper.html(html);
	var form = wrapper.find("form");
	options.ready(form, options);
	if (options.load) {
		$.bsForm.load(form, options);
	}
	if (options.submit) {
		form.submit(function (event) {
			event.preventDefault();
			$.bsForm.submit(form, options);
		});
	}
};

// -----------------------------------------------------------------------------

$.bsForm.create = function (options) {
	var html = "";
	html += "<form id=\"" + $.bsForm.escape($.bsForm.uniqueId()) + "\">";
	html += "<div class=\"alert alert-danger\" style=\"display: none;\"></div>";
	html += "<fieldset>";
	$.each(options.fields, function (i, field) {
		html += $.bsForm.fields[field.type](field);
	});
	html += "<div class=\"form-group\">";
	$.each(options.buttons, function (j, button) {
		html += $.bsForm.buttons[button.type](button);
		html += " ";
	});
	html += "</div>";
	html += "</fieldset>";
	html += "</form>";
	return html;
};

// -----------------------------------------------------------------------------

$.bsForm.counter = 0;

$.bsForm.uniqueId = function () {
	var id = "bsform-" + $.bsForm.counter;
	$.bsForm.counter += 1;
	return id;
};

// -----------------------------------------------------------------------------

$.bsForm.escape = function (input) {
	return input.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
};

// -----------------------------------------------------------------------------

$.bsForm.fields = {};

$.bsForm.fields.TEXT = function (options) {
	if (!options.hasOwnProperty("id")) {
		options.id = $.bsForm.uniqueId();
	}
	if (!options.hasOwnProperty("placeholder")) {
		options.placeholder = options.label;
	}
	var html = "";
	html += "<div class=\"form-group\">";
	html += "<label for=\"" + $.bsForm.escape(options.id) + "\">" + $.bsForm.escape(options.label) + "</label>";
	html += "<input type=\"text\" class=\"form-control\" name=\"" + $.bsForm.escape(options.name) + "\" id=\"" + $.bsForm.escape(options.id) + "\" placeholder=\"" + $.bsForm.escape(options.placeholder) + "\">";
	html += "<p class=\"help-block\"><span class=\"text-danger\"></span></p>";
	html += "</div>";
	return html;
}

$.bsForm.fields.EMAIL = function (options) {
	var html = $.bsForm.fields.TEXT(options);
	return html.replace("<input type=\"text\"", "<input type=\"email\"", html);
}

$.bsForm.fields.URL = function (options) {
	var html = $.bsForm.fields.TEXT(options);
	return html.replace("<input type=\"text\"", "<input type=\"url\"", html);
}

$.bsForm.fields.PASSWORD = function (options) {
	var html = $.bsForm.fields.TEXT(options);
	return html.replace("<input type=\"text\"", "<input type=\"password\"", html);
}

$.bsForm.fields.NUMBER = function (options) {
	var min = "";
	if (options.hasOwnProperty("min")) {
		min = "min=\"" + $.bsForm.escape(options.min) + "\"";
	}
	var max = "";
	if (options.hasOwnProperty("max")) {
		max = "max=\"" + $.bsForm.escape(options.max) + "\"";
	}
	var step = "";
	if (options.hasOwnProperty("step")) {
		step = "step=\"" + $.bsForm.escape(options.step) + "\"";
	}
	var html = $.bsForm.fields.TEXT(options);
	return html.replace("<input type=\"text\"", "<input type=\"number\" " + min + " " + max + " " + step, html);
}

$.bsForm.fields.DATE = function (options) {
	if (!options.hasOwnProperty("id")) {
		options.id = $.bsForm.uniqueId();
	}
	var html = "";
	html += "<div class=\"form-group\">";
	html += "<label for=\"" + $.bsForm.escape(options.id) + "\">" + $.bsForm.escape(options.label) + "</label>";
	html += "<input type=\"date\" class=\"form-control\" name=\"" + $.bsForm.escape(options.name) + "\" id=\"" + $.bsForm.escape(options.id) + "\" value=\"" + $.bsForm.date() + "\">";
	html += "<p class=\"help-block\"><span class=\"text-danger\"></span></p>";
	html += "</div>";
	return html;
}

$.bsForm.fields.TIME = function (options) {
	if (!options.hasOwnProperty("id")) {
		options.id = $.bsForm.uniqueId();
	}
	var html = "";
	html += "<div class=\"form-group\">";
	html += "<label for=\"" + $.bsForm.escape(options.id) + "\">" + $.bsForm.escape(options.label) + "</label>";
	html += "<input type=\"time\" class=\"form-control\" name=\"" + $.bsForm.escape(options.name) + "\" id=\"" + $.bsForm.escape(options.id) + "\" step=\"1\" value=\"" + $.bsForm.time() + "\">";
	html += "<p class=\"help-block\"><span class=\"text-danger\"></span></p>";
	html += "</div>";
	return html;
}

$.bsForm.fields.DATETIME = function (options) {
	if (!options.hasOwnProperty("id")) {
		options.id = $.bsForm.uniqueId();
	}
	var html = "";
	html += "<div class=\"form-group\">";
	html += "<label for=\"" + $.bsForm.escape(options.id) + "\">" + $.bsForm.escape(options.label) + "</label>";
	html += "<div class=\"row\">";
	html += "<div class=\"col-xs-6 col-md-3\">";
	html += "<input type=\"date\" class=\"form-control\" id=\"" + $.bsForm.escape(options.id) + "-date\" value=\"" + $.bsForm.date() + "\">";
	html += "</div>";
	html += "<div class=\"col-xs-6 col-md-3\">";
	html += "<input type=\"time\" class=\"form-control\" id=\"" + $.bsForm.escape(options.id) + "-time\" step=\"1\" value=\"" + $.bsForm.time() + "\">";
	html += "</div>";
	html += "</div>";
	html += "<p class=\"help-block\"><span class=\"text-danger\"></span></p>";
	html += "<input type=\"hidden\" name=\"" + $.bsForm.escape(options.name) + "\" id=\"" + $.bsForm.escape(options.id) + "\" value=\"" + $.bsForm.datetime() + "\">";
	html += "<script>";
	html += "$(document).ready(function () {";
	html += "var date = $(\"#" + options.id + "-date\");";
	html += "var time = $(\"#" + options.id + "-time\");";
	html += "var datetime = $(\"#" + options.id + "\");";
	html += "datetime.change(function () {";
	html += "var value = datetime.val().split(\" \");";
	html += "date.val(value[0]);";
	html += "time.val(value[1]);";
	html += "});";
	html += "date.change(function () {";
	html += "var value = date.val() + \" \" + time.val();";
	html += "datetime.val(value);";
	html += "});";
	html += "time.change(function () {";
	html += "var value = date.val() + \" \" + time.val();";
	html += "datetime.val(value);";
	html += "});";
	html += "});";
	html += "</script>";
	html += "</div>";
	return html;
}

$.bsForm.fields.TEXTAREA = function (options) {
	if (!options.hasOwnProperty("id")) {
		options.id = $.bsForm.uniqueId();
	}
	if (!options.hasOwnProperty("rows")) {
		options.rows = "4";
	}
	if (!options.hasOwnProperty("placeholder")) {
		options.placeholder = options.label;
	}
	var html = "";
	html += "<div class=\"form-group\">";
	html += "<label for=\"" + $.bsForm.escape(options.id) + "\">" + $.bsForm.escape(options.label) + "</label>";
	html += "<textarea class=\"form-control\" name=\"" + $.bsForm.escape(options.name) + "\" id=\"" + $.bsForm.escape(options.id) + "\" rows=\"" + $.bsForm.escape(options.rows) + "\" placeholder=\"" + $.bsForm.escape(options.placeholder) + "\"></textarea>";
	html += "<p class=\"help-block\"><span class=\"text-danger\"></span></p>";
	html += "</div>";
	return html;
}

$.bsForm.fields.SELECT = function (options) {
	if (!options.hasOwnProperty("id")) {
		options.id = $.bsForm.uniqueId();
	}
	var html = "";
	html += "<div class=\"form-group\">";
	html += "<label for=\"" + $.bsForm.escape(options.id) + "\">" + $.bsForm.escape(options.label) + "</label>";
	html += "<select class=\"form-control\" name=\"" + $.bsForm.escape(options.name) + "\" id=\"" + $.bsForm.escape(options.id) + "\">";
	$.each(options.options, function (i, option) {
		html += "<option value=\"" + $.bsForm.escape(option.value) + "\">" + $.bsForm.escape(option.text) + "</option>";
	});
	html += "</select>";
	html += "<p class=\"help-block\"><span class=\"text-danger\"></span></p>";
	html += "</div>";
	return html;
}

$.bsForm.fields.RADIO = function (options) {
	var html = "";
	html += "<div class=\"form-group\">";
	html += "<label>" + $.bsForm.escape(options.label) + "</label>";
	$.each(options.options, function (i, option) {
		html += "<div class=\"radio\">";
		html += "<label>";
		html += "<input type=\"radio\" name=\"" + $.bsForm.escape(options.name) + "\" value=\"" + $.bsForm.escape(option.value) + "\"> " + $.bsForm.escape(option.text);
		html += "</label>";
		html += "</div>";
	});
	html += "</div>";
	html += "<p class=\"help-block\"><span class=\"text-danger\"></span></p>";
	html += "</div>";
	return html;
}

$.bsForm.fields.CHECKBOX = function (options) {
	if (!options.hasOwnProperty("id")) {
		options.id = $.bsForm.uniqueId();
	}
	if (!options.hasOwnProperty("text")) {
		options.text = "Yes";
	}
	var html = "";
	html += "<div class=\"form-group\">";
	html += "<label>" + $.bsForm.escape(options.label) + "</label>";
	html += "<div class=\"checkbox\">";
	html += "<label for=\"" + $.bsForm.escape(options.id) + "\">";
	html += "<input type=\"checkbox\" name=\"" + $.bsForm.escape(options.name) + "\" id=\"" + $.bsForm.escape(options.id) + "\" value=\"true\"> " + $.bsForm.escape(options.text);
	html += "</label>";
	html += "</div>";
	html += "<p class=\"help-block\"><span class=\"text-danger\"></span></p>";
	html += "</div>";
	return html;
}

$.bsForm.fields.HIDDEN = function (options) {
	if (!options.hasOwnProperty("id")) {
		options.id = $.bsForm.uniqueId();
	}
	if (!options.hasOwnProperty("value")) {
		options.value = "";
	}
	return "<input type=\"hidden\" name=\"" + $.bsForm.escape(options.name) + "\" id=\"" + $.bsForm.escape(options.id) + "\" value=\"" + $.bsForm.escape(options.value) + "\">";
}

$.bsForm.fields.STATIC = function (options) {
	if (!options.hasOwnProperty("name")) {
		options.name = "";
	}
	if (!options.hasOwnProperty("value")) {
		options.value = "";
	}
	var html = "";
	html += "<div class=\"form-group\">";
	html += "<label>" + $.bsForm.escape(options.label) + "</label>";
	html += "<p class=\"form-control-static\">" + $.bsForm.escape(options.value) + "</p>";
	html += "</div>";
	return html;
}

// -----------------------------------------------------------------------------

$.bsForm.date = function () {
	return (new Date()).toISOString().split("T")[0];
};

$.bsForm.time = function () {
	return (new Date()).toLocaleTimeString();
};

$.bsForm.datetime = function () {
	return $.bsForm.date() + " " + $.bsForm.time();
};

// -----------------------------------------------------------------------------

$.bsForm.buttons = {};

$.bsForm.buttons.SUBMIT = function (options) {
	return "<button type=\"submit\" class=\"btn btn-primary\">" + $.bsForm.escape(options.text) + "</button>";
}

$.bsForm.buttons.BUTTON = function (options) {
	var id = "";
	if (options.hasOwnProperty("id")) {
		id = "id=\"" + $.bsForm.escape(options.id) + "\"";
	}
	return "<button type=\"button\" class=\"btn btn-default\" " + id + ">" + $.bsForm.escape(options.text) + "</button>";
}

$.bsForm.buttons.A = function (options) {
	var target = "";
	if (options.hasOwnProperty("target")) {
		target = "target=\"" + $.bsForm.escape(options.target) + "\"";
	}
	return "<a href=\"" + $.bsForm.escape(options.href) + "\" " + target + " class=\"btn btn-default\">" + $.bsForm.escape(options.text) + "</a>";
}

// -----------------------------------------------------------------------------

$.bsForm.ready = function (form, options) {
};

// -----------------------------------------------------------------------------

$.bsForm.load = function (form, options) {
	var fieldset = form.find("fieldset");
	fieldset.attr("disabled", "disabled");
	var alert = form.find(".alert");
	$.ajax({
		method: options.load.method,
		url: options.load.url,
		success: function (responseJSON) {
			var data = {};
			if (responseJSON.hasOwnProperty("data")) {
				data = responseJSON.data;
			}
			data = options.load.before(form, data);
			options.load.success(form, data);
			fieldset.removeAttr("disabled");
		},
		error: function (jqXhr) {
			alert.text("Whoops, something went wrong!").show();
			var errors = [];
			if (jqXhr.hasOwnProperty("responseJSON") && jqXhr.responseJSON.hasOwnProperty("errors")) {
				errors = jqXhr.responseJSON.errors;
			}
			options.load.error(form, errors);
		}
	});
};

// -----------------------------------------------------------------------------

$.bsForm.loadBefore = function (form, data) {
	return data;
};

$.bsForm.loadSuccess = function (form, data) {
	$.each(data, function (name, value) {
		var field = form.find("[name=\"" + $.bsForm.escape(name) + "\"]");
		if (field.length) {
			var type = field.prop("tagName");
			$.bsForm.loaders[type](field, name, value);
		}
	});
};

$.bsForm.loadError = function (form, errors) {
};

// -----------------------------------------------------------------------------

$.bsForm.loaders = {};

$.bsForm.loaders.INPUT = function (field, name, value) {
	var type = field.attr("type").toUpperCase();
	switch (type) {
		case "TEXT":
		case "EMAIL":
		case "URL":
		case "PASSWORD":
		case "NUMBER":
		case "DATE":
		case "TIME":
			$.bsForm.loaders.TEXT(field, name, value);
			break;
		case "RADIO":
			$.bsForm.loaders.RADIO(field, name, value);
			break;
		case "CHECKBOX":
			$.bsForm.loaders.CHECKBOX(field, name, value);
			break;
		case "HIDDEN":
			$.bsForm.loaders.HIDDEN(field, name, value);
			break;
	}
};

$.bsForm.loaders.TEXT = function (field, name, value) {
	field.val(value);
};

$.bsForm.loaders.RADIO = function (fields, name, value) {
	var field = fields.find("[value=\"" + $.bsForm.escape(value) + "\"]");
	if (field) {
		input.attr("checked", "checked");
	}
};

$.bsForm.loaders.CHECKBOX = function (field, name, value) {
	if (value) {
		field.attr("checked", "checked");
	}
};

$.bsForm.loaders.HIDDEN = function (field, name, value) {
	field.val(value).trigger("change");
};

$.bsForm.loaders.TEXTAREA = function (field, name, value) {
	field.val(value);
};

$.bsForm.loaders.SELECT = function (field, name, value) {
	var option = field.find("option[value=\"" + $.bsForm.escape(value) + "\"]");
	if (option) {
		option.attr("selected", "selected");
	}
};

// -----------------------------------------------------------------------------

$.bsForm.submit = function (form, options) {
	var fields = form.serializeArray();
	var data = {};
	$.each(fields, function (i, field) {
		data[field.name] = field.value;
	});
	data = options.submit.before(form, data);
	var fieldset = form.find("fieldset");
	fieldset.attr("disabled", "disabled");
	var alert = form.find(".alert");
	alert.html("").hide();
	var helps = form.find(".help-block span");
	helps.html("");
	$.ajax({
		method: options.submit.method,
		url: options.submit.url,
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function (responseJSON) {
			var data = {};
			if (responseJSON.hasOwnProperty("data")) {
				data = responseJSON.data;
			}
			options.submit.success(form, data);
		},
		error: function (jqXhr) {
			alert.text("Whoops, something went wrong!").show();
			var errors = [];
			if (jqXhr.hasOwnProperty("responseJSON") && jqXhr.responseJSON.hasOwnProperty("errors")) {
				errors = jqXhr.responseJSON.errors;
			}
			options.submit.error(form, errors);
			fieldset.removeAttr("disabled");
		}
	});
};

// -----------------------------------------------------------------------------

$.bsForm.submitBefore = function (form, data) {
	return data;
};

$.bsForm.submitError = function (form, errors) {
	$.each(errors, function (name, error) {
		var field = form.find("[name=\"" + $.bsForm.escape(name) + "\"]").first();
		var help = field.closest(".form-group").find(".help-block span");
		help.text(error);
	});
};