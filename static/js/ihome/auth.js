function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function () {
    $.get('/user/user_rel_info/', function (data) {
        if(data.code == '200'){
            $('#real-name').val(data.user.id_name);
            $('#id-card').val(data.user.id_card);
            if($('#real-name').val() && $('#id-card').val()){
                $('#real-name').attr('disabled', 'disabled');
                $('#id-card').attr('disabled', 'disabled');
                $('.btn-success').attr('disabled', 'disabled');
            }
        }
    });

    $('#form-auth').submit(function(e){
        e.preventDefault()
        var real_name = $('#real-name').val();
        var id_card = $('#id-card').val();
        $.ajax({
            url: '/user/auth/',
            type: 'PATCH',
            data: {'real_name': real_name, 'id_card': id_card},
            dataType: 'JSON',
            success: function (data) {
                if(data.code == '200'){
                    $('#real-name').attr('disabled', 'disabled');
                    $('#id-card').attr('disabled', 'disabled');
                    $('.btn-success').attr('disabled', 'disabled');
                    $('.error-msg').html('<i class="fa fa-exclamation-circle"></i>' + '保存成功')
                    $('.error-msg').show();
                }else{
                    $('.error-msg').html('<i class="fa fa-exclamation-circle"></i>' + data.msg);
                    $('.error-msg').show();
                }
            },
            error: function (data) {
                alert('修改信息失败')
            }
        });
    });
});

