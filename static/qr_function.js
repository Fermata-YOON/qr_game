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

//------------------------------------------------------

function list_coloring(num) {
    let url = '/color_list?qr_give=' + num
    let color

    $.ajax({
        type: 'GET',
        url: url,
        data: {},
        async: false,
        success: function (response) {

            color = response['color']

        }
    })
    return color
}

function qr_listing() {
    $.ajax({
        type: 'GET',
        url: '/total_list',
        data: {},
        success: function (response) {
            let rows = response['list_give']

            for (let j = 0; j < 100; j++) {

                let temp_html = `<div class="col-md-1">
                                    <div class="card" style="max-width: 20rem;">
                                      <div class="card-body">
                                        ${j+1}
                                      </div>
                                    </div>
                                  </div>`

                for (let i = 0; i < rows.length; i++) {
                    let num = rows[i]['qr_num']
                    let team = rows[i]['team']
                    let time = rows[i]['time']
                    let state = rows[i]['state']

                    if (j + 1 == num && (state == 0 || state == 1)) {
                        let color = list_coloring(num);
                        temp_html = `<div class="col-md-1">
                                        <div class="card" style="max-width: 16rem;  background-color: ${color}">
                                          <div class="card-body">
                                            ${j + 1}: ${time}
                                          </div>
                                        </div>
                                      </div>`
                    } else if (j + 1 == num && state == -1) {
                        let color = list_coloring(num);
                        temp_html = `<div class="col-md-1">
                                        <div class="card" style="max-width: 16rem;  background-color: ${color}">
                                          <div class="card-body">
                                            ${j + 1}: 점령완료
                                          </div>
                                        </div>
                                      </div>`
                    }
                }

                $('#post_list').append(temp_html)
            }
        }
    })
}

