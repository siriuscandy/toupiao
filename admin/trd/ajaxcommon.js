define(['jquery'], function() {
	
	var ajaxcommon = function(type,url,adata,func){
        $.ajax({
            type : type,
            url : $ctx + url,
            data : adata,
            cache:false,
            beforeSend:function(xhr){
                xhr.setRequestHeader('Authorization', "OAuth2 "+getCookie('at'));
            },
            dataType : 'json',
            success : function(res) {
                func(res)
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){

            }
        });
	};
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
	return ajaxcommon;
});