define([ 'jquery', 'knockout', 'text!pages/user/detail/detail.html','dialogmin',
      ],
    function($, ko, template,dialogmin) {
        var modifyUrl = "/shopedit/modify";
        var getUrl = "/shopedit/modify";

        var viewModel = {
            data :  ko.observable({}),
            id:"",
        };
        viewModel.goback = function(){
            window.history.go(-1);

        }
        viewModel.submitMo = function() {
          
            var queryData = {
                resCode: viewModel.data().resCode,
                resName: viewModel.data().resName,
                typeId: viewModel.data().typeId,
                brief: UE.getEditor("myEditor"+edtime+"").getContentTxt(),
                description: viewModel.data().description,
                icon: viewModel.data().userAvator,
                detail: viewModel.detailimg,
                resId: viewModel.id
            };

            if(viewModel.data().resCode==undefined||viewModel.data().resCode==""){
                dialogmin('您的编码还没填呢~');
                return false
            }

            if(viewModel.data().resName==undefined||viewModel.data().resName==""){
                dialogmin('您的名称还没填呢~');
                return false
            }

            $.ajax({
                type : 'post',
                dataType : 'json',
                async : false,
                data : JSON.stringify(queryData),
                url : $ctx + modifyUrl,
                contentType:"application/json",
                success : function(data) {
                    if (data.status==1){
                        dialogmin('修改成功!');
                        window.history.go(-1);
                    }else{
                        dialogmin(data.msg);
                    }
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    dialogmin("调用服务报错!!");
                }
            });

        };
        viewModel.load = function(id){

            $.ajax({
                type : 'get',
                url : $ctx + getUrl+"?resId="+id,
                cache:false,
                dataType : 'json',
                success : function(res) {
                    if(res.status==1){
                        viewModel.data(res.data);
                       
                    }else{
                        dialogmin("网络错误!!");
                    }
                }
            });

        };

        var init = function(parm){
            viewModel.load(parm[0]);
            viewModel.id = parm[0]
        };

        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });