function listing(num) {
    let url = '/qr_list?qr_give=' + num

    $.ajax({
        type: 'GET',
        url: url,
        data: {},
        success: function (response) {
            if (response['qr_info'] != 0) {
                let rows = response['qr_info']
                let qr_team = rows[0]['team']
                let qr_time = rows[0]['time']

                let temp_html = `<span class="input-group-text" id="basic-addon1">점령조</span>
                                   <input type="text" class="form-control" placeholder=${qr_team} aria-label="Username" aria-describedby="basic-addon1" readonly>
                             <span class="input-group-text" id="basic-addon1">점령 시각</span>
                                   <input type="text" class="form-control" placeholder= ${qr_time} aria-label="Username" aria-describedby="basic-addon1" readonly>`
                $('#info').append(temp_html)
            }
        }
    })
}

function coloring(num) {
    let url = '/color_list?qr_give=' + num

    $.ajax({
        type: 'GET',
        url: url,
        data: {},
        success: function (response) {
            let color = response['color']

            console.log(color)

            $('#back_color').css("background-color", color)
        }
    })
}

function showClock() {
    var currentDate = new Date();
    var divClock = document.getElementById('divClock');
    var msg = '현재 시간: '
    msg += currentDate.getHours() + '시';
    msg += currentDate.getMinutes() + '분';

    divClock.innerText = msg;

    setTimeout(showClock, 1000);  //1초마다 갱신
}

function posting(num) {
    let name = $('#name').val()

    $.ajax({
        type: 'POST',
        url: '/qr_record',
        data: {name_give: name, num_give: num},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}