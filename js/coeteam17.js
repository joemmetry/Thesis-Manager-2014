var isOpen=false;(dropdownizer=function(a,b,c,d,e,f){jQuery(a).on('click',function(event){if(isOpen==false||!$(this).parent().hasClass(c)){$(b).removeClass(c);$(d).removeClass(f);event.stopPropagation();$(this).parent().addClass(c);$(this).parent().children(e).addClass(f);isOpen=true;}});$('html').on('click',function(){$(d).each(function(){$(d).removeClass(f);isOpen=false;});$(b).each(function(){$(b).removeClass(c);});});})();(dropdowndisabler=function(a){$(a+' li.disabled').on('click',function(e){e.preventDefault();});})();dropdownizer('.uiDropdown-button button.uiDropdown-selected,.uiDropdown-button input[type=submit],'+'.uiDropdown-button input[type=button],.uiDropdown-button a','.uiDropdown-button','uiDropdownOpen','.uiDropdown-button ul','ul','uiDropdown-toggler');dropdowndisabler('.uiDropdown-menu');var divMessageHeader,theme,setTheme,value,msgLoadExternalPage,isExecuted=false;var divMessageMain='<div class="uiAlignCenter">';var divMasker='<div class="uiModalMasker "></div>';var divDialogMetro;var divCloser='</div>';var msgTitle='<div class="uiModalTopButtons"><button type="button" class="close">&times;</button></div>';var msgButton='<div class="uiModalHeader"><i class="uiDialogButtonClose"></i></div>';var scrollPos;String.prototype.splice=function(idx,rem,s){return (this.slice(0,idx)+s+this.slice(idx+Math.abs(rem)));};function dialogActOnKeyDown(e){}function dialogActOnClick(){$('.triggerResetFormClose, .uiModalMasker, .uiModalTopButtons .close').on('click',function(){$('.uiModalMasker, .uiModal').fadeOut(200, function(){closeModal();});});}function closeModal(){divMessageHeader=theme=setTheme=value=msgLoadExternalPage='';isExecuted=false;$('.uiModalMasker, .uiModal').remove().empty();$('html, body').scrollTop(scrollPos);$('#pageContainer').css({'position':'','top':'','width':''});}function checkTheme(defined){if(defined.theme=='light'){divMessageHeader='<div class="uiModalMsgHeader">';value='uiModalContent';divDialogMetro='<div class="uiModal">';if(defined.type=='external'){divDialogMetro='<div class="uiModal external">';}setTheme='.uiModalContentLimit .uiModalContent';msgLoadExternalPage=divMasker+divDialogMetro+'<div class="uiModalContentLimit">'+msgTitle+'<div class="uiModalPreloader"></div></div>';}else{divMessageHeader='<div class="uiModalMsgHeader dark">';value='uiModalContent dark';setTheme='.uiModalContentLimit .uiModalContent.dark';divDialogMetro='<div class="uiModal dark">';if(defined.type=='external'){divDialogMetro='<div class="uiModal dark external">';}msgLoadExternalPage=divMasker+divDialogMetro+'<div class="uiModalContentLimit">'+msgTitle+'<div class="uiModalPreloader dark"></div></div>';}}function dialogLoadExternalPage(defined){if(isExecuted===false){setTheme='.uiModalContentLimit .uiModalContent';$('body').prepend(divMasker+'<div class="uiModal dark external">'+msgTitle+divMessageHeader+defined.title+'</div>'+'<div class="uiModalContentLimit">'+'<div class="uiModalPreloader dark"></div></div>');$('.uiModalHeader').append(defined.title);$('.uiModalContentLimit').append('<div class="uiModalContent"></div>');$('.uiModal').css({'width':defined.width+'px'});$('.uiModalMasker,.uiModal').fadeIn(200,function(){$('.uiModalPreloader').fadeOut(200,function(){$(setTheme).fadeIn(200,function(){$(setTheme).load(defined.action,null,function(){$('.uiModal').animate({height:$(this).height()+40});});});});});isExecuted=true;doCloseByKB(defined);dialogActOnClick();}}function dialogLoadMessage(defined){if(isExecuted===false){passSharedObj(defined);$('.uiModal').append('<div style="width:'+defined.width+'px;" class="uiModalButtonPanel">&nbsp;<div>'+'<button class="triggerResetFormClose ">'+defined.buttons[0]+'</button></div></div>');dialogActOnClick();}}function dialogLoadPrompt(defined){if(isExecuted===false){passSharedObj(defined);$('.uiModal').append('<div style="width:'+defined.width+'px;" class="uiModalButtonPanel">&nbsp;<div>'+'<button id="modRedirect" class="uiButtonStandard triggerResetFormClose"><i class="uiIcon-ok"></i> '+defined.buttons[0]+'</button>'+'<button class="triggerResetFormClose" ><i class="uiIcon-remove"></i> '+defined.buttons[1]+'</button></div></div>');$('#modRedirect').on('click',function(e){doSomething(defined);});dialogActOnClick();}}(function($){$modalDefaults=function(values){var settings=$.extend({height:40,width:600,theme:'light',action:'',title:$(this).data('title')||'Modal Header',content:$(this).data('content')||'Modal Content',type:'message',buttons:['Okay','Cancel'],keyboard:false},values);return settings;};$.fn.graphModal=function(options){$(this).on('click',function(e){settings=$modalDefaults(options);scrollPos=$(document).scrollTop();$('#pageContainer').css({'position':'fixed','top':'-'+scrollPos+'px','width':$(document).width()+'px'});e.preventDefault();checkTheme(settings);switch(settings.type){case 'external':settings.title=$(this).data('title');settings.action=$(this).attr('data-href');if(settings.title.length>0){dialogLoadExternalPage(settings);}break;case 'message':if(settings.action==''){dialogLoadMessage(settings);}break;case 'prompt':settings.action=$(this).attr('data-href');dialogLoadPrompt(settings);break;default:break;}});return;};$.graphModal=function(options){settings=$modalDefaults(options);scrollPos=$(document).scrollTop();$('#pageContainer').css({'position':'fixed','top':'-'+scrollPos+'px','width':$(document).width()+'px'});checkTheme(settings);switch(settings.type){case 'external':settings.action=$(this).attr('data-href');if(settings.title.length>0){dialogLoadExternalPage(settings);}break;case 'message':if(settings.action==''){dialogLoadMessage(settings);}break;case 'prompt':settings.action=$(this).attr('data-href');dialogLoadPrompt(settings);break;default:break;}return;};})(jQuery);var passSharedObj=function(passVars){$('body').prepend(divMasker+divCloser+divDialogMetro+divMessageHeader+passVars.title+divCloser+divMessageMain+passVars.content+divCloser+divCloser);$('.uiModalMsgHeader').css({'width':passVars.width+'px'});$('.uiModal').css({'height':passVars.height+'px'});$('.uiModalMasker, .uiModal').fadeIn(200);doCloseByKB(passVars);isExecuted=true;};var doCloseByKB=function(passVars){if(passVars.keyboard===true){$(document).on('keydown',function(e){if(e.keyCode==27){$('.uiModalMasker,.uiModal').fadeOut(200,function(){closeModal();});}});}};var doSomething=function(defined){window.location.assign(defined.action);};var getUrlParameters = function(parameter, staticURL, decode){var currLocation = (staticURL.length)? staticURL : window.location.search, parArr = currLocation.split("?")[1].split("&"), returnBool = true;for(var i = 0; i < parArr.length; i++){parr = parArr[i].split("=");if(parr[0] == parameter){return(decode)?decodeURIComponent(parr[1]):parr[1];returnBool=true;}else{returnBool = false;}}if(!returnBool){ return false;}};


function isNumberKey(evt){
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
function isEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 