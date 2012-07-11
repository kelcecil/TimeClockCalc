var intervalNumber = 0;

// Time data structure
Time = function(hour,minute,ampm) {
    this.hour = hour,
    this.minute = minute,
    this.ampm = ampm
};

TimeInterval = function(from,to) {
    this.from = from,
    this.to = to
}

$(document).ready(function () {
                  if (hasScheduleStoredInLocalStorage()) {
                    loadFromLocalStorage();
                  } else{
                    addAnInterval();
                  }
      
    });

function addAnInterval(fhour,fminute,fampm,thour,tminute,tampm) {

    if (fhour === undefined) {
        fhour = "";
    }
    if (fminute === undefined) {
        fminute = "";
    }
    if (fampm === undefined) {
        fampm = "AM";
    }
    if (thour === undefined) {
        thour = "";
    }
    if (tminute === undefined) {
        tminute = "";
    }
    if (tampm === undefined) {
        tampm = "AM";
    }

    var currentDate = new Date();

    //Add a time interval using jQuery

    //Prepare the month selects
    /*var Months = ["Jan","Feb","Mar","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];
    var monthString = "";

    var thisMonth = currentDate.getMonth();

    for (month in Months) {
	var index = Months.indexOf(Months[month]);
	monthString = monthString + "<option value=\"" +index+ "\"";
	if (thisMonth == index) {
	    monthString = monthString + " selected>"
	}
	else {
	    monthString = monthString + ">";
	}
	monthString = monthString + Months[month] + "</option>";
    }
    var fromMonth = "<select id=\"fromMonth\">"+monthString+"</select>";
    var toMonth = "<select id=\"toMonth\">"+monthString+"</select>";

    var fromDay = "<select id=\"fromDay\"></select>";
    var toDay = "<select id=\"toDay\"></select>";

    var fromYear = "<input maxlength=\"4\" size=\"4\" type=\"text\" id=\"fromYear\" value=\""+currentDate.getFullYear()+"\" />";
    var toYear = "<input maxlength=\"4\" size=\"4\" type=\"text\" id=\"toYear\" value=\""+currentDate.getFullYear()+"\" />";
    */
    
    var toHour = "<input class=\"input-mini\" maxlength=\"2\" size=\"2\" type=\"text\" id=\"toHour\" value=\""+thour+"\" />";
    var toMinute = "<input class=\"input-mini\" maxlength=\"2\" size=\"2\" type=\"text\" id=\"toMinute\" value=\""+tminute+"\" />";
    var toAMPM = "<select class=\"span2\" id=\"toAMPM\">"+generateAMPMOptionHTML(tampm)+"</select>"
    
    
    var toString = toHour+":"+toMinute+toAMPM;
    
    var fromHour = "<input class=\"input-mini\" maxlength=\"2\" size=\"2\" type=\"text\" id=\"fromHour\" value=\""+fhour+"\" />"
    var fromMinute = "<input class=\"input-mini\" maxlength=\"2\" size=\"2\" type=\"text\" id=\"fromMinute\" value=\""+fminute+"\" />";
    var fromAMPM = "<select class=\"span2\" id=\"fromAMPM\">"+generateAMPMOptionHTML(fampm)+"</select>"
    
    var fromString = fromHour+":"+fromMinute+fromAMPM;

    var removeString = "<button class=\"btn\" type=\"button\" id=\"remove\">Remove Interval</button>"

    var divString = "<div class=\"input-append\" id=\"interval"+intervalNumber+"\">"+fromString+" to "+toString+removeString+"</div>";
    $("div#intervals").append(divString);
    $("input").keyup(function () {
	    computeElapsedTime();
	});
    $("select").change(function () {
	    computeElapsedTime();
	});
    

    $("div#intervals>#interval"+intervalNumber+">#fromMonth").change(function () {
            onDateOrYearChange($(this).parent().children("#fromDay"),$(this).parent().children("#fromMonth"),$(this).parent().children("#fromYear"));
	});
    $("div#intervals>#interval"+intervalNumber+">#toMonth").change(function () {
	    onDateOrYearChange($(this).parent().children("#toDay"),$(this).parent().children("#toMonth"),$(this).parent().children("#toYear"));
        });
    $("div#intervals>#interval"+intervalNumber+">#remove").click(function () {
	    removeAnInterval($(this).parent());
	});
    intervalNumber++;
    computeElapsedTime();
}

function generateAMPMOptionHTML(ampm) {
    var optionMarkup = "";
    var choices = ["AM","PM"];
    for (choice in choices) {
        optionMarkup = optionMarkup + "<option value=\""+choices[choice]+"\"";
        if (choices[choice] == ampm) {
            optionMarkup = optionMarkup + " selected";
        }
        optionMarkup = optionMarkup + ">"+choices[choice]+"</option>";
    }
    return optionMarkup;
    
}

function hasScheduleStoredInLocalStorage() {
    if (localStorage.getItem("tcc-schedule") == null)
        return false;
    else
        return true;
}



function loadFromLocalStorage() {
    var data = JSON.parse(localStorage.getItem("tcc-schedule"));
    for (interval in data.intervals) {
        var from = data.intervals[interval].from;
        var to = data.intervals[interval].to;
        addAnInterval(from.hour,from.minute,from.ampm,to.hour,to.minute,to.ampm);
    }
}

function saveToLocalStorage() {
    var intervals = {intervals: []};
    $.each( $("#intervals>div"), function(index,value) {
	    var from = new Time( $(this).children("#fromHour").val(), $(this).children("#fromMinute").val(), $(this).children("#fromAMPM").val());
	    var to = new Time( $(this).children("#toHour").val(), $(this).children("#toMinute").val(), $(this).children("#toAMPM").val());
	    intervals.intervals.push(new TimeInterval(from,to));
	});
    localStorage.setItem("tcc-schedule",JSON.stringify(intervals));
}

function removeFromLocalStorage() {
    
    localStorage.removeItem("tcc-schedule");
    
}

function onDateOrYearChange(divTitle,divMonth,divYear) {
    $(divTitle).html( updateDateSelect( $(divMonth).val(),1, $(divYear).val()));
}

function daysInMonth(year,month) {
    return new Date(year,month,0).getDate();
}

//Month and year should be strings, and month is 1-based.
function updateDateSelect(month,day,year) {
    var daysInTheMonth = daysInMonth(year,parseInt(month)+1);
    var dateString = "";
    for (var i=1;i<=daysInTheMonth;i++) {
	dateString = dateString + "<option value=\""+i+"\">"+i+"</option>";
    }
    return dateString;

}

function promptRemoveAllDialog() {
    $("#removeallwarn").dialog({ buttons: { "Continue": function() {
                                            removeAllIntervals();
                                            removeFromLocalStorage();
                                            $(this).dialog("close");
                                            },
                                            "Cancel": function () {
                                            $(this).dialog("close");
                                            }}});
}

function removeAllIntervals() {

    $.each( $("#intervals>div"), function (index,value) {
           $(this).remove();
    });  
    addAnInterval();
    computeElapsedTime();
    setResult("0 minutes");

}



function removeAnInterval(domItem) {
    //Remove a time interval using jQuery
    if ( $("#intervals>div").length > 1 ) {
	domItem.remove();
	computeElapsedTime();
    }
}

function computeElapsedTime() {

    var hoursSpent = 0;
    var minutesSpent = 0;

    //Use jQuery forEach to get each of the time intervals.
    $.each( $("#intervals>div"), function(index,value) {

	    if ( $(this).children("#fromHour").val() == "" ||
		 $(this).children("#toHour").val() == "" ||
		 $(this).children("#fromMinute").val() == "" ||
		 $(this).children("#toMinute").val() == "" ) {
		console.log($(this).children("#fromHour").val());
		return;
	    }

	    var fromHour = parseInt( $(this).children("#fromHour").val() );
	    var fromMinute = parseInt( $(this).children("#fromMinute").val() );
	    var fromAMPM = $(this).children("#fromAMPM").val();
	    
	    /*
	    var fromMonth = parseInt( $(this).children("#fromMonth").val() );
	    var fromDay = parseInt( $(this).children("#fromDay").val() );
	    var fromYear = parseInt( $(this).children("#fromYear").val() );
	    */

	    var toHour = parseInt( $(this).children("#toHour").val() );
	    var toMinute = parseInt( $(this).children("#toMinute").val() );
	    var toAMPM = $(this).children("#toAMPM").val();

	    /*
	    var toMonth = parseInt( $(this).children("#toMonth").val() );
	    var toDay = parseInt( $(this).children("#toDay").val() );
	    var toYear = parseInt( $(this).children("#toYear").val() );
	    */

      	    var minuteDelta;
	    var hourDelta;
	    
	    
	    //var dayDelta;
	    //var monthDelta;
	    //var yearDelta;
	    

	    if (toMinute < fromMinute) {
		toHour--;
		toMinute = toMinute + 60;
	    }
	    minuteDelta = toMinute - fromMinute;
	    
	    if (toAMPM == "PM")
		toHour = toHour + 12;
	    if (fromAMPM == "PM")
		fromHour = fromHour + 12;

	    if (toHour < fromHour) {
		toHour = toHour + 24;
	    }

	    hourDelta = toHour - fromHour;

	    minutesSpent = minutesSpent + minuteDelta;
	    hoursSpent = hoursSpent + hourDelta;
	    
	});
    
    if (minutesSpent >= 60) {
	hoursSpent = hoursSpent + parseInt(minutesSpent / 60);
	minutesSpent = minutesSpent - (parseInt(minutesSpent / 60) * 60);
    }
    
    if (hoursSpent == 0 && minutesSpent == 0) {
	return;
    } else {
        setResult(hoursSpent+" hours, "+minutesSpent+ " minutes");
        saveToLocalStorage();
    }
}

function setResult(text) {
    
    $("#result").html(text);
    
}

 var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-33299540-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
