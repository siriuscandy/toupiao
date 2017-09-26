
define([ 'jquery', 'knockout', 'text!pages/shopping/shoppingCart/shoppingCart.html','dialogmin','bootstrap','uui','daterangpicker','ajaxcommon'
], function($, ko, template,dialogmin,b,uui,daterangpicker,ajaxcommon) {
    //接口
    var pageUrl = '/licensecarrier/getlislist/carrier'; //列表加载


    // 添加修改页路由
    var detailrooter = '/recharge/detail/detail/:resId';
    addRouter(detailrooter);
    var viewModel = {
        data : ko.observableArray()

    };

    viewModel.load = function(pageIndex,isreset){

    }

    var init = function(parm) {


    };


    return {
        'model' : viewModel,
        'template' : template,
        'init' : init
    };


});