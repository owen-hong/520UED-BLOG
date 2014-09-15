//删除对话框确认
function delcfm() {
    if (!confirm("确认要删除？")) {
        window.event.returnValue = false;
    }
}

	//写入cookie
function SetAsaiCookie(name,value){
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//读取cookies
function GetAsaiCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)) return unescape(arr[2]);
	else return null;
}
//删除cookies
function DelAsaiCookie(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=GetAsaiCookie(name);
	if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

$(function(){

	$("#searchBtn").click(function(){
        var $val = $(this).siblings('input').val(),
            $url = $(this).siblings('input').attr("data-url");

        window.location.href = $url + $val;
    });


	if($("#admin_index").size()){
		SetAsaiCookie('nav',"0");
		DelAsaiCookie('s_menu');
	}


	$("#sidebar li.submenu,#sidebar ul.s_menu li").removeClass('active');

	var $submenu = GetAsaiCookie('nav');
	var $s_menu = GetAsaiCookie('s_menu');


	$("#sidebar li.submenu").eq($submenu).addClass('active').children('ul.s_menu').show();
	$("#sidebar li.submenu.active .s_menu li").eq($s_menu).addClass('active');


	$("#sidebar li.submenu").click(function(event) {

		$("#sidebar li.submenu,#sidebar ul.s_menu li").removeClass('active');

		var $idx = $(this).index();

		SetAsaiCookie('nav',$idx);


		$(this).addClass('active').siblings('li.submenu').removeClass('active');

		$(this).children('ul').slideToggle(500);
	});

	$("#sidebar ul.s_menu li").click(function(event) {
		$("#sidebar li.submenu,#sidebar ul.s_menu li").removeClass('active');
		var $idx = $(this).index();

		SetAsaiCookie('s_menu',$idx);


	});

})