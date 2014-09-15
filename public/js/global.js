$(function(){
    var win = window,
        doc = document;

    //菜单
	$("#submenu li.menu-read").hover(function() {
		$(this).addClass('sfHover');
		$(this).children('ul').show();
	}, function() {
		$(this).removeClass('sfHover');
		$(this).children('ul').hide();
	});

    $("#submenu li.menu-read").children('a').focus(function(){
        $(this).parent().addClass('sfHover');
        $(this).siblings().show();
    });

    //点赞
    $("body").on('click','a.addPraise',function(){
        var $that = $(this),
            $url = $that.attr('data-url');

        $.get($url).done(function(data){
            $that.children('span').html(data.site);
        }).fail(function(){
            alert("系统错误，请稍后重试!");
        })
    });

    //返回顶部
    $(win).scroll(function(){
        if ($(win).scrollTop()>400){
            $("#go-top").fadeIn(500);
        }else{
            $("#go-top").fadeOut(500);
        }
    });

    var _ajaxArt = function(data){
        var $str="";
        $.each(data.posts,function(i,value){
            //时间处理
            var $time = value.created.substring(0,10);
            //拼接字符串
            $str = $('<div class="one-third column"> '+
                        '<article class="post" id="post-6966">'+
                            '<a href="/article/'+ value._id +'" tabindex="-1" class="img-wrap">'+
                                '<img width="385" height="220" src="'+ value.imgUrl +'" class="attachment-thumbnail wp-post-image" alt="'+ value.title +'">'+
                            '</a>'+
                            '<div class="post-detail ">'+
                                '<div class="btitle">'+
                                    '<span class="author">'+
                                        '<span class="comment-avatar-wrap" tabindex="-1">'+
                                            '<img src="'+ value.authorIcon +'" width="20" height="20" alt="'+ value.author +'">'+
                                        '</span>'+
                                        '<span>'+ $time +'</span>'+
                                    '</span>'+
                                    '<h2>'+
                                        '<a href="/article/'+ value._id +'" rel="bookmark">'+ value.title +'</a>'+
                                    '</h2>'+
                                '</div>'+
                                '<div class="post-data fonts">'+
                                    '<a href="javascript:;" class="addPraise" data-url="/addPraise?id='+ value._id +'" title="点赞">'+
                                        '<i class="iconfont">&#xe644;</i>'+
                                        '<span>'+ value.addPraise +'</span>'+
                                    '</a>'+
                                    '<a href="/category/'+ value.classify +'" title="查看'+ value.classify +'中的全部文章">'+
                                        '<i class="iconfont">&#xe634;</i>'+
                                        '<span>'+ value.classify +'</span>'+
                                    '</a>'+
                                    '<a href="javascript::" title="浏览量">'+
                                        '<i class="iconfont">&#xe63e;</i>'+
                                        '<span>'+ value.clickCount +'</span>'+
                                    '</a>'+
                                '</div>'+
                            '</div>'+
                        '</article>'+
                    '</div>').hide();
            
            $("#homecontent").append($str);
            //输出
            $str.fadeIn();
        });
    }

    var page_more = function(){
        var $page=2;
        var $loadding_flag = true;


        //加载分页内容
        var page_show = function(){

            var $url = "/ajaxArticle?page="+ $page;

            $("#infscr-loading").show();

            $loadding_flag = false;

            $.get($url).done(function(data){

                if(data.posts.length > 0){

                    _ajaxArt(data);

                    $('#infscr-loading').hide();

                    $page++;

                    $loadding_flag = true;

                }else{
                    $('#infscr-loading').html("暂无更多内容！").fadeOut(1000);
                }
            }).fail(function(err){
                alert('系统错误，请稍后重试！');
            });
        }

        //首页瀑布流加载
        $(win).scroll(function(){
            var $ScrollBottom = $(doc).height() - $(win).height() - $(win).scrollTop();

            if ($ScrollBottom < 50 && $loadding_flag === true){
                page_show();
            }
        });
    }

    //信息详情点赞
    $("a.isux-like-btn").click(function(){
        var $that = $("a.isux-like-btn"),
            $url = $that.attr('data-url');

        $.get($url).done(function(data){

            $that.children('span').html(data.site);

        }).fail(function(){
            alert("系统错误，请稍后重试!");
        })
    });


	//移动相应
	$("div.menu_control").click(function(){
        $(this).toggleClass('menu_control_h');
		$(".top-fix .header").slideToggle(400);
	});

    //search
    $("#search input").keydown(function(event) {
        if (event.keyCode == 13) {
            var $val = $(this).val(),
                $url = $(this).attr("data-url");
            window.location.href = $url + $val;
        }
    });

    //判断首页加载
    if(UE_CONFIG.page_type =="index_page"){
        page_more();
    }

    //判断文章详细页面
    if(UE_CONFIG.page_type =="article_page"){

        //启动高亮设置
        $("pre.lang-html").snippet("html",{style:"whitengrey"});
        $("pre.lang-css").snippet("css",{style:"acid"});
        $("pre.lang-js").snippet("JavaScript",{style:"berries-light"});
        //判断预加载
        if($.browser.mozilla){ 
            $("div.pre-article a").attr("rel","prefetch");
            $("div.next-article a").attr("rel","prefetch");
        } else{
            $("div.pre-article a").attr("rel","prerender");
            $("div.next-article a").attr("rel","prerender");
        }
    }

    //判断云标签页面
    if(UE_CONFIG.page_type =="cloudTags_page"){
        //设置云标签字体颜色
        var $color = hsl2color([radomFuc(360), 100, 70]);   
        //var $size = radomFuc(50);

        var $li = $("#cloud_tag li");

        for(var i=0;i<$li.length;i++){  
            $li.eq(i).children("a").css({color:$color});    
            //$size = radomFuc(50);     
            $color = hsl2color([radomFuc(360), 100, 70]);
        }
    }


	//弹层
	// var tip = function(log,error){
	//     var str = '';
	//     str += "<div id='tip'>";
	//     str += "    <i></i>";   
	//     str += "    <span></span>";
	//     str += "</div>";
	//     if(error){
	//         if($("#tip").length>0){
	//            $("#tip i").removeClass("error");
	//            $("#tip span").html(log);
	//            $("#tip").fadeIn(1000).fadeOut(1000);
	//         }else{
	//            $("body").append(str);
	//            $("#tip i").removeClass("error");
	//            $("#tip span").html(log);
	//            $("#tip").hide().fadeIn(1000).fadeOut(1000);
	//         }
	//     }else{
	//         if($("#tip").length>0){
	//            $("#tip i").addClass("error");
	//            $("#tip span").html(log);
	//            $("#tip").fadeIn(1000).fadeOut(1000);
	//         }else{
	//            $("body").append(str);
	//            $("#tip i").addClass("error");
	//            $("#tip span").html(log);
	//            $("#tip").hide().fadeIn(1000).fadeOut(1000);
	//         }
	//     }
	// };

	// /*留言和评论验证*/
 //    $("#commentform").submit(function(){
 //        if($('#author').val() == ''||$('#author').val()=="姓名（必填）"){
 //            tip("昵称不能为空",false);
 //            $('#writer').focus();
 //            return false;
 //        }
 //        if($('#email').val() == ''|| $('#email').val()=="Email（必填）"){
 //            tip("邮箱不能为空",false);
 //            $('#email').focus();
 //            return false;
 //        }
 //        var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
 //        var result = reg.test($('#email').val());
        
 //        if(result !== true){
 //            tip("邮件格式不正确",false);
 //            $('#email').focus();
 //            return false;
 //        }

 //        var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
 //        var website = Expression.test($("#commenturl").val());

 //        if($("#commenturl").val()!=="网址必须包含http://"){
 //            if(website !== true){
 //                tip("网址格式不正确",false);
 //                $('#commenturl').focus();
 //                return false;
 //            }
 //        }

 //        if($('#comment').val() == ''|| $('#comment').val()=="请留下你的足迹"){
 //            tip("内容不能为空",false);
 //            $('#msg').focus();
 //            return false;
 //        }

 //        if($('#commenturl').val() == ''|| $('#commenturl').val()=="网站(可不填)"){
 //            $('#commenturl').val("");
 //        }

 //        var formdata = new FormData(this);  
 //        $.ajax({
 //            type:'post',
 //            url : '/article/doaddComment',
 //            data : formdata,
 //            contentType: false,
 //            processData: false
 //        }).done(function(data){

 //        	if(data.type===true){
 //        		$("#commentform input,#commentform textarea").each(function(){
 //                    $(this).attr('value',$(this).attr('default'))
 //                });

 //        		tip("添加成功",true);

 //                var $value = data.data,
 //                    $time = $value.commentTime.substring(0,10),
 //                    $url = $value.website;

 //                    if($url!==""){
 //                        $url = "href='http://" + $url + "'style='text-decoration:underline !important;'";
 //                    }else{
 //                        $url ="href='javascript:;'";
 //                    }
                
 //                //加载评论
 //                $item = $("<li class='comment even thread-even depth-1'>" +
 //                            "<div class='comment-body'>" +
 //                                "<div class='comment-author vcard'>" +
 //                                    "<div class='comment-avatar-wrap'>" +
 //                                        "<img src='/images/visitor_icon.jpg' title='"+$value.username+"' alt='"+$value.username+"' class='avatar avatar-50 photo' height='50' width='50'>" +
 //                                    "</div>" +
 //                                    "<cite class='fn'>" +
 //                                        "<a "+ $url +" rel='external nofollow' target='_blank' class='url'>"+$value.username+"</a>" +
 //                                    "</cite>" +
 //                                "</div>" +
 //                                "<div class='comment-text'><p>"+$value.comment+"</p></div>" +
 //                                "<div class='comment-meta commentmetadata'>" +
 //                                    "<a href='javascript:;'>"+ $time +"</a>" +
 //                                "</div>" +
 //                            "</div>" +
 //                        "</li>").hide();
                
 //                $('ol.commentlist').append($item);
 //                $item.fadeIn();
 //        	}

 //        }).fail(function(data){
 //        	tip(data,false);
 //        });
 //        return false;
 //    });
	
	// //评论默认值交互
 //    $('#commentform input,#commentform textarea').each(function(){
 //        if($(this).attr('value')==''){
 //            $(this).attr('value',$(this).attr('default'))
 //        }
 //    });
 //    $('#commentform input,#commentform textarea').focus(function(){
 //    	if($(this).attr('value')==$(this).attr('default')){
	//     	$(this).attr('value','')
	//     }
 //    });
 //    $('#commentform input,#commentform textarea').blur(function(){
 //    	if(jQuery(this).attr('value')==''){
	//     	$(this).attr('value',$(this).attr('default'));
	//     }
 //    });
});