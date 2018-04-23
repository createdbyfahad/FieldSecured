if(document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', checkAutoFill);
}else{
	checkAutoFill();
}

var potentialFields = [];

// chrome.storage.local.clear(function() {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
// });

function checkAutoFill(e){
	// console.log("DOM is loadedd"); // making sure that the extension is working

	// for every input that get's changed and has the -webkit-autofill tag, 
	// make sure that the field is seen by the user while editing
	// it. Or at least the field is with the user's reach.

	// so if an input had been changed, in order to give it the
	// the "green" light of not being malicous, it needs to be seen
	// by the user for at least one time.

	// initially when a field is changed, added it to the red fields
	// list. and when the user sees it at least once, then added to green
	// list.

	// 1- check whether any previousely filled field is unseen
	//$("input").each(checkVisibility);

	// 2- then if any field is edited then make sure it's filled
	// $("input").on('change', checkVisibility);
	$("input").on('change', function(){
		if($(this).is(":-webkit-autofill")){
			checkVisibility(this);
		}
	});
	
	//$("input").is(":-webkit-autofill")
	$('form').submit(function(event) {
		if(checkForm(this)){
			return;
		}
		event.preventDefault();
	
	});

}

$.fn.isVisible = function() {
	// for viewport checking (within the page)
	var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    var elementLeft = $(this).offset().left;
    var elementRight = elementLeft + $(this).outerWidth();
    var viewportLeft = $(window).scrollLeft();
    var viewportRight = viewportLeft + $(window).width();

    var inView = elementRight > viewportLeft && elementLeft < viewportRight
     && elementBottom > viewportTop && elementTop < viewportBottom;

     // check for CSS fields opacity and visibility
     var opacityLimit = 0.5;
     // var opacity = ($(this).css('opacity') > opacityLimit);
     // var visibility = ($(this).css('visibility') == 'visible');
     var opacity = true;
     var visibility = true;
     var clip_path = true;

     $(this).parents().each(function() {
     	if($(this).css("opacity") < opacityLimit){
     		opacity = false;
     	}
     	if($(this).css("visibility") != "visible"){
     		visibility = false;
     	}
     	if($(this).css("clip-path") == "polygon(0px 0px,0px 0px,0px 0px,0px 0px)"){
     		clip_path = false;
     	}
     });
     // also check the element itself
     if($(this).css("opacity") < opacityLimit){
 		opacity = false;
     }
     if($(this).css("visibility") != "visible"){
 		visibility = false;
     }
     if($(this).css("clip-path") == "polygon(0px 0px,0px 0px,0px 0px,0px 0px)"){
 		clip_path = false;
     }
    return inView && opacity && visibility && clip_path;
};

function checkForm(form){

	var exist = false;
	potentialFields.forEach(function(element, index) {
		if(element.form.is(form)){
			exist = true;
		}
	});

	if(exist){
		// keep count of many times the uesr was saved from phishing
		var len = potentialFields.length;
		chrome.storage.local.get('total_fields', function (items){
			if(items["total_fields"] === undefined){
				total_fields = len;

			}else{
				total_fields = items["total_fields"] + len;
			}
			chrome.storage.local.set({'total_fields': total_fields});
		});
		// console.log("you are submitting hidden data!");
		// let text = "You are submitting these hidden data: " + potentialFields.length + " continue?";

		// if(! confirm(text)){
		// 	return false;
		// }

		let text = "<div style=\"color: red;\"> You are submitting these hidden data: <br/>";
		// console.log(potentialFields);
		potentialFields.forEach(function(element, index) {
			//console.log(element.field.val());
			text += "<span style=\"color: black;\">" + element.field.val() + "</span><br />";
		});
		text += "</br><a href=\"https://safebrowsing.google.com/safebrowsing/report_badware/\">STOP. And report this malicous website.</a> or <input class=\"do-not-block\" type=\"submit\" value=\"Contine anyway\" />";
		// show the message to the user
		var btn = $(form).find(':submit');
		btn.css("display", "none");
		btn.after(text);
		potentialFields = [];
		return false;
	}


	return true;
}

function checkVisibility(s){

	// The diffuclt part about knowing whether the field
	// is seen by the user or not is how to distinguesh bad
	// console.log('this field is being filled ' + $(s).val());

	// check whether the field is seen by the user or not.
	if(! $(s).isVisible() ){
		// console.log("this field is not seen by user");
		let form = $(s).closest('form');
		// create an event when the user tries to submit the form
		potentialFields.push({form: (form), field: $(s)});
	}
}

$(window).on('resize scoll', function() {
	// To make sure that the field has been seen by the user
	// after it was autofilled
	// For every 'bad' field in the list, check whether it's
	// in the view or not.

	newArr = potentialFields;
	potentialFields.forEach(function(element, index) {
		if($(element.field).isVisible()){
			// if is in view then delete it from the list
			// console.log("the input is now seen by the user");
			newArr.splice(index, 1);
		}
	});

	potentialFields = newArr;
});
