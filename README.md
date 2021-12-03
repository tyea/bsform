# BsForm

## About

BsForm is a jQuery plugin for building AJAX driven Bootstrap forms.

## Installation

```
yarn add https://github.com/tyea/bsform.git#1.0.1
```

## Requirements

* jQuery 2
* Bootstrap 3

## Example

```
<div id="form"></div>
<script>
	$(document).ready(function () {
		$("#form").bsForm({
			fields: [
				{
					type: "TEXT",
					label: "First Name",W
					name: "first_name"
				},
				{
					type: "TEXT",
					label: "Last Name",
					name: "last_name"
				},
				{
					type: "EMAIL",
					label: "Email Address",
					name: "email_address"
				}
			],
			buttons: [
				{
					type: "SUBMIT",
					text: "Submit"
				}
			],
			submit: {
				method: "POST",
				url: "/post.php",
				success: function (form, data) {
					alert("Success");
				}
			}
		});
	});
</script>
```

## Options

* `fields`
	* `TEXT`
	* `EMAIL`
	* `URL`
	* `PASSWORD`
	* `NUMBER`
	* `DATE`
	* `TIME`
	* `DATETIME`
	* `TEXTAREA`
	* `SELECT`
	* `RADIO`
	* `CHECKBOX`
	* `HIDDEN`
	* `STATIC`
* `buttons`
	* `SUBMIT`
	* `BUTTON`
	* `A`
* `ready`
* `load`
	* `method`
	* `url`
	* `before`
	* `success`
	* `error`
* `submit`
	* `method`
	* `url`
	* `before`
	* `success`
	* `error`

## Author

Written by Tom Yeadon in November 2021.