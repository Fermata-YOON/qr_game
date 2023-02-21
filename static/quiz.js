function quiz_listing() {
    $.ajax({
        type: 'GET',
        url: '/quiz_list',
        data: {},
        success: function (response) {
            let rows = response['quizs']

            for (let i = 0; i < rows.length; i++) {
                let sentence = rows[i]['sentence']
                let original = rows[i]['original']
                let book = rows[i]['book']
                let chapter = rows[i]['chapter']
                let line = rows[i]['line']
                let state = rows[i]['state']

                let temp_html = ''

                if (state == -1 || state >= 1) {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div class="done">
                                                <span>${original}</span>
                                            </div>
                                            <div class="done">
                                                <span>${book}</span>
                                                <span>${chapter}장</span>
                                                <span>${line}절</span>
                                            </div>
                                            <div>
                                                <button onclick="quiz_mix('${sentence}', '${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">본문섞기</button>
                                                <button onclick="del_quiz('${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">삭제하기</button>
                                                <button onclick="set_quiz('${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">다시풀기</button>
                                            </div>
                                        </div>`
                } else {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span style="color: red">${original}</span>
                                            </div>
                                            <div>
                                                <span style="color: gray">${sentence}</span>
                                            </div>
                                            <div>
                                                <span>${book}</span>
                                                <span>${chapter}장</span>
                                                <span>${line}절</span>
                                            </div>
                                            <div>
                                                <button onclick="quiz_mix('${sentence}', '${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">본문섞기</button>
                                                <button onclick="quiz_show('${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">보여주기</button>
                                                <button onclick="del_quiz('${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">삭제하기</button>
                                            </div>
                                        </div>`
                }

                $('#quiz_list').append(temp_html)
            }
        }
    })
}

function quiz_now_listing() {
    $.ajax({
        type: 'GET',
        url: '/quiz_list',
        data: {},
        success: function (response) {
            let rows = response['quizs']

            for (let i = 0; i < rows.length; i++) {
                let sentence = rows[i]['sentence']
                let original = rows[i]['original']
                let book = rows[i]['book']
                let chapter = rows[i]['chapter']
                let line = rows[i]['line']
                let state = rows[i]['state']

                let temp_html = ''

                if (state >= 1) {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span>${sentence}</span>
                                            </div>
                                            <div>
                                                <span>${original}</span>
                                            </div>
                                            <div>
                                                <span>${book}</span>
                                                <span>${chapter}장</span>
                                                <span>${line}절</span>
                                            </div>
                                            <button onclick="done_quiz('${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">완료하기</button>                                          
                                        </div>`
                }

                $('#quiz_now').append(temp_html)
            }
        }
    })
}

function quiz_posting() {
    let sentence = $('#sentence').val()
    let book = $('#book').val()
    let chapter = $('#chapter').val()
    let line = $('#line').val()

    $.ajax({
        type: 'POST',
        url: '/quiz_post',
        data: {sentence_give: sentence, book_give: book, chapter_give: chapter, line_give: line},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function del_quiz(book, chapter, line) {

    $.ajax({
        type: 'POST',
        url: '/quiz/del',
        data: {book_give: book, chapter_give: chapter, line_give: line},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function quiz_show(book, chapter, line) {
    $.ajax({
        type: 'POST',
        url: '/quiz/show',
        data: {book_give: book, chapter_give: chapter, line_give: line},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function quiz_mix(sentence, book, chapter, line) {
    $.ajax({
        type: 'POST',
        url: '/quiz/mix',
        data: {sentence_give: sentence, book_give: book, chapter_give: chapter, line_give: line},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function done_quiz(book, chapter, line) {
    $.ajax({
        type: 'POST',
        url: '/quiz/done',
        data: {book_give: book, chapter_give: chapter, line_give: line},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

function set_quiz(book, chapter, line) {
    $.ajax({
        type: 'POST',
        url: '/quiz/set',
        data: {book_give: book, chapter_give: chapter, line_give: line},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
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

function quiz_now_show() {

    $.ajax({
        type: 'GET',
        url: '/quiz_list',
        data: {},
        success: function (response) {
            let rows = response['quizs']

            for (let i = 0; i < rows.length; i++) {
                let sentence = rows[i]['sentence']
                let state = rows[i]['state']
                let time = rows[i]['time']

                let temp_html = ''

                console.log(state)

                if (state == 1) {

                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span>"${sentence}"</span>
                                                <p></p>
                                                <span style="color: red">재점령 횟수 10회 획득 가능</span>
                                                <p>공개시간: ${time}</p>
                                            </div>                              
                                        </div>`
                } else if (state == 2) {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span>"${sentence}"</span>
                                                <p></p>
                                                <span style="color: red">재점령 횟수 7회 획득 가능</span>
                                                <p>공개시간: ${time}</p>
                                            </div>                               
                                        </div>`
                } else if (state == 3) {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span>"${sentence}"</span>
                                                <p></p>
                                                <span style="color: red">재점령 횟수 4회 획득 가능</span>
                                                <p>공개시간: ${time}</p>
                                            </div>                      
                                        </div>`
                }

                $('#quiz_now').append(temp_html)
            }
        }
    })
}