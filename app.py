from flask import Flask, render_template, request, jsonify
from flask_restx import Resource, Api
app = Flask(__name__)
api = Api(app)
import random

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:test1234@cluster0.enxxbxd.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

from datetime import datetime, timedelta
now = datetime.now()

def check_team(name):
    check = list(db.teams.find({'members': name}, {'_id': False, 'members': False, 'bonus': False}))
    if len(check) == 0:
        return 0
    else:
        return check[0]['team']

jesus = rand_drop = first_drop = get_bonus = drop_bonus = 1

@app.route('/main')
def home():
    return render_template('index.html')

@app.route('/admin/981103/fermata')
def admin():
    return render_template('admin.html')

@app.route('/manager/team/637497')
def team():
    return render_template('manage_team.html')

@app.route('/monitor/480363')
def monitor():
    return render_template('monitor.html')

@app.route('/quiz/manager/652240')
def quiz():
    return render_template('manage_quiz.html')

@app.route('/quiz/answer/365823')
def ans():
    return render_template('answer.html')

@app.route('/action/jesus/4589')
def jesus():
    global jesus
    if jesus == 0:
        return render_template('action/done.html')
    return render_template('action/jesus.html')

@app.route('/action/drop/first/8947')
def first_drop():
    global first_drop
    if first_drop == 0:
        return render_template('action/done.html')
    return render_template('action/first_drop.html')

@app.route('/action/drop/random/4785')
def random_drop():
    global rand_drop
    if rand_drop == 0:
        return render_template('action/done.html')
    return render_template('action/random_drop.html')

@app.route('/action/bonous/get/5896')
def get_bonus():
    global get_bonus
    if get_bonus == 0:
        return render_template('action/done.html')
    return render_template('action/get_bonus.html')

@app.route('/action/bonus/drop/1885')
def drop_bonus():
    global drop_bonus
    if drop_bonus == 0:
        return render_template('action/done.html')
    return render_template('action/drop_bonus.html')

@app.route('/team_create', methods=['POST'])
def team_post():
    team_receive = request.form['team_give']
    color_receive = request.form['color_give']

    if team_receive == "":
        return jsonify({'msg': '조 이름을 정확히 입력해 주세요'})

    else:
        team_doc = {
            'team': team_receive,
            'members': [],
            'bonus': 0,
            'color': color_receive
        }

        db.teams.insert_one(team_doc)

        return jsonify({'msg': '기록 완료'})

@app.route("/member_post", methods=["POST"])
def member_post():
    name_receive = request.form['name_give']
    team_receive = request.form['team_give']

    if name_receive == "":
        return jsonify({'msg': '이름을 정확히 입력해 주세요'})
    else:
        if len(list(db.teams.find({'members': name_receive}, {'_id': False}))) > 0:
            return jsonify({'msg': '이미 등록된 이름입니다'})

        else:
            db.teams.update_one({'team': team_receive}, {"$push": {'members': name_receive}})

            if name_receive == '예수님':
                global jesus
                jesus = 0

            return jsonify({'msg': '기록 완료'})


@app.route("/team_bonus_record", methods=["POST"])
def bonus_post():
    bonus_team_receive = request.form['bonus_team_give']
    bonus_receive = int(request.form['bonus_give'])

    db.teams.update_one({'team': bonus_team_receive}, {'$inc': {'bonus': bonus_receive}})

    return jsonify({'msg': '지급 완료'})

@app.route("/quiz_post", methods=["POST"])
def quiz_post():
    sentence_receive = request.form['sentence_give']
    book_receive = request.form['book_give']
    chapter_receive = int(request.form['chapter_give'])
    line_receive = int(request.form['line_give'])

    rand_num = [i for i in range(len(sentence_receive))]

    random.shuffle(rand_num)

    rand_sentence = ''

    for i in rand_num:
        rand_sentence += sentence_receive[i]

    if len(list(db.quizs.find({'book': book_receive, 'chapter': chapter_receive, 'line': line_receive}, {'_id': False}))) != 0:
        return jsonify({'msg': '이미 등록된 구절입니다'})

    doc = {
        'sentence': rand_sentence,
        'original': sentence_receive,
        'book': book_receive,
        'chapter': chapter_receive,
        'line': line_receive,
        'state': 0,
        'time': 0
    }

    db.quizs.insert_one(doc)

    return jsonify({'msg': '퀴즈 등록 완료'})

@app.route("/quiz/mix", methods=["POST"])
def quiz_mix():
    sentence_receive = request.form['sentence_give']
    book_receive = request.form['book_give']
    chapter_receive = int(request.form['chapter_give'])
    line_receive = int(request.form['line_give'])

    rand_num = [i for i in range(len(sentence_receive))]

    random.shuffle(rand_num)

    rand_sentence = ''

    for i in rand_num:
        rand_sentence += sentence_receive[i]

    db.quizs.update_one({'book': book_receive, 'chapter': chapter_receive, 'line': line_receive}, {'$set': {'sentence': rand_sentence}})

    return jsonify({'msg': '본문 섞기 완료'})

@app.route("/qr_record", methods=["POST"])
def qr_record():
    name_receive = request.form['name_give']
    num_receive = request.form['num_give']

    now = datetime.now().strftime('%H:%M')

    team = check_team(name_receive)

    qr_arr = list(db.qr_list.find({'qr_num': int(num_receive)}, {'_id': False}))

    if name_receive == "" or team == 0:
        return jsonify({'msg': '이름을 정확히 입력해 주세요'})
    elif len(qr_arr) == 0:

        qr_doc = {
            'qr_num': int(num_receive),
            'names': [name_receive],
            'team': team,
            'time': now,
            'state': 0
        }

        db.qr_list.insert_one(qr_doc)

        return jsonify({'msg': '점령 완료'})
    elif team == qr_arr[0]['team']:
        return jsonify({'msg': '이미 점령중 입니다'})
    elif qr_arr[0]['time'] == '점령해제':
        if name_receive in qr_arr[0]['names']:
            return jsonify({'msg': '이전에 점령을 한 적이 있습니다'})
        db.qr_list.update_one({'qr_num': int(num_receive)}, {"$push": {'names': name_receive}, '$set': {'time': now, 'team': team, 'state': 1}})
        return jsonify({'msg': '점령 완료'})
    elif (datetime.strptime(now, '%H:%M') - datetime.strptime(qr_arr[0]['time'], '%H:%M')).total_seconds() > 1200:
        db.qr_list.update_one({'qr_num': int(num_receive)}, {'$set': {'state': -1}})
        return jsonify({'msg': '이 QR은 점령 불가능 합니다'})
    elif (datetime.strptime(now, '%H:%M') - datetime.strptime(qr_arr[0]['time'], '%H:%M')).total_seconds() < 600 and qr_arr[0]['state'] == 0:
        return jsonify({'msg': '지금은 점령할 수 없습니다'})
    elif (datetime.strptime(now, '%H:%M') - datetime.strptime(qr_arr[0]['time'], '%H:%M')).total_seconds() < 300 and qr_arr[0]['state'] == 1:
        return jsonify({'msg': '지금은 점령할 수 없습니다'})
    elif name_receive in qr_arr[0]['names']:
        return jsonify({'msg': '이전에 점령을 한 적이 있습니다'})
    else:
        count = list(db.teams.find({'members': name_receive}, {'_id': False, 'members': False}))
        print(count[0]['bonus'])
        if count[0]['bonus'] > 0:
            db.qr_list.update_one({'qr_num': int(num_receive)}, {"$push": {'names': name_receive}, '$set': {'time': now, 'team': team, 'state': 1}})
            db.teams.update_one({'team': team}, {'$inc': {'bonus': -1}})
            new_count = list(db.teams.find({'members': name_receive}, {'_id': False, 'members': False}))
            msg = '점령 완료, 남은 뒤집기 횟수: ' + str(new_count[0]['bonus'])
            return jsonify({'msg': msg})
        else:
            return jsonify({'msg': '뒤집기 횟수 부족'})

@app.route("/team/list", methods=["GET"])
def team_get():
    team_list = list(db.teams.find({}, {'_id': False}))
    qr_list = list(db.qr_list.find({}, {'_id': False}))

    return jsonify({'teams': team_list, 'qrs': qr_list})


@app.route("/qr_list", methods=["GET"])
def qr_get():
    qr_receive = request.args.get('qr_give')
    qr_info = list(db.qr_list.find({'qr_num': int(qr_receive)}, {'_id': False}))

    if len(qr_info) > 0:
        return jsonify({'qr_info': qr_info})
    else:
        return jsonify({'qr_info': 0})

@app.route("/total_list", methods=["GET"])
def list_get():
    list_info = list(db.qr_list.find({}, {'_id': False}))
    now = datetime.now().strftime('%H:%M')

    for i in range(len(list_info)):
        if list_info[i]['state'] != -1 and list_info[i]['time'] != '점령해제':
            if (datetime.strptime(now, '%H:%M') - datetime.strptime(list_info[i]['time'], '%H:%M')).total_seconds() > 1200:
                db.qr_list.update_one({'qr_num': int(list_info[i]['qr_num'])}, {'$set': {'state': -1}})



    if len(list_info) > 0:
        return jsonify({'list_give': list_info})
    else:
        return jsonify({'list_give': 0})

@app.route("/color_list", methods=["GET"])
def color_get():
    qr_receive = request.args.get('qr_give')
    qr_info = list(db.qr_list.find({'qr_num': int(qr_receive)}, {'_id': False}))

    if len(qr_info) > 0:
        team = qr_info[0]['team']
        if team == '점령해제':
            return jsonify({'color': 'white'})
        else:
            color_list = list(db.teams.find({'team': team}, {'_id': False}))
            color = color_list[0]['color']

        return jsonify({'color': color})
    else:
        return jsonify({'color': 'white'})

@app.route("/quiz/del", methods=["POST"])
def del_quiz():
    book_receive = request.form['book_give']
    chapter_receive = int(request.form['chapter_give'])
    line_receive = int(request.form['line_give'])

    db.quizs.delete_one({'book': book_receive, 'chapter': chapter_receive, 'line': line_receive})

    return jsonify({'msg': '삭제완료'})

@app.route("/quiz/show", methods=['POST'])
def show_quiz():
    now = datetime.now().strftime('%H:%M')

    book_receive = request.form['book_give']
    chapter_receive = int(request.form['chapter_give'])
    line_receive = int(request.form['line_give'])

    if len(list(db.quizs.find({'state': {'$gte': 1}}))) >= 1:
        return jsonify({'msg': '이미 진행중인 문제가 있습니다'})

    db.quizs.update_one({'book': book_receive, 'chapter': chapter_receive, 'line': line_receive},
                        {'$set': {'state': 1, 'time': now}})

    return jsonify({'msg': '문제를 공개합니다'})
@app.route("/quiz/done", methods=['POST'])
def done_quiz():
    book_receive = request.form['book_give']
    chapter_receive = int(request.form['chapter_give'])
    line_receive = int(request.form['line_give'])

    db.quizs.update_one({'book': book_receive, 'chapter': chapter_receive, 'line': line_receive},
                        {'$set': {'state': -1}})

    return jsonify({'msg': '문제를 완료처리 합니다'})

@app.route("/quiz/set", methods=['POST'])
def set_quiz():
    book_receive = request.form['book_give']
    chapter_receive = int(request.form['chapter_give'])
    line_receive = int(request.form['line_give'])

    db.quizs.update_one({'book': book_receive, 'chapter': chapter_receive, 'line': line_receive},
                        {'$set': {'state': 0, 'time': ''}})

    return jsonify({'msg': '문제를 풀지 않음으로 설정합니다'})

def auto_quiz():
    print('operate auto quiz')

    now = datetime.now().strftime('%H:%M')

    quiz_now = list(db.quizs.find({'state': {'$gte': 1}}, {'_id': False}))

    if len(quiz_now) > 0:

        if (datetime.strptime(now, '%H:%M') - datetime.strptime(quiz_now[0]['time'], '%H:%M')).total_seconds() > 600:
            db.quizs.update_one(
                {'book': quiz_now[0]['book'], 'chapter': quiz_now[0]['chapter'], 'line': quiz_now[0]['line']},
                {'$set': {'state': -1, 'time': ''}})

            quiz_list = list(db.quizs.find({'state': 0}, {'_id': False}))

            num = random.randint(0, len(quiz_list)-1)

            print(num)

            db.quizs.update_one(
                {'book': quiz_list[num]['book'], 'chapter': quiz_list[num]['chapter'], 'line': quiz_list[num]['line']},
                {'$set': {'state': 1, 'time': now}})

            print('operate quiz update')


@app.route("/quiz/check/answer", methods=['POST'])
def check_answer():
    team_receive = request.form['team_give']
    book_receive = request.form['book_give']
    chapter_receive = int(request.form['chapter_give'])
    line_receive = int(request.form['line_give'])

    ans = list(db.quizs.find(
        {'book': book_receive, 'chapter': chapter_receive, 'line': line_receive, 'state': {'$gte': 1}}))

    if len(ans) > 0:
        if ans[0]['state'] == 1:
            db.teams.update_one({'team': team_receive}, {'$inc': {'bonus': 10}})
            db.quizs.update_one({'book': book_receive, 'chapter': chapter_receive, 'line': line_receive},
                                {'$inc': {'state': 1}})
        elif ans[0]['state'] == 2:
            db.teams.update_one({'team': team_receive}, {'$inc': {'bonus': 7}})
            db.quizs.update_one({'book': book_receive, 'chapter': chapter_receive, 'line': line_receive},
                                {'$inc': {'state': 1}})
        elif ans[0]['state'] == 3:
            db.teams.update_one({'team': team_receive}, {'$inc': {'bonus': 4}})

        return jsonify({'msg': '정답입니다'})
    else:
        return jsonify({'msg': '틀렸습니다'})


@app.route("/quiz_list", methods=["GET"])
def quiz_get():
    auto_quiz()
    quizs = list(db.quizs.find({}, {'_id': False}))

    return jsonify({'quizs': quizs})

@app.route("/reset/team", methods=["POST"])
def reset_team():
    db.teams.drop()

    return jsonify({'msg': '팀 초기화 완료'})

@app.route("/reset/bonus", methods=["POST"])
def reset_bonus():
    db.teams.update_many({}, {'$set': {'bonus': 0}})

    return jsonify({'msg': '재점령 횟수 초기화 완료'})

@app.route("/reset/qr", methods=["POST"])
def reset_qr():
    db.qr_list.drop()

    return jsonify({'msg': 'qr 초기화 완료'})

@app.route("/drop/first", methods=["POST"])
def drop_first():
    team_receive = request.form['team_give']

    for i in range(5):
        db.qr_list.update_one({'team': team_receive}, {'$set': {'team': '점령해제', 'time': '점령해제', 'state': 0}})

    global first_drop
    first_drop = 0

    return jsonify({'msg': '1등이 점령중인 5개의 QR 점령이 풀립니다'})

@app.route("/drop/random", methods=["POST"])
def drop_random():

    num = random.sample(range(1, 100), 10)

    for i in num:
        if len(list(db.qr_list.find({'qr_num': i}, {'_id': False}))) > 0:
            db.qr_list.update_one({'qr_num': i}, {'$set': {'team': '점령해제', 'time': '점령해제', 'state': 0}})

    global rand_drop
    rand_drop = 0

    return jsonify({'msg': '점령중인 QR 중 최대 10개가 점령이 해제됩니다'})

@app.route("/team_bonus_get", methods=["POST"])
def bonus_get():
    bonus_team_receive = request.form['bonus_team_give']
    bonus_receive = int(request.form['bonus_give'])

    db.teams.update_one({'team': bonus_team_receive}, {'$inc': {'bonus': bonus_receive}})

    global get_bonus
    get_bonus = 0

    return jsonify({'msg': '지급 완료'})

@app.route("/team_bonus_drop", methods=["POST"])
def bonus_drop():
    bonus_team_receive = request.form['bonus_team_give']
    bonus_receive = int(request.form['bonus_give'])

    db.teams.update_one({'team': bonus_team_receive}, {'$inc': {'bonus': bonus_receive}})

    global drop_bonus
    drop_bonus = 0

    return jsonify({'msg': '차감 완료'})

@app.route("/reset/quiz", methods=["POST"])
def reset_quiz():
    db.quizs.update_many({}, {'$set': {'state': 0, 'time': ''}})

    return jsonify({'msg': 'quiz 초기화 완료'})

## QR 페이지 랜더

@app.route('/qr/181451')
def qr_00():
    return render_template('qr/00.html')

@app.route('/qr/503594')
def qr_01():
    return render_template('qr/01.html')

@app.route('/qr/239789')
def qr_02():
    return render_template('qr/02.html')

@app.route('/qr/465507')
def qr_03():
    return render_template('qr/03.html')

@app.route('/qr/621484')
def qr_04():
    return render_template('qr/04.html')

@app.route('/qr/984547')
def qr_05():
    return render_template('qr/05.html')

@app.route('/qr/672629')
def qr_06():
    return render_template('qr/06.html')

@app.route('/qr/681143')
def qr_07():
    return render_template('qr/07.html')

@app.route('/qr/171054')
def qr_08():
    return render_template('qr/08.html')

@app.route('/qr/191047')
def qr_09():
    return render_template('qr/09.html')

@app.route('/qr/441689')
def qr_10():
    return render_template('qr/10.html')

@app.route('/qr/364618')
def qr_11():
    return render_template('qr/11.html')

@app.route('/qr/269492')
def qr_12():
    return render_template('qr/12.html')

@app.route('/qr/372424')
def qr_13():
    return render_template('qr/13.html')

@app.route('/qr/181324')
def qr_14():
    return render_template('qr/14.html')

@app.route('/qr/481882')
def qr_15():
    return render_template('qr/15.html')

@app.route('/qr/259323')
def qr_16():
    return render_template('qr/16.html')

@app.route('/qr/148835')
def qr_17():
    return render_template('qr/17.html')

@app.route('/qr/926427')
def qr_18():
    return render_template('qr/18.html')

@app.route('/qr/475122')
def qr_19():
    return render_template('qr/19.html')

@app.route('/qr/313588')
def qr_20():
    return render_template('qr/20.html')

@app.route('/qr/422698')
def qr_21():
    return render_template('qr/21.html')

@app.route('/qr/208526')
def qr_22():
    return render_template('qr/22.html')

@app.route('/qr/748891')
def qr_23():
    return render_template('qr/23.html')

@app.route('/qr/121028')
def qr_24():
    return render_template('qr/24.html')

@app.route('/qr/636049')
def qr_25():
    return render_template('qr/25.html')

@app.route('/qr/145735')
def qr_26():
    return render_template('qr/26.html')

@app.route('/qr/529137')
def qr_27():
    return render_template('qr/27.html')

@app.route('/qr/319662')
def qr_28():
    return render_template('qr/28.html')

@app.route('/qr/571829')
def qr_29():
    return render_template('qr/29.html')

@app.route('/qr/862640')
def qr_30():
    return render_template('qr/30.html')

@app.route('/qr/626176')
def qr_31():
    return render_template('qr/31.html')

@app.route('/qr/433741')
def qr_32():
    return render_template('qr/32.html')

@app.route('/qr/411182')
def qr_33():
    return render_template('qr/33.html')

@app.route('/qr/594293')
def qr_34():
    return render_template('qr/34.html')

@app.route('/qr/336408')
def qr_35():
    return render_template('qr/35.html')

@app.route('/qr/270208')
def qr_36():
    return render_template('qr/36.html')

@app.route('/qr/190961')
def qr_37():
    return render_template('qr/37.html')

@app.route('/qr/928531')
def qr_38():
    return render_template('qr/38.html')

@app.route('/qr/622920')
def qr_39():
    return render_template('qr/39.html')

@app.route('/qr/782176')
def qr_40():
    return render_template('qr/40.html')

@app.route('/qr/203364')
def qr_41():
    return render_template('qr/41.html')

@app.route('/qr/375170')
def qr_42():
    return render_template('qr/42.html')

@app.route('/qr/273482')
def qr_43():
    return render_template('qr/43.html')

@app.route('/qr/114127')
def qr_44():
    return render_template('qr/44.html')

@app.route('/qr/648827')
def qr_45():
    return render_template('qr/45.html')

@app.route('/qr/196242')
def qr_46():
    return render_template('qr/46.html')

@app.route('/qr/403781')
def qr_47():
    return render_template('qr/47.html')

@app.route('/qr/148435')
def qr_48():
    return render_template('qr/48.html')

@app.route('/qr/813358')
def qr_49():
    return render_template('qr/49.html')

@app.route('/qr/580443')
def qr_50():
    return render_template('qr/50.html')

@app.route('/qr/985386')
def qr_51():
    return render_template('qr/51.html')

@app.route('/qr/495510')
def qr_52():
    return render_template('qr/52.html')

@app.route('/qr/313060')
def qr_53():
    return render_template('qr/53.html')

@app.route('/qr/821270')
def qr_54():
    return render_template('qr/54.html')

@app.route('/qr/364871')
def qr_55():
    return render_template('qr/55.html')

@app.route('/qr/875820')
def qr_56():
    return render_template('qr/56.html')

@app.route('/qr/416108')
def qr_57():
    return render_template('qr/57.html')

@app.route('/qr/890478')
def qr_58():
    return render_template('qr/58.html')

@app.route('/qr/387929')
def qr_59():
    return render_template('qr/59.html')

@app.route('/qr/134863')
def qr_60():
    return render_template('qr/60.html')

@app.route('/qr/165248')
def qr_61():
    return render_template('qr/61.html')

@app.route('/qr/419564')
def qr_62():
    return render_template('qr/62.html')

@app.route('/qr/444836')
def qr_63():
    return render_template('qr/63.html')

@app.route('/qr/145627')
def qr_64():
    return render_template('qr/64.html')

@app.route('/qr/887924')
def qr_65():
    return render_template('qr/65.html')

@app.route('/qr/861849')
def qr_66():
    return render_template('qr/66.html')

@app.route('/qr/621017')
def qr_67():
    return render_template('qr/67.html')

@app.route('/qr/748528')
def qr_68():
    return render_template('qr/68.html')

@app.route('/qr/538306')
def qr_69():
    return render_template('qr/69.html')

@app.route('/qr/119609')
def qr_70():
    return render_template('qr/70.html')

@app.route('/qr/170020')
def qr_71():
    return render_template('qr/71.html')


@app.route('/qr/132745')
def qr_72():
    return render_template('qr/72.html')

@app.route('/qr/125321')
def qr_73():
    return render_template('qr/73.html')

@app.route('/qr/950799')
def qr_74():
    return render_template('qr/74.html')

@app.route('/qr/870138')
def qr_75():
    return render_template('qr/75.html')

@app.route('/qr/192890')
def qr_76():
    return render_template('qr/76.html')

@app.route('/qr/767630')
def qr_77():
    return render_template('qr/77.html')

@app.route('/qr/294048')
def qr_78():
    return render_template('qr/78.html')

@app.route('/qr/503955')
def qr_79():
    return render_template('qr/79.html')

@app.route('/qr/112269')
def qr_80():
    return render_template('qr/80.html')

@app.route('/qr/240878')
def qr_81():
    return render_template('qr/81.html')

@app.route('/qr/708869')
def qr_82():
    return render_template('qr/82.html')

@app.route('/qr/468635')
def qr_83():
    return render_template('qr/83.html')

@app.route('/qr/269606')
def qr_84():
    return render_template('qr/84.html')

@app.route('/qr/750076')
def qr_85():
    return render_template('qr/85.html')

@app.route('/qr/256917')
def qr_86():
    return render_template('qr/86.html')

@app.route('/qr/932602')
def qr_87():
    return render_template('qr/87.html')

@app.route('/qr/294956')
def qr_88():
    return render_template('qr/88.html')

@app.route('/qr/752672')
def qr_89():
    return render_template('qr/89.html')

@app.route('/qr/161558')
def qr_90():
    return render_template('qr/90.html')

@app.route('/qr/725816')
def qr_91():
    return render_template('qr/91.html')

@app.route('/qr/612783')
def qr_92():
    return render_template('qr/92.html')

@app.route('/qr/578914')
def qr_93():
    return render_template('qr/93.html')

@app.route('/qr/524061')
def qr_94():
    return render_template('qr/94.html')

@app.route('/qr/459402')
def qr_95():
    return render_template('qr/95.html')

@app.route('/qr/213346')
def qr_96():
    return render_template('qr/96.html')

@app.route('/qr/715602')
def qr_97():
    return render_template('qr/97.html')

@app.route('/qr/544391')
def qr_98():
    return render_template('qr/98.html')

@app.route('/qr/241765')
def qr_99():
    return render_template('qr/99.html')

@app.route('/qr/723350')
def qr_100():
    return render_template('qr/100.html')




if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
