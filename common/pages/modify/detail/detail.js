define([ 'jquery', 'knockout', 'text!pages/modify/detail/detail.html','dialogmin','ajaxCom',
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
                newpassword: viewModel.data().password,
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

           ajaxCom.Loadajax('get', modifyUrl +"/"+ viewModel.userId,queryData,function(res){
            if(res.status==1){ 
                dialogmin('修改成功!');
            }else{
                dialogmin(res.msg)
            }
        })

        };
        viewModel.load = function(){
            

        };

        var init = function(parm){
            viewModel.userId = window.sessionStorage.userId;
            viewModel.id = parm[0]
            viewModel.load(parm[0]);
            
        };

        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });