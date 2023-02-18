function quiz_listing() {
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

                if (state == -1 || state >= 1) {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div class="done">
                                                <span>${sentence}</span>
                                            </div>
                                            <div class="done">
                                                <span>${book}</span>
                                                <span>${chapter}장</span>
                                                <span>${line}절</span>
                                            </div>
                                            <div class="done">
                                                <span>${hint}</span>
                                            </div>
                                            <div>
                                                <button onclick="del_quiz('${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">삭제하기</button>
                                            </div>
                                        </div>`
                } else {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span>${sentence}</span>
                                            </div>
                                            <div>
                                                <span>${book}</span>
                                                <span>${chapter}장</span>
                                                <span>${line}절</span>
                                            </div>
                                            <div>
                                                <span>${hint}</span>
                                            </div>
                                            <div>
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
                let book = rows[i]['book']
                let chapter = rows[i]['chapter']
                let line = rows[i]['line']
                let hint = rows[i]['hint']
                let state = rows[i]['state']

                let temp_html = ''

                if (state >= 1) {
                    temp_html = `<div class="quizpost" id="post_quiz">
                                            <div>
                                                <span>${sentence}</span>
                                            </div>
                                            <div>
                                                <span>${book}</span>
                                                <span>${chapter}장</span>
                                                <span>${line}절</span>
                                            </div>
                                            <div>
                                                <span>${hint}</span>
                                            </div>
                                            <button onclick="done_quiz('${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">완료하기</button>
                                            <button onclick="show_hint('${book}', ${chapter}, ${line})" type="button" class="btn btn-outline-primary">힌트공개</button>
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

function show_hint(book, chapter, line) {
    $.ajax({
        type: 'POST',
        url: '/quiz/hint',
        data: {book_give: book, chapter_give: chapter, line_give: line},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}