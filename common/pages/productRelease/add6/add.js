define([ 'jquery', 'knockout', 'text!pages/productRelease/add6/add.html','dialogmin','ajaxCom'
       ],
    function($, ko, template,dialogmin,ajaxCom) {
        var productUrl = "/product/info/";

        var continueUrl = "/productRelease/add/add/1";
        var list1Url = "/productRelease/man/List";
        var list2Url = "/productRelease/man2/List";

        addRouter(continueUrl);
        addRouter(list1Url);
        addRouter(list2Url);
        var viewModel = {
            data :  ko.observable({})


        };
        viewModel.goback = function(){
            window.history.go(-1);
        }
        viewModel.conti = function(){
            window.router.setRoute(continueUrl);
        }
        viewModel.list1 = function(){
            window.router.setRoute(list1Url);
        }
        viewModel.list2 = function(){
            window.router.setRoute(list2Url);
        }


        viewModel.load =function(){


        }

        var init = function(parm){
            viewModel.productId = parm[0]
            ajaxCom.Loadajax('get',productUrl+viewModel.productId,{isAjax:1},function(res){

                if(res.data.status != 1 && res.data.status != 2){
                    $(".product_add6 h3").html("商品资料已提交成功");
                }


            });


        };
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });