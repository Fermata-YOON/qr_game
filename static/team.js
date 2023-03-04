function listing() {
    $.ajax({
        type: 'GET',
        url: '/team/list',
        data: {},
        success: function (response) {
            let rows = response['teams']

            for (let i = 0; i < rows.length; i++) {
                let team_name = rows[i]['team']
                let team_member = rows[i]['members']

                let temp_html = `<option value="${team_name}">${team_name}</option>`

                $('#team_list').append(temp_html)
                $('#bonus_team').append(temp_html)
                $('#color_team').append(temp_html)
            }
        }
    })
}

function memberPosting() {
    let name = $('#name').val()
    let team = $('#team_list').val()

    $.ajax({
        type: 'POST',
        url: '/member_post',
        data: {name_give: name, team_give: team},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function teamCreate() {
    let team_name = $('#team_name').val()
    let color = $('#color').val()

    $.ajax({
        type: 'POST',
        url: '/team_create',
        data: {team_give: team_name, color_give: color},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function bonusPosting() {
    let bonus_team = $('#bonus_team').val()
    let bonus = $('#bonus').val()

    $.ajax({
        type: 'POST',
        url: '/team_bonus_record',
        data: {bonus_team_give: bonus_team, bonus_give: bonus},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function team_listing() {
    $.ajax({
        type: 'GET',
        url: '/team/list',
        data: {},
        success: function (response) {
            let rows = response['teams']

            for(let i=0; i<rows.length; i++) {
                let color = rows[i]['color']
                let team = rows[i]['team']
                let temp_html = ``

                temp_html = `<div class="col-sm-3">
                                <div class="card" style="max-width: 10rem;  background-color: ${color}">
                                    <div class="card-body">
                                        ${team}
                                    </div>
                                    <div>
                                        <button onclick="del_team('${team}')" type="button" class="btn btn-outline-primary" style="background-color: lightgray">팀 삭제하기</button>                 
                                    </div>
                                </div>
                             </div>`

                $('#team').append(temp_html)

                for(let j=0; j<rows[i]['members'].length; j++){
                    let name = rows[i]['members'][j]

                    temp_html = `<div class="col-sm-2">
                                        <div class="card" style="max-width: 10rem;  background-color: ${color}">
                                          <div class="card-body">
                                            ${team} : ${name}
                                          </div>
                                          <div>
                                            <button onclick="del_member('${name}', '${team}')" type="button" class="btn btn-outline-primary" style="background-color: lightgray">조원 삭제하기</button>                 
                                          </div>
                                        </div>
                                      </div>`

                    $('#member').append(temp_html)
                }
            }

        }
    })
}

function del_member(name, team) {

    $.ajax({
        type: 'POST',
        url: '/member/del',
        data: {name_give: name, team_give: team},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function del_team(team) {

    $.ajax({
        type: 'POST',
        url: '/team/del',
        data: {team_give: team},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}