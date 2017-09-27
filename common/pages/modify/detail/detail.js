define([ 'jquery', 'knockout', 'text!pages/modify/detail/detail.html','dialogmin',
      ],
    function($, ko, template,dialogmin) {
        var modifyUrl = "/vote/user/change";
        var TelReg =  /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;//手机号正则

        var viewModel = {
            data :  ko.observable({}),
            id:"",
        };
        viewModel.goback = function(){
            window.history.go(-1);

        }
        viewModel.submitMo = function() {

            var queryData = {
                password: viewModel.data().password,
                oldpassword: viewModel.data().oldpassword,
                userId: viewModel.userId,
            };

            if(viewModel.data().password!=viewModel.data().password2){
                dialogmin('两次输出的新密码不同');
                return false
            }
            
            // if(viewModel.data().resName==undefined||viewModel.data().resName==""){
            //     dialogmin('您的名称还没填呢~');
            //     return false
            // }

            $.ajax({
                type : 'post',
                dataType : 'json',
                async : false,
                data : JSON.stringify(queryData),
                url : $ctx + modifyUrl+"/"+viewModel.userId,
                contentType:"application/json",
                success : function(data) {
                    if (data.status==1){
                        dialogmin('修改成功!');
                       // window.history.go(-1);
                    }else{
                        dialogmin(data.msg);
                    }
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    dialogmin("网络错误!!");
                }
            });

        };
        viewModel.load = function(){
            

        };

        var init = function(parm){
            viewModel.load(parm[0]);
            viewModel.userId = window.sessionStorage.userId;
            viewModel.id = parm[0]
        };

        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });