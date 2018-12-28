function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}


$(document).ready(function () {
    $.get('/user/user_info/', function (data) {
        if(data.code == '200'){
            $('#c').val(data.user.name);
        }
    });

     $('#form-avatar').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/user/profile/',
            type: 'PATCH',
            dataType: 'JSON',
            success: function (data) {
                if(data.code == '200'){
                    $('#user-avatar').attr('src', '/static/media/' + data.avatar);
                }
            },
            error: function (data) {
                alert('图片上传失败！');
            }
        });
     });

    $('#form-name').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/user/profile/',
            type: 'PATCH',
            dataType: 'JSON',
            success: function (data) {
                if(data.code != '200'){
                    $('.error-msg').html('<i class="fa fa-exclamation-circle"></i>' + data.msg);
                    $('.error-msg').show();
                }else{
                    $('.error-msg').html('<i class="fa fa-exclamation-circle"></i>' + '保存成功')
                    $('.error-msg').show();
                }
            },
            error: function (data) {
                alert('修改用户名失败')
            }
        });
    });
});