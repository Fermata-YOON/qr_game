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

function team_total_listing() {
    let name = $('#name').val()
    let team = $('#team_list').val()

    $.ajax({
        type: 'GET',
        url: '/team/list',
        data: {},
        success: function (response) {
            let rows = response['teams']
            let qrs = response['qrs']
            var ranks = new Array()

            for (let i = 0; i < rows.length; i++) {
                let team = rows[i]['team']
                let bonus = rows[i]['bonus']
                let color = rows[i]['color']
                let num = 0
                let total = 0

                for (let j = 0; j < qrs.length; j++) {
                    if (qrs[j]['team'] == team) {
                        if(qrs[j]['state'] == -1){
                            num++
                            total++
                        } else {
                            total++
                        }
                    }
                }

                var data = new Object()

                    data.team = team
                    data.count = num
                    data.total = total
                    data.bonus = bonus
                    data.color = color

                    ranks.push(data)

                ranks.sort((a,b) => {
                    if(a.bonus > b.bonus) return -1;
                    if(a.bonus < b.bonus) return 1;

                    return 0
                })

                ranks.sort((a,b) => {
                    if(a.count > b.count) return -1;
                    if(a.count < b.count) return 1;

                    return 0
                })

                ranks.sort((a,b) => {
                    if(a.total > b.total) return -1;
                    if(a.total < b.total) return 1;

                    return 0
                })


            }

            for(let i=0; i<ranks.length; i++) {
                let team = ranks[i]['team']
                let count = ranks[i]['count']
                let total = ranks[i]['total']
                let bonus = ranks[i]['bonus']
                let color = ranks[i]['color']
                let rank = ''

                if(i==0) {
                    rank = '🥇'
                } else if(i==1) {
                    rank = '🥈'
                } else if(i==2) {
                    rank = '🥉'
                }

                let temp_html = `<tr style="background-color: ${color}">
                                            <th scope="row">${rank}</th>
                                            <th scope="row">${team}</th>
                                            <th scope="row">${total}</th>
                                            <th scope="row">${count}</th>                                        
                                            <th scope="row">${bonus}</th>
                                         </tr>`

                $('#team_list').append(temp_html)
            }
        }
    })
}

function quiz_listing() {

    console.log('quiz_listing')

    $.ajax({
        type: 'GET',
        url: '/quiz_list',
        data: {},
        success: function (response) {
            let rows = response['quizs']

            for (let i = 0; i < rows.length; i++) {
                let sentence = rows[i]['sentence']
                let book = rows[i]['book']
                let chapter = rows[i]['chapter']
                let line = rows[i]['line']
                let hint = rows[i]['hint']
                let state = rows[i]['state']

                let temp_html = ''

                console.log(state)

                if (state == 1) {

                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span>"${sentence}"</span>
                                            </div>  
                                            <div>
                                                <span>hint: ${line}절</span>                                             
                                            </div>  
                                            <div>
                                                <span style="color: red">재점령 횟수 10회 획득 가능</span>
                                            </div>                              
                                        </div>`
                } else if (state == 2) {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span>"${sentence}"</span>
                                            </div>  
                                            <div>
                                                <span>Hint: ${hint} ??절 ${line}절</span>                                               
                                            </div>  
                                            <div>
                                                <span style="color: red">재점령 횟수 7회 획득 가능</span>
                                            </div>                               
                                        </div>`
                } else if (state == 3) {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span>"${sentence}"</span>
                                            </div>  
                                            <div>
                                                <span>Hint: ${hint} ${chapter}절 ${line}절</span>
                                            </div>           
                                            <div>
                                                <span style="color: red">재점령 횟수 3회 획득 가능</span>
                                            </div>                      
                                        </div>`
                }

                $('#quiz_now').append(temp_html)
            }
        }
    })
}