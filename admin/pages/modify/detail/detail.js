define([ 'jquery', 'knockout', 'text!pages/modify/detail/detail.html','dialogmin','ajaxCom',
      ],
    function($, ko, template,dialogmin,ajaxCom) {
        var modifyUrl = "/vote/user/change";
        var getUrl = "/vote/getUserInfo";
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
                // name: viewModel.data().name,
                // phonenumber: viewModel.data().phonenumber,
                // account: viewModel.data().account,
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
        ajaxCom.Loadajax('post', modifyUrl +"/"+ viewModel.userId,queryData,function(res){
            if(res.status==1){ 
                dialogmin('修改成功!');
            }
        })
            

        };
        viewModel.load = function(){
            // $(".settled_phone").bind("blur",function(){
            //     if(!TelReg.test($(this).val())){
            //         $(this).addClass("errorinput");

            //     }else{

            //     }
            // }).bind("focus",function(){
            //     $(this).removeClass("errorinput");

            // });
            // $.ajax({
            //     type : 'get',
            //     url : $ctx + getUrl+"?userId="+viewModel.userId,
            //     cache:false,
            //     dataType : 'json',
            //     success : function(res) {
            //         if(res.status==1){
            //             viewModel.data(res.data);
                       
            //         }else{
            //             dialogmin("网络错误!!");
            //         }
            //     }
            // });

        };

        var init = function(parm){
            viewModel.userId = window.sessionStorage.userId;
            viewModel.id = parm[0];
            viewModel.load(parm[0]);
            
        };

        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });