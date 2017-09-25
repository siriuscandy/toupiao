define(['jquery'], function() {
    var ajaxCom = {
            Loadajax : function(type,url,adata,func,error){
                $.ajax({
                    type : type,
                    url : $ctx + url,
                    data : adata,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    contentType:"application/json",
                    cache:false,
                    beforeSend:function(xhr){
                        xhr.setRequestHeader('Authorization', "OAuth2 "+getCookie('at'));
                    },
                    dataType : 'json',
                    success : function(res) {
                        if (res && res.needrelogin) { //对请求结果进行特殊处理
                            location.reload(); //刷新页面
                        }
                        func(res)
                    },
                    error:function(XMLHttpRequest, textStatus, errorThrown){
                        error(XMLHttpRequest)
                    }
                });
            },
            asyncajax : function(type,url,adata,func,error){
                $.ajax({
                    type : type,
                    url : $ctx + url,
                    data : adata,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    cache:false,
                    async : false,
                    dataType : 'json',
                    success : function(res) {
                        if (res && res.needrelogin) { //对请求结果进行特殊处理
                            location.reload(); //刷新页面
                        }
                        func(res)
                    },
                    error:function(XMLHttpRequest, textStatus, errorThrown){
                        error(XMLHttpRequest)
                    }
                });
            }
    }

    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
	return ajaxCom;
});