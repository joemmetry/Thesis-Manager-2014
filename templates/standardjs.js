function hidePassword(){
    $("[id*='password']").hide();
}
function getParameter(name,url) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null
}
//to be removed
function c__showHide(field,flag) {
    //CODE CREATION: M.PISCOSO - Custom Show Hide (overrides field show hide)
    //Created - 02-11-2011
    var mode, label;
    if (String(navigator.appVersion).indexOf('MSIE 7.0') == -1) { mode = 'table-cell'; }
    else { mode = 'block'; }
    try {
        field = new String(field);
        label = "rbi_L_" + field;
        field = "rbi_F_" + field;
        if (flag == true) {
            document.getElementById(field).style.display = mode;
            document.getElementById(label).style.display = mode;
        } else {
            document.getElementById(field).style.display = "none";
            document.getElementById(label).style.display = "none";
        }
    } catch(e) { alert(field + "  " + e); }
}
//numbers 0-9 only are allowed
function isNumberKey2(evt){
    //console.log(event.which)
    var charCode = (event.which) ? event.which : event.keyCode;
if(evt.shiftKey == 1){   return false;}
    if (charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        (charCode < 96 || charCode > 105)){
        return false;
    }else{
        return true;
    }
}

/*
 *    JOEM P. :) 4/3/2014 Modified functions
 */

/* Allowed keys: BKSP TAB ENTER LEFT RIGHT DEL 0-9 F5*/
var allowedKeys = [8,9,13,16,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,116];
//var charCode =  (evt.which) ? evt.which : evt.keyCode;

     function restrictInput(mobilePhoneId,homePhoneid,numberId){
          $(mobilePhoneId).on("keydown", function(event){
             onMobilePhoneKeypress(event, mobilePhoneId);
             return isNumberKey(event);
          });
          $(homePhoneid).on("keydown", function(event){
             onPhoneKeypress(event, homePhoneid);
             return isNumberKey(event);
          });
          $(numberId).on("keydown", function(event){
             return isNumberKey(event);
          });
    }


       function restrictInput_Letter(idName){
           $(idName).on("keypress",function(event){
               return isAlphabetKey(event);
           });
       }

function isAlphabetKey(evt){
      charCode =  (evt.which) ? evt.which : evt.keyCode;
      if(charCode == 16 ){   return true;}
      if((charCode > 64 && charCode < 91) ||
            (charCode > 96 && charCode < 123) ||
            (charCode == 37 || charCode == 39) ||
            (charCode < 33) || (charCode == 46) 
            ){
           return true;
      }
      return false;
}

function isNumberKey(evt){
      charCode =  (evt.which) ? evt.which : evt.keyCode;
      for(i=0;i < allowedKeys.length; i++){
          if(charCode == allowedKeys[i]){ 
              return true;
          }
      }
      return false;
}

function formatPhone(text) {
    return text.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
}

/* Format the Mobile Number. (####-###-####) */
function onMobilePhoneKeypress(event, id) {
      var mobNo = $(id).val();
      var len = mobNo.length;
      //Auto-set Dashes. (check if the key pressed is not backspace)
      if((len == 4 || len == 8) && (event.keyCode != 35 && event.keyCode != 36 && event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 8 && event.keyCode != 46) ){
            $(id).val().replace(/-/g, '');
            $(id).val( mobNo + "-");
           
      }
}

function onPhoneKeypress(event, id){
  /* Format the Phone Number. (###-##-##) */
    var homeNo = $(id).val();
    var len = homeNo.length;
  //Auto-set Dashes. (check if the key pressed is not backspace)
   if((len == 3 || len == 6) && (event.keyCode != 35 && event.keyCode != 36 && event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 8 && event.keyCode != 46)){
      $(id).val( homeNo + "-");
   }
}

function onMobilePhoneOnBlur() {
    var phone = document.getElementById("mobilePhone");
    phone.value = formatPhone(phone.value);
}

function onTelephoneOnBlur() {
    var phone = document.getElementById("home_number");
    phone.value = formatTelephone(phone.value);
}
/* ====================================================
 * Placeholder Fallback
 * ==================================================== */
function textPlaceholder(idName,value){
  $(idName).on('focus',function(){
        var curVal = $(this).val();
        if(curVal===value){
          $(this).val('');
        }   
      })
  .on('blur',function(){
       var curVal = $(this).val();
        if(curVal===''){
          $(this).val(value);
        } 
  });
}

function passPlaceholder(idName,value){
  $(idName).on('focus',function(){
        $(this).prop('type','password');
        var curVal = $(this).val();
        if(curVal===value){
          
          $(this).val('');
        }
  })
  .on('blur',function(){
    
       var curVal = $(this).val();
    if(curVal===''){
          $(this).prop('type','text');
          $(this).val(value);
        } 
  });
}
/*-----------------------------------------------------------------
ORCHID CORPIN 02/05/2014 : added the function validateEmployee()
-----------------------------------------------------------------*/
function validateEmployee(id) {
    var candidateId = id;  
    var validated = rbf_selectQuery("SELECT is_internal_user," + 
        "employee_validated, thru, first_login " +
        "FROM $R_CAND " +
        " WHERE id="+parseInt(candidateId), 1,
        function(data){
            if(data.length>0){
                $("body").hide();
                var isEmp = (parseInt(data[0][0]) == 1);
                var isVal = (parseInt(data[0][1]) == 1);
                //AUTOLOGOUT USER IF EMPLOYEE AND ARE NOT VALIDATED (CHECKBOX)
                if(isEmp == true && isVal == false) {
                    logoutLikeJobs();
                    alert("Thank you for registering." + 
                        " Confirmation email will be sent once your account has been validated");
                }/*
                else if(isEmp == false&& parseInt(data[0][3]) == 1){
                   // rbf_selectQuery("UPDATE $R_CAND SET first_login = 'false' WHERE id='" +parseInt(candidateId)"'", 1,function(){});
                    logoutLikeJobs();
                    alert("As you registered via " + data[0][2] + ". Check your email to create a password for your account.");
                }*/
                else{
                    $("body").show();
                };
            };
        });
};
function printOnConsole(printStr){
    if(typeof console !==  "undefined" &&
        typeof printStr !==  "undefined"){
        console.log(printStr);
    }
}

/*-----------------------------------------------------------------
Function for replacement of placeholder in IE 9.0
-----------------------------------------------------------------*/
function replacePlaceholder(){
    var input = document.createElement("input");
    if(('placeholder' in input)==false) { 
        $('[placeholder]').focus(function() {
            var i = $(this);
            if(i.val() == i.attr('placeholder')) {
                i.val('').removeClass('placeholder');
                if(i.hasClass('password')) {
                    i.removeClass('password');
                    this.type='password';
                }           
            }
        }).blur(function() {
            var i = $(this);    
            if(i.val() == '' || i.val() == i.attr('placeholder')) {
                if(this.type=='password') {
                    i.addClass('password');
                    this.type='text';
                }
                i.addClass('placeholder').val(i.attr('placeholder'));
            }
        }).blur().parents('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
                var i = $(this);
                if(i.val() == i.attr('placeholder'))
                    i.val('');
            })
        });
    }
}
//backend code only to be moved to a separate  JS file
function configureViewOptionsForAdmin(roleCode, clientPageId){
    if(roleCode.trim() == "$ADMIN"){
        $("div[id*='rbi_S_'] button~ul li>a[href*='viewEdit']").showImportant();
        $("div[id*='rbi_S_'] button~ul li>a[onclick*='viewEdit']").showImportant();
        $("div[id*='rbi_S_'] button~ul li>a[onclick*='viewDelete']").showImportant();
        $("a[href*='import']").showImportant();
        $("a[href*='templates']").showImportant();
        $("a[href*='/components/about.jsp']").showImportant();
        $("a[href*='Gateway']").showImportant();
        $("#rbe_selectedTab ul>li.divider").showImportant();
        $("#rbe_selectedTab a[href*='main.jsp?pageId="+clientPageId+"']").show();
    };
};
//override jQuery library to be moved to a separate JS file
jQuery.fn.showImportant=function(displayValue){
    if(typeof displayValue == "undefined" || displayValue == "none"){
        displayValue = "block";
    };
    if(typeof this != "undefined"){
        this.attr("style", "display:"+displayValue+"!important");
    };
};
function getPortalPageNameByLink(link){
	var array = link.split(/[<>]/);
	if(array.length > 2){
		return array[2];
	}else{
		return "";
	}
};