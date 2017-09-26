define([ 'jquery', 'knockout', 'text!pages/productRelease/add2/add.html','dialogmin',
        'uploader','ueditor','ZeroClipboard','ajaxCom','webuploaderdemo','bootstrapSelect' ],
    function($, ko, template,dialogmin,WebUploader,UE,ZeroClipboard,ajaxCom) {
        window.ZeroClipboard = ZeroClipboard;

        var updataUrl = "/product/category";
        var productUrl = "/product/info/";
        var submitUrl = "/product/publish?step=2";
        var labelUrl = "/label/getAll";

        var nextUrl = "/productRelease/add3/add/:productId";
        var prevUrl = "/productRelease/add/add/:productId";


        addRouter(nextUrl);
        addRouter(prevUrl);
        var viewModel = {
            data :  ko.observable({}),
            codedata :  ko.observable(),
            appdata :  ko.observable(),
            productId:"",
            productName:ko.observable(),
            ApplyTypedata :  ko.observable(),
            labeldata :  ko.observable(),
            myEditor:"",
            detailimg:"",
            detailimg2:"",
            PKcategoryId:"",
            proPfd:""

    };
        viewModel.goback = function(){
            window.router.setRoute("/productRelease/add/add/"+viewModel.productId);
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
                swf: $ctx+'/common/trd/uploader/swf/Uploader.swf?v=' + Math.random(),
                pick: '.proRe_pdf',
                accept: [ //可以接受的文件类型，数组
                    {
                        title: 'pdf',
                        extensions: 'pdf',
                        mimeTypes: 'pdf/pdf'
                    }
                ],
                fileNumLimit:1,
                auto: true,
                compress: false
            });
            up.on("error",function (type){
                if (type=="Q_TYPE_DENIED"){
                    dialogmin("请上传pdf格式文件");
                }else if(type=="F_EXCEED_SIZE"){
                    dialogmin("文件大小不能超过10M");
                }else if(type=="Q_EXCEED_NUM_LIMIT"){
                    dialogmin("文件个数不能超过1");
                }
            });
            up.on( 'uploadSuccess', function( file, res ) {
                if(res.fileName != '-1'){  // -1  表示文件太大，没有上传
                    var proRe = $(".proRe_pdf_logo");
                    viewModel.proPfd =  res.fileName;

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
        viewModel.submitMo = function() {
            viewModel.detailimg="";
            viewModel.detailimg2="";
            $("#uploader .imgWrap").each(function(e){
                var _this = $(this);
                var s =  _this.find("img").attr("src");

                if(s.indexOf("https://")>-1){
                    if(viewModel.detailimg!=""){
                        viewModel.detailimg+=","+s
                    }else{
                        viewModel.detailimg+=s
                    }

                }


            })
            $("#uploader2 .imgWrap").each(function(e){
                var _this = $(this);
                var s =  _this.find("img").attr("src");

                if(s.indexOf("https://")>-1){
                    if(viewModel.detailimg2!=""){
                        viewModel.detailimg2+=","+s
                    }else{
                        viewModel.detailimg2+=s
                    }

               }


            });
            if(viewModel.detailimg!="" && viewModel.detailimg.split(",").length>10){
                    dialogmin("商品截图不能超过10张")
                    return
            }
            if(viewModel.detailimg2!="" && viewModel.detailimg2.split(",").length>10){
                    dialogmin("商品图片不能超过10张")
                    return
            }
            var usableOsVal = $("#usableOs").val();
            if(usableOsVal != null && usableOsVal.length>1){
                usableOsVal = usableOsVal.join(",");
            }else if(usableOsVal != null){
                usableOsVal = usableOsVal[0];
            }
            var labelVal = $("#label").val();
            if(labelVal != null && labelVal.length>1){
                labelVal = labelVal.join(",");
            }else if(labelVal != null){
                labelVal = labelVal[0];
            }
            var neData = {
                "productId":viewModel.productId,    //产品id，必填
                "productCategory1":$("#appcategory").val(),  //枚举，非必填（marketing-营销, purchase-采购, social_joint-社交协同, finance-财务, hr-人力资源, enterprise_communication-企业通讯, data-数据 ）
                "deliverMode":viewModel.data().deliverMode,    //交付方式，必填，目前是指定值"SAAS"
                "brief":viewModel.data().brief,         //产品简介，必填，较详细文字说明，100字以内
                "screenshot":viewModel.detailimg ,   //产品截图，必填（多个URL，按照","分割；真实产品使用的截图，上传不超过6张，每张大小不超过1M）
                "productImg":viewModel.detailimg2 ,   //产品截图，必填（多个URL，按照","分割；真实产品使用的截图，上传不超过6张，每张大小不超过1M）
                "logo":$(".img-responsive").attr("src") || "",     //产品logo，必填（上传1张大小不超过200K大小的图片）
                "seoKeywords":viewModel.data().seoKeywords,
                "htmlTitle":viewModel.data().htmlTitle,
                "htmlDescription":viewModel.data().htmlDescription,
                "slogan":viewModel.data().slogan,
                "versionNum":viewModel.data().versionNum,       //版本号，非必填
                "detail":UE.getEditor(viewModel.myEditor).getContent(),    //产品说明，必填（详细介绍产品的功能、产品特点、应用场景、可提供的服务及使用流程等）
                "usableOs":usableOsVal,     //产品适用的操作系统，必填，枚举，WINDOWS, IOS, OSX, ANDROID, LINUX
                "label":labelVal,
                "explanation":viewModel.proPfd,
                "customerGroup":viewModel.data().customerGroup,
                "relativeProduct":viewModel.data().relativeProduct,
                "isAjax":1,
                "step":"2"


            }
            if(neData.versionNum==null||neData.versionNum==""){
                dialogmin('请填写版本号');
                return false
            }
            if(neData.productCategory1==null||neData.productCategory1==""){
                dialogmin('请选择所属类目');
                return false
            }
            if(neData.brief==null||neData.brief==""){
                dialogmin('请填写商品简介');
                return false
            }
            if(neData.versionNum==null||neData.versionNum==""){
                dialogmin('请填写版本号');
                return false
            }
            if(neData.productCategory1==null||neData.productCategory1==""){
                dialogmin('请选择所属类目');
                return false
            }if(neData.productImg==null||neData.productImg==""){
                dialogmin('请上传商品图片');
                return false
            }if(neData.logo==null||neData.logo==""){
                dialogmin('请上传商品图标');
                return false
            }if(neData.slogan==null||neData.slogan==""){
                dialogmin('请填写宣传语');
                return false
            }if(neData.detail==null||neData.detail==""){
                dialogmin('请填写商品说明');
                return false
            }if(neData.detail.length>20000){
                dialogmin('商品说明字符不能超过最大值');
                return false
            }if(neData.usableOs==null||neData.usableOs==""){
                dialogmin('请填写适用系统');
                return false
            }if(neData.label==null||neData.label==""){
                dialogmin('请填写标签');
                return false
            }
            if(JSON.stringify(neData) == JSON.stringify(viewModel.LoadHasData)){
                if(viewModel.apilinkPK !=''){
                    window.router.setRoute("/productRelease/add3API/add/"+viewModel.LoadHasData.productId);
                }else{
                    window.router.setRoute("/productRelease/add3/add/"+viewModel.LoadHasData.productId);

                }
               

            }else{
                ajaxCom.asyncajax('post',submitUrl,JSON.stringify(neData),function(res){
                    if (res.status==1){
                        if(viewModel.apilinkPK !=''){
                            window.router.setRoute("/productRelease/add3API/add/"+res.data.productId);
                        }else{
                            window.router.setRoute("/productRelease/add3/add/"+res.data.productId);

                        }

                    }else{
                        dialogmin(res.msg);
                    }
                },function(error){
                    var res = JSON.parse(error.responseText)
                    dialogmin(res.msg || "网络错误");
                })
            }
            /*$.ajax({
                type : 'post',
                dataType : 'json',
                async : false,
                data : JSON.stringify(neData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url :  submitUrl,
                success : function(res) {
                    if (res.status==1){
                        if(viewModel.PKcategoryId =='ebe649e0-5bcd-8638-3242-e17e773490c2'){
                            window.router.setRoute("/productRelease/add3API/add/"+res.data.productId);
                        }else{
                            window.router.setRoute("/productRelease/add3/add/"+res.data.productId);

                        }

                    }else{
                        dialogmin(res.msg);
                    }
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    var res = JSON.parse(XMLHttpRequest.responseText)
                    dialogmin(res.msg || "网络错误");
                }
            });*/

        }
        viewModel.setTimes = function(){//周期单选
            $('.sell_times input[type=checkbox]').click(function(){
                $(this).attr('checked','checked').parent().siblings().find("input").removeAttr('checked');
                viewModel.sell_time = $(this).val()
            });
        };
        viewModel.Ueditor = function(con){ //富文本初始化
            var  tId = "editor"+new Date().getTime();
            $(".editorMyprductR").attr("id",tId);
            viewModel.myEditor = tId;
            var ue = UE.getEditor(tId, {

            });
            ue.ready(function() {
                if(con){
                    ue.setContent(con);
                    
                }
                var html = ue.getContent();
                var txt = ue.getContentTxt();
                viewModel.LoadHasData.detail = UE.getEditor(viewModel.myEditor).getContent();
            });
        };
        viewModel.UpdateLogo = function(){ //LOGO上传
            /*if( viewModel.data().userAvator == '' ){
                var d = viewModel.data();
               // d.userAvator = $ctx+ '/images/default.jpg'  ;
                viewModel.data(d);
            }*/

        	var downurl = '/market/file/down/img';
            var up = WebUploader.create({

                server: $ctx+'/file/upload/img',
                swf: $ctx+'/common/trd/uploader/swf/Uploader.swf?v=' + Math.random(),
                pick: '.up',
                accept: [ //可以接受的文件类型，数组
                    {
                        title: 'Images',
                        extensions: 'jpg,jpeg,png',
                        mimeTypes: 'image/jpg,image/jpeg,image/png'
                    }
                ],
                auto: true,
                compress: false,
                fileSingleSizeLimit:200*1024
            });
            up.on("error",function (type){
                if (type=="Q_TYPE_DENIED"){
                    dialogmin("请上传图片格式文件");
                }else if(type=="F_EXCEED_SIZE"){
                    dialogmin("文件大小不能超过200k");
                }else if(type=="Q_EXCEED_NUM_LIMIT"){
                    dialogmin("文件个数不能超过10");
                }
            });
            up.on( 'uploadSuccess', function( file, res ) {
                if(res.fileName != '-1'){  // -1  表示文件太大，没有上传

                    $(".product_add_icon ").addClass("hasImg");

                    $(".product_add_icon img").attr("src",res.fileName).css("visibility","hidden");

                }
            });
            up.on( 'uploadError', function( file ) {
                dialogmin('上传失败');
            });
            up.on( 'uploadFinished', function( file ) {
                setTimeout(function(){
                    var widthImg = $(".hasImg img").width();
                    var heightImg = $(".hasImg img").height();
                    if(widthImg<=heightImg){
                        $(".hasImg").addClass("ImgHeight")
                        $(".hasImg").removeClass("ImgWidth")
                    }else {
                        $(".hasImg").addClass("ImgWidth")
                        $(".hasImg").removeClass("ImgHeight")

                    }
                    $(".product_add_icon img").css("visibility","visible");
                },500)

            });
            up.on( 'fileQueued', function( file ) {
                if( file.size > 1024*200) {
                    dialogmin("文件大小不能超过200k");
                    return false;
                }

            });
        };
        viewModel.ImagesUp = function(wrapId,filePickerId,filePickerId2,sreenshot,shottype){//多图上传方法
            var
                $wrap = $(wrapId),
            // 图片容器
                $queue = $('<ul class="filelist"></ul>').appendTo( $wrap.find('.queueList') ),
            // 状态栏，包括进度和控制按钮
                $statusBar = $wrap.find('.statusBar'),
            // 文件总体选择信息。
                $info = $statusBar.find('.info'),
            // 上传按钮
                $upload = $wrap.find('.uploadBtn'),
            // 没选择文件之前的内容。
                $placeHolder = $wrap.find('.placeholder'),
            // 总体进度条
                $progress = $statusBar.find('.progress').hide(),
            // 添加的文件数量
                fileCount = 0,
            // 添加的文件总大小
                fileSize = 0,
            // 优化retina, 在retina下这个值是2
                ratio = window.devicePixelRatio || 1,
            // 缩略图大小
                thumbnailWidth = 110 * ratio,
                thumbnailHeight = 110 * ratio,
            // 可能有pedding, ready, uploading, confirm, done.
                state = 'pedding',
            // 所有文件的进度信息，key为file id
                percentages = {},
                supportTransition = (function(){
                    var s = document.createElement('p').style,
                        r = 'transition' in s ||
                            'WebkitTransition' in s ||
                            'MozTransition' in s ||
                            'msTransition' in s ||
                            'OTransition' in s;
                    s = null;
                    return r;
                })(),
            // WebUploader实例
                uploader;
            if ( !WebUploader.Uploader.support() ) {
                alert( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
                throw new Error( 'WebUploader does not support the browser you are using.' );
            }
            // 实例化
            uploader = WebUploader.create({
                pick: {
                    id: filePickerId,
                    label: '点击选择图片'
                },
                dnd: '.queueList',
                paste: document.body,

                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/jpg,image/jpeg,image/png'
                },
                server: $ctx+'/file/upload/img',
                // swf文件路径
                swf: $ctx+'/common/trd/uploader/swf/Uploader.swf?v=' + Math.random(),
                disableGlobalDnd: true,
                chunked: false,
                // server: 'http://webuploader.duapp.com/server/fileupload.php',
                fileNumLimit: 10,
                thumb:{
                    width: 110,
                    height: 110,
                    quality: 100,
                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: false,
                    crop: false,
                    type: 'image/jpeg'
                },
                duplicate:false,
                compress:false,
                fileSizeLimit: 50 * 1024 * 1024,    // 200 M
                fileSingleSizeLimit: 5 * 1024 * 1024    // 50 M
            });
            // 添加“添加文件”的按钮，
            uploader.addButton({
                id: filePickerId2,
                label: '继续添加'
            });

            // 当有文件添加进来时执行，负责view的创建
            function addFile( file ) {
                var $li = $( '<li id="' + file.id + '">' +
                        '<p class="title">' + file.name + '</p>' +
                        '<p class="imgWrap"></p>'+
                        '<p class="progress"><span></span></p>' +
                        '</li>' ),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">删除</span>' +
                        '<span class="rotateRight">向右旋转</span>' +
                        '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
                    $prgress = $li.find('p.progress span'),
                    $wrap = $li.find( 'p.imgWrap' ),
                    $info = $('<p class="error"></p>'),
                    showError = function( code ) {
                        switch( code ) {
                            case 'exceed_size':
                                text = '文件大小超出';
                                break;

                            case 'interrupt':
                                text = '上传暂停';
                                break;

                            default:
                                text = '上传失败，请重试';
                                break;
                        }

                        $info.text( text ).appendTo( $li );
                    };

                if ( file.getStatus() === 'invalid' ) {
                    showError( file.statusText );
                } else {
                    // @todo lazyload
                    $wrap.text( '预览中' );
                    if(file.loaded){

                        var img = $('<img src="'+file.filename+'">');
                        $wrap.empty().append( img );
                    }else{
                        uploader.makeThumb( file, function( error, src ) {

                            if ( error ) {
                                $wrap.text( '不能预览' );
                                return;
                            }

                            var img = $('<img src="'+src+'">');
                            $wrap.empty().append( img );
                        }, thumbnailWidth, thumbnailHeight );
                    }

                    percentages[ file.id ] = [ file.size, 0 ];
                    file.rotation = 0;
                }
                file.on('statuschange', function( cur, prev ) {
                    if ( prev === 'progress' ) {
                        $prgress.hide().width(0);
                    } else if ( prev === 'queued' ) {
                        //$li.off( 'mouseenter mouseleave' );
                        //$btns.remove();
                    }
                    // 成功
                    if ( cur === 'error' || cur === 'invalid' ) {
                        showError( file.statusText );
                        percentages[ file.id ][ 1 ] = 1;
                    } else if ( cur === 'interrupt' ) {
                        showError( 'interrupt' );
                    } else if ( cur === 'queued' ) {
                        //percentages[ file.id ][ 1 ] = 0;
                    } else if ( cur === 'progress' ) {
                        $info.remove();
                        $prgress.css('display', 'block');
                    } else if ( cur === 'complete' ) {
                        $li.append( '<span class="success"></span>' );
                    }
                    $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
                });
                $li.on( 'mouseenter', function() {
                    $btns.stop().animate({height: 30});
                });
                $li.on( 'mouseleave', function() {
                    $btns.stop().animate({height: 0});
                });
                $btns.on( 'click', 'span', function() {
                    var index = $(this).index(),
                        deg;
                    switch ( index ) {
                        case 0:
                            uploader.removeFile( file );
                            return;
                        case 1:
                            file.rotation += 90;
                            break;
                        case 2:
                            file.rotation -= 90;
                            break;
                    }
                    if ( supportTransition ) {
                        deg = 'rotate(' + file.rotation + 'deg)';
                        $wrap.css({
                            '-webkit-transform': deg,
                            '-mos-transform': deg,
                            '-o-transform': deg,
                            'transform': deg
                        });
                    } else {
                        $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
                        // use jquery animate to rotation
                        // $({
                        //     rotation: rotation
                        // }).animate({
                        //     rotation: file.rotation
                        // }, {
                        //     easing: 'linear',
                        //     step: function( now ) {
                        //         now = now * Math.PI / 180;

                        //         var cos = Math.cos( now ),
                        //             sin = Math.sin( now );

                        //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
                        //     }
                        // });
                    }


                });
                $li.appendTo( $queue );
            }

            // 负责view的销毁
            function removeFile( file ) {
                var $li = $('#'+file.id);
                delete percentages[ file.id ];
                updateTotalProgress();
                $li.off().find('.file-panel').off().end().remove();
            }

            function updateTotalProgress() {
                var loaded = 0,
                    total = 0,
                    spans = $progress.children(),
                    percent;
                $.each( percentages, function( k, v ) {
                    total += v[ 0 ];
                    loaded += v[ 0 ] * v[ 1 ];
                } );
                percent = total ? loaded / total : 0;
                spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
                spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
                updateStatus();
            }

            function updateStatus() {
                var text = '', stats;
                if ( state === 'ready' ) {
                    text = '选中' + fileCount + '张图片' /*+
                     WebUploader.formatSize( fileSize ) */+ '。';
                } else if ( state === 'confirm' ) {
                    stats = uploader.getStats();
                    if ( stats.uploadFailNum ) {
                        text = '已成功上传' + stats.successNum+ '张照片至相册，'+
                            stats.uploadFailNum + '张照片上传失败，<a class="retry cursor">重新上传</a>失败图片'
                    }
                } else {
                    stats = uploader.getStats();
                    text = '共' + fileCount + '张';

                    if ( stats.uploadFailNum ) {
                        text += '，失败' + stats.uploadFailNum + '张';
                    }
                }
                $info.html( text );
            }

            function setState( val ) {
                var file, stats;
                if ( val === state ) {
                    return;
                }
                $upload.removeClass( 'state-' + state );
                $upload.addClass( 'state-' + val );
                state = val;
                switch ( state ) {
                    case 'pedding':
                        $placeHolder.removeClass( 'element-invisible' );
                        $queue.parent().removeClass('filled');
                        $queue.hide();
                        $statusBar.addClass( 'element-invisible' );
                        uploader.refresh();
                        break;
                    case 'ready':
                        $placeHolder.addClass( 'element-invisible' );
                        $( filePickerId2 ).removeClass( 'element-invisible');
                        $queue.parent().addClass('filled');
                        $queue.show();
                        $statusBar.removeClass('element-invisible');
                        uploader.refresh();
                        break;
                    case 'uploading':
                        $( filePickerId2 );
                        $progress.show();
                        $upload.text( '暂停上传' );
                        break;
                    case 'paused':
                        $progress.show();
                        $upload.text( '继续上传' );
                        break;
                    case 'confirm':
                        $progress.hide();
                        $upload.text( '开始上传' );

                        stats = uploader.getStats();
                        if ( stats.successNum && !stats.uploadFailNum ) {
                            setState( 'finish' );
                            return;
                        }
                        break;
                    case 'finish':
                        stats = uploader.getStats();
                        if ( stats.successNum ) {
                            console.log( '上传成功' );
                        } else {
                            // 没有成功的图片，重设
                            state = 'done';
                            location.reload();
                        }
                        break;
                }
                updateStatus();
            }
            uploader.on('ready', function() {
                window.uploader = uploader;

                //if(fileid){
                //获取数据

                var json = sreenshot;
                if(json=="" || json==null){
                    return
                }
                var arrayj = json.split(",")
                var jsonLen=arrayj.length;
                if(jsonLen!=0){
                    fileCount=jsonLen;
                    $placeHolder.addClass( 'element-invisible' );
                    $statusBar.show();
                    //显示在页面上
                    $.each(arrayj,function(i,n){
                        if(arrayj[i]!= ""){


                        fileSize += n.filelen;
                        var obj={},statusMap={}
                            ,file_id='WU_FILE_h'+shottype + i;
                        obj.id=file_id ;
                        obj.name="";
                        obj.filename=n;
                        obj.getStatus=function() {
                            return '';
                        };
                        obj.setStatus=function() {
                            return '';
                        };
                        obj.statusText='';
                        obj.size=100;
                        obj.version=WebUploader.Base.version;
                        obj.type="image/"+n.split(".")[1];
                        obj.filetype=n.split(".")[1];
                        obj.source=this;
                        obj.loaded=true;
                        obj.on=function( status, text ) {

                            var prevStatus = statusMap[ this.id ];

                            typeof text !== 'undefined' && (this.statusText = text);

                            if ( status !== prevStatus ) {
                                statusMap[ this.id ] = status;
                                uploader.trigger( 'statuschange', status, prevStatus );
                            }

                        };

                        addFile(obj);
                        }

                    });

                    WebUploader.Base.idSuffix=jsonLen;

                    setState( 'ready' );
                    updateTotalProgress();
                }

                //}
            });

            uploader.onUploadProgress = function( file, percentage ) {
                var $li = $('#'+file.id),
                    $percent = $li.find('.progress span');
                $percent.css( 'width', percentage * 100 + '%' );
               // percentages[ file.id ][ 1 ] = percentage;
                updateTotalProgress();
            };

            uploader.onFileQueued = function( file ) {
                fileCount++;
                fileSize += file.size;
                if ( fileCount === 1 ) {
                    $placeHolder.addClass( 'element-invisible' );
                    $statusBar.show();
                }
                if(fileCount<11){
                    addFile( file );
                    setState( 'ready' );
                    updateTotalProgress();
                }else{
                    fileCount--;
                    dialogmin("图片数量不能大于10")
                }

            };

            uploader.onFileDequeued = function( file ) {
                fileCount--;
                fileSize -= file.size;
                if ( !fileCount ) {
                    setState( 'pedding' );
                }
                removeFile( file );
                updateTotalProgress();

            };
            uploader.on( 'all', function( type ) {
                var stats;
                switch( type ) {
                    case 'uploadFinished':
                        setState( 'confirm' );
                        break;

                    case 'startUpload':
                        setState( 'uploading' );
                        break;

                    case 'stopUpload':
                        setState( 'paused' );
                        break;

                }
            });
            uploader.on("error",function (type){
                if (type=="Q_TYPE_DENIED"){
                    dialogmin("请上传图片格式文件");
                }else if(type=="F_EXCEED_SIZE"){
                    dialogmin("文件大小不能超过5M");
                }else if(type=="Q_EXCEED_NUM_LIMIT"){
                    dialogmin("文件个数不能超过10");
                }else if(type=="F_DUPLICATE"){
                    dialogmin("请不要重复上传");
                }
            });
          /*  uploader.onError = function( code ) {
                alert( 'Eroor: ' + code );
            };*/
            uploader.on( 'uploadSuccess', function( file, res ) {
                var downurl = $ctx+'/file/down/img';
                if(res.fileName != '-1'){  // -1  表示文件太大，没有上传
                    /*if(shottype==1){
                        if(viewModel.detailimg!=""){
                            viewModel.detailimg+=","+ res.fileName
                        }else{
                            viewModel.detailimg+= res.fileName
                        }
                    }else{
                        if(viewModel.detailimg2!=""){
                            viewModel.detailimg2+=","+ res.fileName
                        }else{
                            viewModel.detailimg2+= res.fileName
                        }
                    }*/
                    $("#"+file.id).find(".imgWrap img").attr("src",res.fileName)

                }
            });
            $upload.on('click', function() {
                if ( $(this).hasClass( 'disabled' ) ) {
                    return false;
                }

                if ( state === 'ready' ) {
                    uploader.upload();
                } else if ( state === 'paused' ) {
                    uploader.upload();
                } else if ( state === 'uploading' ) {
                    uploader.stop();
                }
            });

            $info.on( 'click', '.retry', function() {
                uploader.retry();
            } );

            $info.on( 'click', '.ignore', function() {
                alert( 'todo' );
            } );

            $upload.addClass( 'state-' + state );
            updateTotalProgress();
        };

        viewModel.placeholder = function(obj) {//IE placeholder 兼容
            var $input = obj;
            var val = obj.attr("placeholder");

            if($input.val()==""){
                $input.val(val);
            }
            $input.focus(function() {
                if ($input.val() == val) {
                    $(this).val("");
                }
            }).blur(function() {
                if ($input.val() == "") {
                    $(this).val(val);
                }
            });
        }
        var init = function(parm){
            $('body').scrollTop(0)
            viewModel.productId = parm[0];
            viewModel.setTimes();

            viewModel.UpdateLogo();
            viewModel.upexplanation();
            $('.product_select_2 select').selectpicker({
                    'selectedText': 'cat',
                    'dropupAuto': false

                });
        ajaxCom.Loadajax('get',productUrl+viewModel.productId,{isAjax:1},function(res){
            var categoryId = res.data.productMarket;
            var productCategory1 = res.data.productCategory1;
            var label = "";
            var HasLabel = res.data.label;
            var HasusableOs = res.data.usableOs;
            var usableOs = "";
            viewModel.PKcategoryId = categoryId;
            viewModel.apilinkPK = res.data.apilinkPK;
            if (res.data.status==3) {
                $("#appcategory,#deliverMode").attr("disabled", true).addClass("gred");
                $("#appcategory,#deliverMode").next(".select_bars").hide();
                $("#usableOs").attr("disabled", true).addClass("gred");
                $("#usableOs").next(".select_bars").hide();

            }
            if (res.data.label != null && res.data.label.length > 1) {
                label = res.data.label.split(",");
            } else if (res.data.label != null && res.data.label.length == 1) {
                label = res.data.label[0];
            }
            if (res.data.usableOs != null && res.data.usableOs.length > 1) {
                usableOs = res.data.usableOs.split(",");
            } else if (res.data.usableOs != null && res.data.usableOs.length == 1) {
                usableOs = res.data.usableOs[0];
            }
            $('#deliverMode').selectpicker({
                    'selectedText': 'cat',
                    //'noneSelectedText': 'SaaS',
                    'dropupAuto': false


            });
            $('#deliverMode').selectpicker('val', res.data.deliverMode || 0);
            $('#usableOs').selectpicker({
                    'selectedText': 'cat',
                    'noneSelectedText': '请选择',
                    'dropupAuto': false


            });
            $('#usableOs').selectpicker('val', usableOs);
            // UE.getEditor(viewModel.myEditor).setContent();
            ajaxCom.asyncajax('get', updataUrl, {isAjax:1}, function (res) {
                  for (var i = 0; i < res.data.length; i++) {
                      if (res.data[i].categoryId == categoryId) {
                          viewModel.ApplyTypedata(res.data[i].productCategoryDtoList)
                      }
                  }
                  //$("#appcategory").val(productCategory1)
               
                $('#appcategory').selectpicker({
                    'selectedText': 'cat',
                     'noneSelectedText': '请选择',
                    'dropupAuto': false

                });
                 $('#appcategory').selectpicker('val', productCategory1);
               
              });
            ajaxCom.Loadajax('get', labelUrl,{isAjax:1}, function (res) {
                viewModel.labeldata(res.data);
               
                $('#label').selectpicker({
                    'selectedText': 'cat',
                    'noneSelectedText': '请选择',
                    'maxOptions':5,
                    'maxOptionsText':'最多选择5个',
                    'dropupAuto': false
                });
                $('#label').selectpicker('val', label);
               

            });
            

            if (res.data.logo != "" && res.data.logo != null) {
                $(".product_add_icon ").addClass("hasImg");

                var widthImg = $(".hasImg img").width();
                var heightImg = $(".hasImg img").height();
                if (widthImg > heightImg) {
                    $(".hasImg").addClass("ImgWidth")
                } else {
                    $(".hasImg").addClass("ImgHeight")
                }
            }
            if (res.data.explanation != null && res.data.explanation != "") {
                $(".proRe_pdf").hide();
                $(".proRe_pdf_logo").show();
                viewModel.proPfd =res.data.explanation
            }


            viewModel.productName(res.data.productName);
            viewModel.data(res.data);
            viewModel.LoadHasData = {
                    "productId":res.data.productId,    //产品id，必填
                    "productCategory1":res.data.productCategory1,  //枚举，非必填（marketing-营销, purchase-采购, social_joint-社交协同, finance-财务, hr-人力资源, enterprise_communication-企业通讯, data-数据 ）
                    "deliverMode":res.data.deliverMode,    //交付方式，必填，目前是指定值"SAAS"
                    "brief":res.data.brief,         //产品简介，必填，较详细文字说明，100字以内
                    "screenshot":res.data.screenshot,   //产品截图，必填（多个URL，按照","分割；真实产品使用的截图，上传不超过6张，每张大小不超过1M）
                    "productImg":res.data.productImg,   //产品截图，必填（多个URL，按照","分割；真实产品使用的截图，上传不超过6张，每张大小不超过1M）
                    "logo":res.data.logo,     //产品logo，必填（上传1张大小不超过200K大小的图片）
                    "seoKeywords":res.data.seoKeywords,
                    "htmlTitle":res.data.htmlTitle,
                    "htmlDescription":res.data.htmlDescription,
                    "slogan":res.data.slogan,
                    "versionNum":res.data.versionNum,       //版本号，非必填
                    "detail":"",    //产品说明，必填（详细介绍产品的功能、产品特点、应用场景、可提供的服务及使用流程等）
                    "usableOs":HasusableOs,     //产品适用的操作系统，必填，枚举，WINDOWS, IOS, OSX, ANDROID, LINUX
                    "label":HasLabel,
                    "explanation":res.data.explanation,
                    "customerGroup":res.data.customerGroup,
                    "relativeProduct":res.data.relativeProduct,
                    "isAjax":1,
                    "step":"2"
            }
            viewModel.Ueditor(res.data.detail);

            viewModel.ImagesUp('#uploader', '#filePicker', '#filePicker2', res.data.screenshot,1);
            viewModel.ImagesUp('#uploader2', '#filePicker3', '#filePicker4', res.data.productImg,2);
            
              $(".product_Detial").bind('keyup', function () {
                  var v = $(this).val()

                  if (v.length > 100) {
                      $(this).val(v.substring(0,100))
                      return;
                  }

              });
                      if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9.")
                      {
                          viewModel.placeholder($(".P_versionNum"))
                          viewModel.placeholder($(".P_slogan"))
                          viewModel.placeholder($(".product_Detial"))
                          viewModel.placeholder($(".Pr_keywords"))
                          viewModel.placeholder($(".Pr_title"))
                          viewModel.placeholder($(".Pr_description"))
                      }



        });


        }
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });