define([ 'jquery', 'knockout', 'text!pages/user/detail/detail.html','dialogmin','ajaxCom',
      ],
    function($, ko, template,dialogmin,ajaxCom) {
        var modifyUrl = "/vote/user/edit";
        var getUrl = "/vote/user/detail";
        var viewModel = {
            data :  ko.observable({}),
            id:"",
        };
        viewModel.goback = function(){
            window.history.go(-1);

        }
        viewModel.submitMo = function() {
          
            var queryData = {
                name: encodeURIComponent(viewModel.data().name),
                phonenumber: viewModel.data().phonenumber,
                account: viewModel.data().account,
                id: viewModel.id,
            };

            // if(viewModel.data().resCode==undefined||viewModel.data().resCode==""){
            //     dialogmin('您的编码还没填呢~');
            //     return false
            // }

            // if(viewModel.data().resName==undefined||viewModel.data().resName==""){
            //     dialogmin('您的名称还没填呢~');
            //     return false
            // }

           ajaxCom.Loadajax('get', modifyUrl +"/"+ viewModel.id,queryData,function(res){
            if(res.status==1){ 
                dialogmin('修改成功!');
                window.sessionStorage.username = viewModel.data().name;
            }else{
                dialogmin(res.msg)
            }
            })

        };
        viewModel.load = function(){

            $.ajax({
                type : 'get',
                url : $ctx + getUrl+"/"+viewModel.id,
                cache:false,
                dataType : 'json',
                success : function(res) {
                    if(res.status==1){
                        viewModel.data(res.data);
                       
                    }else{
                        dialogmin('网络开小差~请刷新页面');
                    }
                }
            });

        };

        var init = function(parm){
            viewModel.id = window.sessionStorage.userId;
            viewModel.load(parm[0]);
            
        };

        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });