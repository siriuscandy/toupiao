define([ 'jquery', 'knockout', 'text!pages/productRelease/man/List.html',"dialogmin",'uui','dialogminBack','ajaxCom'
       ],
    function($, ko, template,dialogmin,uui,dialogminBack,ajaxCom) {
        var addUrl = '/productRelease/add/add/:productId';
        var add2Url = '/productRelease/add2/add/:productId';
        var add3detailUrl = '/productRelease/add3detail/detail/:productId';
        var modifyUrl = "/productRelease/add/add/:resId";
        var detailUrl = "/productRelease/detail/detail/:resId";
        //接口
        var pageUrl = '/product/onShelves '; //列表加载
        var searchUrl = '/product/backend/search '; //搜索接口
        var  deleteUrl ="/product/remove"
        // 添加修改页路由
        addRouter(addUrl);
        addRouter(add2Url);
        addRouter(add3detailUrl);
        addRouter(modifyUrl);
        addRouter(detailUrl);
        var viewModel = {
            data : {
                content : ko.observableArray([]),
                totalPages : ko.observable(0),
                number : ko.observable(0),
                totalElements : ko.observable(0)
            },
            searchText : ko.observable(""),
            setData : function(data) {
                this.data.content(data.data.content);
                this.data.totalPages(data.data.totalPages);
                this.data.number(data.data.number + 1);
                this.data.totalElements(data.data.totalElements);
            },
            pageUrl : pageUrl,
            pagesize : 12,
            approveTime:"DESC",
            productName:"DESC"
        };
        viewModel.add = function(){//添加跳转
            window.router.setRoute('/productRelease/add/add/1');
        };
        viewModel.goadd3 = function(id){//添加跳转
            viewModel.stopEvent();
            window.router.setRoute('/productRelease/add3detail/detail/'+id);
        };
        viewModel.stopEvent = function(){ //阻止冒泡事件
            function getEvent(){
                if(window.event)    {return window.event;}
                func=getEvent.caller;
                while(func!=null){
                    var arg0=func.arguments[0];
                    if(arg0){
                        if((arg0.constructor==Event || arg0.constructor ==MouseEvent
                            || arg0.constructor==KeyboardEvent)
                            ||(typeof(arg0)=="object" && arg0.preventDefault
                                && arg0.stopPropagation)){
                            return arg0;
                        }
                    }
                    func=func.caller;
                }
                return null;
            }
            var e=getEvent();
            if(window.event){
                //e.returnValue=false;//阻止自身行为
                e.cancelBubble=true;//阻止冒泡
            }else if(e.preventDefault){
                //e.preventDefault();//阻止自身行为
                e.stopPropagation();//阻止冒泡
            }
        };
         viewModel.detail = function(id){//详情
             viewModel.stopEvent();
             //var url = "/market/product/details/"+id;
             var url = marketConfig.itemServer+"/"+id+".html";
             window.open(url)

                 /*$(".osp_appList").addClass("appmanlist_details")
                 $(".product_Details").find("iframe").attr("src",url);
                 var iframe = $("#iframe_webmanage");
                 iframe.load(function(){
                     iframe.contents().find(".conheader").hide();
                     iframe.contents().find(".condropdown").hide();
                     iframe.contents().find(".footer-wrap").hide();
                     iframe.contents().find(".sideBar").css("width","24%");
                     $(".product_Details").show()
                 })
*/

          };

        viewModel.modify = function(id){//修改
            viewModel.stopEvent();
            window.router.setRoute("/productRelease/add/add/"+id+"CH");
        };
        viewModel.searchGo = function(){
            viewModel.load(0);

        };

        viewModel.UpTime = function(){//上架时间排序
           // viewModel.stopEvent();
            if(this.approveTime=="DESC"){
                this.approveTime = "ASC"
            }else{
                this.approveTime = "DESC"
            }
            this.productName = ""
            viewModel.load(0)
        };
        viewModel.AppName = function(){//商品名称排序
            //viewModel.stopEvent();
            if(this.productName=="DESC"){
                this.productName = "ASC"
            }else{
                this.productName = "DESC"
            }
            this.approveTime = ""
            viewModel.load(0)
        };


        viewModel.load = function(pageIndex){
            var queryData = {
                keyword:"",//输入框关键字
                sort:{//排序参数
                    approveTime:this.approveTime,//上架时间，DESC-表示降序，ASC表示升序如果商品未上架，上架时间就不存在，此处是什么？
                    productName:this.productName//商品名称
                },
                size: viewModel.pagesize || 12,     //page size 每页显示条数
                page: pageIndex,   //page num 当前页数
                status:"3",  //已上架
                isAjax:1
            };

            queryData.keyword = encodeURIComponent($(".input_search").val());

            ajaxCom.Loadajax('post',searchUrl+"?size="+queryData.size+"&page="+queryData.page,JSON.stringify(queryData),function(res){
                if(res.status==1){
                    viewModel.setData(res);
                    $(".appmanlist .app_text .tit  .tit_em").mouseenter(function(){
                        $(this).parents(".tit").find(".tit_full").show();
                    }).mouseleave(function(){
                        $(".tit_full").hide();
                    })
                    var element = document.getElementById("pagination");
                    var comp = new u.pagination({ el: element,showState:false,jumppage:true });
                    comp.update({ totalPages: viewModel.data.totalPages(), pageSize: viewModel.pagesize || 12, currentPage:  viewModel.data.number(), totalCount: viewModel.data.totalElements() });
                    comp.on('pageChange', function(pageIndex) {
                        if(viewModel.testNum(pageIndex) && pageIndex<viewModel.data.totalPages()){
                            viewModel.load(pageIndex);

                        }else {
                            dialogmin("请输入正确的页码")
                        }
                    });
                    comp.on('sizeChange', function(arg) {
                        if(viewModel.testNum(arg[0])){
                            viewModel.pagesize = arg[0];
                            viewModel.load(0);

                        }else {
                            dialogmin("请输入正确的数")
                        }

                    });
                }else{
                    dialogmin(res.msg || "网络错误!!");
                }
            },function(error){
                var res = JSON.parse(error.responseText)
                dialogmin(res.msg || "网络错误");
            })


        };
        viewModel.testNum = function(s){
            var re = /^[0-9]+$/ ;
            return re.test(s)
        }
        viewModel.changeUpDown = function(){
            $(".appmanlist_top_left_l span").each(function(){
                var _this = $(this);
                _this.click(function(){
                    if(_this.find("i").hasClass("turnUp")){
                        _this.find("i").removeClass("turnUp")
                    }else{
                        _this.find("i").addClass("turnUp")
                    }
                })
            })
        }

        var init = function(parm) {

            var pageNum = viewModel.data.number();
            if(pageNum > 0){
                viewModel.load(pageNum);
            } else {
                viewModel.load(0);
            }
            viewModel.changeUpDown();
            $(document).keyup(function (e) {
                if (e.keyCode == 13) {
                    viewModel.searchGo(0);
                }
            });
        };


        return {
            'model' : viewModel,
            'template' : template,
            'init' : init
        };


    });