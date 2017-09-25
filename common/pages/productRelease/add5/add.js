define([ 'jquery', 'knockout', 'text!pages/productRelease/add5/add.html','dialogmin',
        'uploader','ueditor','ZeroClipboard','ajaxCom',
        'webuploaderdemo' ],
    function($, ko, template,dialogmin,WebUploader,UE,ZeroClipboard,ajaxCom) {
        window.ZeroClipboard = ZeroClipboard;
        var updataUrl = "/product/category";
        var productUrl = "/product/info/";
        var saveUrl = "/product/publish?step=4";//保存信息
        var submitUrl = "/product/publish/apply/";//提交审核

        var nextUrl = "/productRelease/add6/add/:productId";
        var prevUrl = "/productRelease/add4/add/:productId";


        addRouter(nextUrl);
        addRouter(prevUrl);
        var viewModel = {
            data :  ko.observable({}),
            codedata :  ko.observable(),
            productName :  ko.observable(),
            serviceScope : '',
            guide : '',
            agreement:"",
            ProStatus:""



        };
        viewModel.goback = function(){
            window.router.setRoute("/productRelease/add4/add/"+viewModel.productId);
        };
        viewModel.remove_PDF = function(){
            $(".proRe_pdf_logo").hide();
            $(".proRe_pdf").show();
            viewModel.upexplanation();
            viewModel.proPfd="";
        };
        viewModel.upexplanation = function(){
            var downurl = $ctx+'/file/down/pdf';
            var up = WebUploader.create({
                server: $ctx+'/file/upload/pdf',
                swf: 'trd/uploader/swf/Uploader.swf?v=' + Math.random(),
                pick: '.proRe_pdf',
                accept: [ //可以接受的文件类型，数组
                    {
                        title: 'pdf',
                        extensions: 'pdf',
                        mimeTypes: 'pdf/*'
                    }
                ],
                auto: true,
                compress: false
            });
            up.on("error",function (type){
                if (type=="Q_TYPE_DENIED"){
                    dialogmin("请上传pdf格式文件");
                }else if(type=="F_EXCEED_SIZE"){
                    dialogmin("文件大小不能超过10M");
                }
            });
            up.on( 'uploadSuccess', function( file, res ) {
                if(res.fileName != '-1'){  // -1  表示文件太大，没有上传
                    var proRe = $(".proRe_pdf_logo");
                    viewModel.guide = res.fileName;

                    if(proRe.css("display")=="none"){
                        $(".proRe_pdf").hide()
                        $(".proRe_pdf_logo").show()/*.find(".proRe_pdf_logo_left").on('click',function(){
                         window.open(downurl + "?id="+ res.fileName);
                         })*/
                        if(file.name){
                            $(".proRe_pdf_logo_right_p1").html(file.name)

                        }
                    }else {

                    }

                }
            });
            up.on( 'uploadError', function( file ) {
                dialogmin('上传失败');
            });
            up.on( 'fileQueued', function( file ) {
                if( file.size > 1024*1024*10) {
                    dialogmin("文件大小不能超过10M");
                    return false;
                }

            });
        }
        viewModel.submitMo = function(preview) {
            viewModel.GetData();
            if(viewModel.neData.serviceScope==undefined||viewModel.neData.serviceScope==""){
             dialogmin('请填写售后范围~');
             return false
             }if(viewModel.neData.agreement==undefined||viewModel.neData.agreement==""){
             dialogmin('请填写商品协议~');
             return false

            }
            if(JSON.stringify(viewModel.neData) == JSON.stringify(viewModel.LoadHasData)){
                if(viewModel.ProStatus==4 || viewModel.ProStatus==1 || viewModel.ProStatus==5){
                    viewModel.Gosubmit();
                }else{
                    window.router.setRoute("/productRelease/add6/add/"+viewModel.productId)

                }

            }else{
                   if(viewModel.ProStatus==4 || viewModel.ProStatus==1 || viewModel.ProStatus==5){
                        viewModel.SaveInfo(viewModel.neData);
                        viewModel.Gosubmit();
                    }else{
                        viewModel.SaveInfo(viewModel.neData);
                        dialogmin("保存成功");
                        window.router.setRoute("/productRelease/add6/add/"+viewModel.productId)
                    }
            }
            
        }
        viewModel.GetData =function(){// 数据
            viewModel.neData = {
                "productId":viewModel.productId,    //产品id，必填
                "serviceScope":UE.getEditor(viewModel.serviceScope).getContent(),
                "agreement":UE.getEditor(viewModel.agreement).getContent(),
                "guide":viewModel.guide,
                "isAjax":1,
                "step":"5"

            }
            
        }
        viewModel.SaveInfo =function(){// 保存信息
            //viewModel.GetData();
            ajaxCom.asyncajax('post',saveUrl,JSON.stringify(viewModel.neData),function(res){
                if (res.status==1){
                    
                }else{
                    dialogmin(res.msg);
                }
            },function(error){
                var res = JSON.parse(error.responseText)
                dialogmin(res.msg || "网络错误");
            })
        }
       viewModel.Gosubmit =function(){//提交审核
            ajaxCom.asyncajax('GET',submitUrl+viewModel.productId,{isAjax:1},function(res){
                if (res.status==1){
                    window.router.setRoute("/productRelease/add6/add/"+viewModel.productId);
                }else{
                    dialogmin(res.msg);
                }
            },function(error){
                var res = JSON.parse(error.responseText)
                dialogmin(res.msg || "网络错误");
            })
        }
        viewModel.preview = function(){//预览
            //viewModel.submitMo("preview");
            viewModel.GetData();
            if(JSON.stringify(viewModel.neData) != JSON.stringify(viewModel.LoadHasData)){
                viewModel.SaveInfo();
            }
            var iframe = $("#iframe_productRelease");
            $(".productRelease_tmp").show();
            iframe.attr("src","/market/product/preview/"+viewModel.productId);
            iframe.height($(window).height()-150);
            iframe.load(function(){
                iframe.contents().find(".container-whole").hide();
            });

        };
        viewModel.closeiframe = function (){
            $(".productRelease_tmp").hide();

        }
        viewModel.Ueditor = function(con,con2){ //富文本初始化
            var  tId = "editor"+new Date().getTime();
            $(".productR_myEditor").attr("id",tId);
            viewModel.serviceScope = tId;
            var ue = UE.getEditor(tId, {
                initialContent:"服务时间：周一至周五  9:00-17:00 <br/>服务范围： <br/>业务范围：",
                indentValue:"1px"
            });
            ue.ready(function() {
                $(".serviceScopeEditor iframe").contents().find(".view").css("text-indent","0")

                if(con){
                    ue.setContent(con);
                }else{

                }

                var html = ue.getContent();
                var txt = ue.getContentTxt();
                viewModel.LoadHasData.serviceScope =UE.getEditor(viewModel.serviceScope).getContent();
            });
            var  tId2 = "editor2"+new Date().getTime();
            $(".productR_myEditor2").attr("id",tId2);
            viewModel.agreement = tId2;
            var ue2 = UE.getEditor(tId2, {
                maximumWords:10000
            });
            ue2.ready(function() {
                if(con2){
                    ue2.setContent(con2);

                }
                var html = ue2.getContent();
                var txt = ue2.getContentTxt();
                viewModel.LoadHasData.agreement =UE.getEditor(viewModel.agreement).getContent();
            });
        };



        var init = function(parm){
            viewModel.productId = parm[0];
            //viewModel.setTimes();
            viewModel.upexplanation();
            $('body').scrollTop(0)

            ajaxCom.Loadajax('get',productUrl+viewModel.productId,{isAjax:1},function(res){
                var categoryId = res.data.productMarket;
                viewModel.productName(res.data.productName);
                viewModel.data(res.data);
                viewModel.Ueditor(res.data.serviceScope,res.data.agreement);
                viewModel.ProStatus = res.data.status;
                 viewModel.LoadHasData= {
                    "productId":res.data.productId,    //产品id，必填
                    "serviceScope":"",
                    "agreement":"",
                    "guide":res.data.guide,
                    "isAjax":1,
                    //"serviceTime":$(".serviceTime").val(),
                    "step":"5"
                }
                if(res.data.guide !=null &&res.data.guide !="" ){
                    $(".proRe_pdf").hide();
                    $(".proRe_pdf_logo").show();
                    viewModel.guide =res.data.guide
                }
               /* if(res.data.serviceTime == "" || res.data.serviceTime == null){
                    $(".serviceTime").val("9:00 - 17:00")
                }*/


            });
            $(".tips_hover").on('mouseover',function(){
                $(".tips_img").show();
            }).on('mouseleave',function(){
                $(".tips_img").hide();
            })
        };
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });