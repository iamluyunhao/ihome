function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');

    $.get('/house/area_facility/', function (data) {
       if (data.code == '200'){
           for (var i=0; i < data.areas.length; i++){
               area_str = '<option value="' + data.areas[i].id + '">' + data.areas[i].name + '</option>';
               $('#area-id').append(area_str);
           }

           for (var j = 0; j < data.facilitys.length; j++){
               facility_str = '<li> <div class="checkbox"><label>' + '<input type="checkbox" name="facility" value="' +
                               data.facilitys[j].id + '">' + data.facilitys[j].name + '</label></div></li>'
               $('.house-facility-list').append(facility_str)
           }
       }
    });

    $('#form-house-info').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/house/new_house/',
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {
                $('#form-house-info').hide();
                $('#form-house-image').show();
                $('#house-id').val(data.house_id);
            },
            error: function (data) {
                alert('发布失败');
            }
        });
    });

    $('#form-house-image').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/house/house_images/',
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {
                if(data.code == '200'){
                    var image_src = '<img src="/static/media/' + data.image_url + '">'
                    $('.house-image-cons').append(image_src)
                }
            },
            error: function (data) {
                alert('添加图片失败')
            }
        });

    });
})