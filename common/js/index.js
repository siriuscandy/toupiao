require(['jquery', 'knockout','dialogminBack', 'bootstrap', 'director','moment'],
    function($, ko,dialogminBack) {
       var winW = document.documentElement.clientWidth || document.body.clientWidth;

        window.addRouter = function(path, func) {
            var pos = path.indexOf('/:');
            var truePath = path;
            if (pos != -1)
                truePath = path.substring(0,pos);
            func = func || function() {
                var params = arguments;
                initPage('pages' + truePath,params);
            };
            var tmparray = truePath.split("/");
            if(tmparray[1] in router.routes && tmparray[2] in router.routes[tmparray[1]] && tmparray[3] in router.routes[tmparray[1]][tmparray[2]]){
                return;
            }else{
                router.on(path, func);
            }
        };

        window.router = Router();

        $(function(){
            $(window).resize(function(){
                if($(".left_nav_operation_btn").hasClass("cur")){
                    $(".authlistTop_top").animate({width:$(document.body).width()-80+"px"},0);

                }else{
                    $(".authlistTop_top").animate({width:$(document.body).width()-200+"px"},0);
                }
            });
            autodisnone();
            function autodisnone(){
                $(".left_nav_operation_btn").click(function(){
                    var _this =$(this);
                    if(_this.hasClass('cur')==false){
                        $(".left-menu>li>a .title").addClass("dis");
                        $(".left-menu>li>a .arrow").fadeOut();
                        $(".sub-menu").hide();
                        _this.addClass("cur");
                        $(".leftpanel").addClass("leftpanel-collapse-min");
                        $(".top_logo ").addClass("top_logo_min");
                        $(".content").addClass("content-collapse-min");
                        $(".authlistTop_top").animate({width:$(document.body).width()-80+"px"},0);
                        $(".leftpanel-collapse-min .appcenter_list").on('click', function(e) {
                            _this.removeClass("cur");
                            $(".leftpanel").removeClass("leftpanel-collapse-min");
                            $(".content").removeClass("content-collapse-min");
                            $(".top_logo").removeClass("top_logo_min");
                            $(".left-menu>li>a .title").removeClass("dis");
                            $(".left-menu>li>a .arrow").fadeIn();

                            $(".authlistTop_top").animate({width:$(document.body).width()-200+"px"},0);
                        })
                    }else{
                        _this.removeClass("cur");
                        $(".leftpanel").removeClass("leftpanel-collapse-min");
                        $(".content").removeClass("content-collapse-min");
                        $(".top_logo").removeClass("top_logo_min");
                        $(".left-menu>li>a .title").removeClass("dis");
                        $(".left-menu>li>a .arrow").fadeIn();
                        $(".authlistTop_top").animate({width:$(document.body).width()-200+"px"},0);
                    }
                })
            };
            $(".sub-menu li").on('click', function(e) {
                if($(this).hasClass("active")){
                    var first = window.location.href.indexOf("#/");
                    if(first>0){
                        var url =window.location.href.split("#")[1]
                        window.router.setRoute("/opertions");
                        window.router.setRoute(url);
                    }

                }
                $(".sub-menu li").removeClass("active");
                $(this).addClass("active")
            })
            $('.left-menu > li > a').on('click', function(e) {
                $(".sub-menu").slideUp(200);
                if($(this).parents("li").hasClass("active")){

                    var first = window.location.href.indexOf("#/");
                    if(first>0){
                        var url =window.location.href.split("#")[1]
                        window.router.setRoute("/opertions");
                        window.router.setRoute(url);
                    }
                }
                $(this).parents("ul").find("li").removeClass("active");
                $(this).parents("li").addClass("active");



                var parent = $(this).parent().parent();
                parent.children('li.open').children('a').children('.arrow').removeClass('open').removeClass('cl-arrow-right').addClass('cl-treearrow-down');
                parent.children('li.open').children('a').children('.arrow').removeClass('active');
                parent.children('li.open').children('.sub-menu').slideUp(200);
                parent.children('li').removeClass('open');
                //  parent.children('li').removeClass('active');
                if ($(this).next().hasClass('sub-menu') === false) {

                    return;
                }
                var sub = $(this).next();
                if (sub.is(":visible")) {
                    $('.arrow', $(this)).removeClass("open").removeClass('cl-treearrow-down').addClass('cl-arrow-right');
                    $(this).parent().removeClass("active");
                    sub.slideUp(200);
                } else {
                    $('.arrow', $(this)).addClass("open").removeClass('cl-arrow-right').addClass('cl-treearrow-down');
                    $(this).parent().addClass("open");
                    sub.slideDown(200);
                    sub.find("li").eq(0).click();
                    window.router.setRoute("/productRelease/man/List");
                }

                e.preventDefault();
            });

            $('.left-menu').find("a[href*='#']").each(function(e) {
                    var path = this.hash.replace('#', '');
                    addRouter(path);

            });
            $('.sub-menu').find("a[href*='#']").each(function() {
                var path = this.hash.replace('#', '');
                addRouter(path);
            });

            window.router.init();

        });
       
        function initPage(p, id) {
            var module = p;
            requirejs.undef(module);
            require([module], function(module) {
                ko.cleanNode($('.content')[0]);
                $('.content').html('');
                $('.content').html(module.template);
                if(module.model){
                    module.model.data.content = ko.observableArray([]);
                    ko.applyBindings(module.model, $('.content')[0]);
                    module.init(id);
                }else{
                    module.init(id, $('.content')[0]);
                }
                if($(".left_nav_operation_btn").hasClass("cur")){
                    $(".authlistTop_top").animate({width:$(document.body).width()-80+"px"},0);

                }else{
                    $(".authlistTop_top").animate({width:$(document.body).width()-200+"px"},0);
                }
            });
        }
        // function initView(p, id) {
        //     var module = p;
        //     requirejs.undef(module);
        //     require([module], function(module) {
        //         ko.cleanNode($('.Upview')[0]);
        //         $('.Upview').html('');
        //         $('.Upview').html(module.template);
        //         if(module.model){
        //             module.model.data.content = ko.observableArray([]);
        //             ko.applyBindings(module.model, $('.Upview')[0]);
        //             module.init(id);
        //         }else{
        //             module.init(id, $('.Upview')[0]);
        //         }
        //         if($(".left_nav_operation_btn").hasClass("cur")){
        //             $(".authlistTop_top").animate({width:$(document.body).width()-80+"px"},0);

        //         }else{
        //             $(".authlistTop_top").animate({width:$(document.body).width()-200+"px"},0);
        //         }
        //     });
        // }





    menuleftClass();
    function menuleftClass(){
        var first = window.location.href.indexOf("#/");
        if(first>0){
            var page = window.location.href.split("#/")[1].split("/")[0];
            var page1 = window.location.href.split("#/")[1].split("/")[1];

        }else{
            var page= "";
            var page1= "";
        }
        if(page=="works"){
            $(".menuleftClass").eq(0).addClass("active");
        }else if(page=="shopedit" && page1=="edit"){
            $(".menuleftClass").eq(1).addClass("active");
        }else if(page=="shopedit" && page1=="detail"){
            $(".menuleftClass").eq(2).addClass("active");
        }else if(page=="shopping"){
            $(".menuleftClass").eq(3).addClass("active");
        }else if(page=="Info"){
            $(".menuleftClass").eq(4).addClass("active");
        }else if(page==""){
            window.router.setRoute('/works/list/list');
            
        }
    }

       

        function ToHtmlString(htmlStr) {
            return toTXT(htmlStr).replace(/\<\;br[\&ensp\;|\&emsp\;]*[\/]?\>\;|\r\n|\n/g, "<br/>");
        }
        function toTXT(str) {
            var RexStr = /\<|\>|\"|\'|\&|　| /g
            str = str.replace(RexStr,
                function (MatchStr) {
                    switch (MatchStr) {
                        case "<":
                            return "＜";
                            break;
                        case ">":
                            return "＞";
                            break;
                        case "\"":
                            return "＂";
                            break;
                        case "'":
                            return "'";
                            break;
                        case "&":
                            return "&";
                            break;
                        case " ":
                            return " ";
                            break;
                        case "　":
                            return " ";
                            break;
                        default:
                            break;
                    }
                }
            )
            return str;
        }
        $("#logout").click(function(){
            dialogminBack('注销','确定注销登录？',function(isok) {
                if(isok){
                    var Url = window.location.protocol+"//"+window.location.host+'/market'
                    window.location.href='/market/logout?SAMLRequest=true&service='+encodeURI(Url);
                    /*var data = {
                        userCode: window.sessionStorage.userCode,
                    };
                    $.ajax({
                        type : 'get',
                        url : "/market/logout?SAMLRequest=true&service=/market",
                        data : data,
                        dataType : 'json',
                        success : function(res) {
                            //console.log(res) ;
                            window.location.href="res.logouturl" ;
                        },
                        error : function(res) {
                            //console.log(res) ;
                           // window.location.href="/market" ;
                        }
                    });*/
                }
            });

        });
        
    window.$systemId = GetQueryString("systemId") || "ipu";
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    };
    window.console = window.console || (function(){
        var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
        return c;
    })();

    });