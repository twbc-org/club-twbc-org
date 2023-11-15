jQuery(function($) {
    var in_list = function(v, l){
        return (l.indexOf(v) >= 0)
    }

    var manage_choice_field = function(){
        var $dd = $(this); // drop-down
    	var selected_value = $dd.find(":selected").val();
    	var selected_text = $dd.find(":selected").text();
    	var fieldset = $dd.parents(".dynamic-fields");

        triggers = ['ChoiceField',
                    'BooleanField',
                    'ChoiceField/django.forms.RadioSelect',
                    'MultipleChoiceField/django.forms.CheckboxSelectMultiple',
                    'MultipleChoiceField']

    	// toggle choices field
    	if (in_list(selected_value, triggers)){
            fieldset.find(".field-choices input").css('visibility', 'visible');
    	}
    	else {
            fieldset.find(".field-choices input").css('visibility', 'hidden');
    	}
    };

    var manage_special_functionality = function(){
        var $dd = $(this); // drop-down
    	var selected_value = $dd.find(":selected").val();
    	var selected_text = $dd.find(":selected").text();
    	var fieldset = $dd.parents(".dynamic-fields");

        triggers = ['CharField',
                    'CharField/django.forms.Textarea',
                    'ChoiceField',
                    'BooleanField',
                    'MultipleChoiceField/django.forms.CheckboxSelectMultiple',
                    'MultipleChoiceField',
                    'StateProvinceField']

        var current_loc = window.location.pathname;
        if (current_loc.toLowerCase().indexOf("events/customregform") > 0) {
            triggers = ["BooleanField"];
        }

    	// toggle the special functionality and group fields
        if (in_list(selected_value, triggers)){
            fieldset.find(".field-field_function select").css('visibility', 'visible');
            // toggle special functionality dropdown
            var $select_dd = fieldset.find(".field-field_function select")
            $select_dd.find('option').removeAttr("disabled")
            if(selected_value == 'CharField'){
                $select_dd.find('option[value="GroupSubscription"]').attr('disabled','disabled');
                $select_dd.find('option[value="Recipients"]').attr('disabled','disabled');
                $select_dd.find('option[value="notes"]').attr('disabled','disabled');  
            }else if(selected_value == 'BooleanField'){
                $select_dd.find('option[value="EmailFirstName"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailLastName"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailFullName"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailPhoneNumber"]').attr('disabled','disabled');
                $select_dd.find('option[value="company"]').attr('disabled','disabled');
                $select_dd.find('option[value="address"]').attr('disabled','disabled');
                $select_dd.find('option[value="city"]').attr('disabled','disabled');
                $select_dd.find('option[value="county"]').attr('disabled','disabled');
                $select_dd.find('option[value="country"]').attr('disabled','disabled');
                $select_dd.find('option[value="region"]').attr('disabled','disabled');
                $select_dd.find('option[value="state"]').attr('disabled','disabled');
                $select_dd.find('option[value="zipcode"]').attr('disabled','disabled');
                $select_dd.find('option[value="position_title"]').attr('disabled','disabled');
                $select_dd.find('option[value="referral_source"]').attr('disabled','disabled');
                $select_dd.find('option[value="notes"]').attr('disabled','disabled');
            }else if(selected_value == 'CharField/django.forms.Textarea'){
            	$select_dd.find('option[value="GroupSubscription"]').attr('disabled','disabled');
            	$select_dd.find('option[value="GroupSubscriptionAuto"]').attr('disabled','disabled');
                $select_dd.find('option[value="Recipients"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailFirstName"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailLastName"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailFullName"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailPhoneNumber"]').attr('disabled','disabled');
                $select_dd.find('option[value="company"]').attr('disabled','disabled');
                $select_dd.find('option[value="address"]').attr('disabled','disabled');
                $select_dd.find('option[value="city"]').attr('disabled','disabled');
                $select_dd.find('option[value="county"]').attr('disabled','disabled');
                $select_dd.find('option[value="country"]').attr('disabled','disabled');
                $select_dd.find('option[value="region"]').attr('disabled','disabled');
                $select_dd.find('option[value="state"]').attr('disabled','disabled');
                $select_dd.find('option[value="zipcode"]').attr('disabled','disabled');
                $select_dd.find('option[value="position_title"]').attr('disabled','disabled');
                $select_dd.find('option[value="referral_source"]').attr('disabled','disabled');
            }else {
                $select_dd.find('option[value="GroupSubscription"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailFirstName"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailLastName"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailFullName"]').attr('disabled','disabled');
                $select_dd.find('option[value="EmailPhoneNumber"]').attr('disabled','disabled');
                $select_dd.find('option[value="company"]').attr('disabled','disabled');
                $select_dd.find('option[value="address"]').attr('disabled','disabled');
                $select_dd.find('option[value="city"]').attr('disabled','disabled');
                $select_dd.find('option[value="county"]').attr('disabled','disabled');
                $select_dd.find('option[value="country"]').attr('disabled','disabled');
                //$select_dd.find('option[value="region"]').attr('disabled','disabled');
                
                if (selected_value == 'StateProvinceField'){
                	$select_dd.find('option[value="GroupSubscription"]').attr('disabled','disabled');
                	$select_dd.find('option[value="GroupSubscriptionAuto"]').attr('disabled','disabled');
                    $select_dd.find('option[value="Recipients"]').attr('disabled','disabled');
                }else{
                	$select_dd.find('option[value="state"]').attr('disabled','disabled');
                }
                $select_dd.find('option[value="zipcode"]').attr('disabled','disabled');
                $select_dd.find('option[value="position_title"]').attr('disabled','disabled');
                //$select_dd.find('option[value="referral_source"]').attr('disabled','disabled');
                $select_dd.find('option[value="notes"]').attr('disabled','disabled');
            }
    	}
    	else {
	        fieldset.find(".field-field_function select").find('option[value="GroupSubscription"]').prop("selected", false);
            fieldset.find(".field-field_function select").css('visibility', 'hidden');
    	}

    }

    var manage_default = function(){
        var $dd = $(this); // drop-down
    	var selected_value = $dd.find(":selected").val();
    	var selected_text = $dd.find(":selected").text();
    	var fieldset = $dd.parents(".dynamic-fields");

        triggers = ['ChoiceField',
                    'BooleanField',
                    'ChoiceField/django.forms.RadioSelect',
                    'MultipleChoiceField/django.forms.CheckboxSelectMultiple',
                    'MultipleChoiceField']

    	// toggle help text field
        if (in_list(selected_value, triggers)){
            fieldset.find(".field-default input").css('visibility', 'visible');
    	}
    	else {
            fieldset.find(".field-default input").css('visibility', 'hidden');
    	}

    }

    // bind change event to dropdown
    $("div._inline-group .field-field_type select")
        .each(manage_choice_field).on('change', manage_choice_field)
        .each(manage_special_functionality).on('change', manage_special_functionality)
        .each(manage_default).on('change', manage_default);

    $('.add-row td a').on('click', function() {
        $("div._inline-group .field-field_type select")
            .each(manage_choice_field).on('change', manage_choice_field)
            .each(manage_special_functionality).on('change', manage_special_functionality)
            .each(manage_default).on('change', manage_default);
    });

});
