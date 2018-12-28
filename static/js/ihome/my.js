function logout() {
    $.get("/user/logout/", function(data){
        if (data.code == '200') {
            location.href = '/house/index/';
        }else{
            alert('退出失败！')
        }
    });
};

$(document).ready(function(){
    $.get('/user/user_info/', function (data) {
        if(data.code == '200'){
            $('#user-name').text(data.user.name);
            $('#user-mobile').text(data.user.phone);
            $('#user-avatar').attr('src', '/static/media/' + data.user.avatar);
            if (!data.user.avatar){
                $('#user-avatar').hide();
            }else{
                $('#user-avatar').show();
            }
        }
    });
});