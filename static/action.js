function jesusPosting() {
    let name =  "예수님"
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

function drop_random() {
    $.ajax({
        type: 'POST',
        url: '/drop/random',
        data: {},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()

        }
    });
    $('#drop_random_btn').css('display', 'none')
}

function drop_first() {
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

            first_drop(ranks[0]['team'])
        }
    })
}

function first_drop(team) {
    $.ajax({
        type: 'POST',
        url: '/drop/first',
        data: {team_give: team},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
            $('#drop_first_btn').hidden()
        }
    });
}

function get_5_bonus() {
    let bonus_team = $('#bonus_team').val()
    let bonus = 5

    $.ajax({
        type: 'POST',
        url: '/team_bonus_get',
        data: {bonus_team_give: bonus_team, bonus_give: bonus},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function drop_5_bonus() {
    let bonus_team = $('#bonus_team').val()
    let bonus = -5

    $.ajax({
        type: 'POST',
        url: '/team_bonus_drop',
        data: {bonus_team_give: bonus_team, bonus_give: bonus},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}