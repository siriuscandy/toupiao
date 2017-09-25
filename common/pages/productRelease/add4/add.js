define([ 'jquery', 'knockout', 'text!pages/productRelease/add4/add.html','dialogmin',
        'uploader','ueditor','ZeroClipboard','ajaxCom',
'webuploaderdemo' ],
    function($, ko, template,dialogmin,WebUploader,UE,ZeroClipboard,ajaxCom) {
        window.ZeroClipboard = ZeroClipboard;
        var updataUrl = "/product/category";
        var productUrl = "/product/info/";
        var submitUrl = "/product/publish?step=4";

        var nextUrl = "/productRelease/add5/add/:productId";
        var prevUrl = "/productRelease/add3/add/:productId";


        addRouter(nextUrl);
        addRouter(prevUrl);
        var viewModel = {
            data :  ko.observable({}),
            codedata :  ko.observable(),
            productName :  ko.observable(),
            qualification : '',
            caseScreenshot : '',
            myEditor:"",
            PKcategoryId:"",
            clientCase:""


        };
        viewModel.goback = function(){

            if(viewModel.apilinkPK!=''){
                window.router.setRoute("/productRelease/add3API/add/"+viewModel.productId);
            }else{
                window.router.setRoute("/productRelease/add3/add/"+viewModel.productId);

            }

        }
        viewModel.submitMo = function() {
            $("#uploader2 .imgWrap").each(function(e){
                var _this = $(this);
                var s =  _this.find("img").attr("src");

                if(s.indexOf("https://")>-1){
                    if(viewModel.qualification!=""){
                        viewModel.qualification+=","+s
                    }else{
                        viewModel.qualification+=s
                    }

                }


            })
            $("#uploader3 .imgWrap").each(function(e){
                var _this = $(this);
                var s =  _this.find("img").attr("src");

                if(s.indexOf("https://")>-1){
                    if(viewModel.caseScreenshot!=""){
                        viewModel.caseScreenshot+=","+s
                    }else{
                        viewModel.caseScreenshot+=s
                    }

                }


            })
            if(viewModel.qualification!="" && viewModel.qualification.split(",").length>10){
                dialogmin("商品资质不能超过10张")
                return
            }
            if(viewModel.caseScreenshot!="" && viewModel.caseScreenshot.split(",").length>10){
                dialogmin("案例截图不能超过10张")
                return
            }
            var neData = {

                "productId":viewModel.productId,    //产品id，必填
                "qualification":viewModel.qualification,
                "clientCase":UE.getEditor(viewModel.myEditor).getContent(),
                "caseScreenshot":viewModel.caseScreenshot,
                "isAjax":1,

                "step":"4"

            }

            if(JSON.stringify(neData) == JSON.stringify(viewModel.LoadHasData)){
                 window.router.setRoute("/productRelease/add5/add/"+viewModel.productId)

            }else{
                ajaxCom.asyncajax('post',submitUrl,JSON.stringify(neData),function(res){
                if (res.status==1){

                    window.router.setRoute("/productRelease/add5/add/"+viewModel.productId);
                }else{
                    dialogmin(res.msg);
                }
            },function(error){
                var res = JSON.parse(error.responseText)
                dialogmin(res.msg || "网络错误");
            })
            }
            

        }
        viewModel.setTimes = function(){//周期单选
            $('.sell_times input[type=checkbox]').click(function(){
                $(this).attr('checked','checked').parent().siblings().find("input").removeAttr('checked');
                viewModel.sell_time = $(this).val()
            });
        };
        viewModel.Ueditor = function(con){ //富文本初始化
            var  tId = "editor"+new Date().getTime();
            $(".productR_myEditor").attr("id",tId);
            viewModel.myEditor = tId;
            var ue = UE.getEditor(tId, {

            });
            ue.ready(function() {
                if(con){
                    ue.setContent(con);

                }
                var html = ue.getContent();
                var txt = ue.getContentTxt();
                viewModel.LoadHasData.clientCase =UE.getEditor(viewModel.myEditor).getContent();
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
                thumb:{
                    width: 110,
                    height: 110,
                    quality: 100,
                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: false,
                    crop: false,
                    type: 'image/jpeg'
                },
                compress:false,
                duplicate:false,
                fileNumLimit: 10,
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
                       // $li.off( 'mouseenter mouseleave' );
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
                        if(viewModel.qualification!=""){
                            viewModel.qualification+=","+ res.fileName
                        }else{
                            viewModel.qualification+= res.fileName
                        }
                    }else{
                        if(viewModel.caseScreenshot!=""){
                            viewModel.caseScreenshot+=","+ res.fileName
                        }else{
                            viewModel.caseScreenshot+= res.fileName
                        }
                    }
*/
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

        var init = function(parm){
            viewModel.productId = parm[0];
            viewModel.setTimes();
            $('body').scrollTop(0)


            ajaxCom.Loadajax('get',productUrl+viewModel.productId,{isAjax:1},function(res){
                var categoryId = res.data.productMarket;
                viewModel.PKcategoryId = categoryId;
                viewModel.apilinkPK = res.data.apilinkPK;
                viewModel.productName(res.data.productName);
                viewModel.data(res.data);
                viewModel.Ueditor(res.data.clientCase);
                viewModel.LoadHasData= {

                    "productId":res.data.productId,    //产品id，必填
                    "qualification":res.data.qualification,
                    "clientCase":"",
                    "caseScreenshot":res.data.caseScreenshot,
                    "isAjax":1,
                    "step":"4"
                }
                viewModel.ImagesUp('#uploader2','#filePicker3','#filePicker4',res.data.qualification,1);
                viewModel.ImagesUp('#uploader3','#filePicker5','#filePicker6',res.data.caseScreenshot, 2);

            });

        };
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });