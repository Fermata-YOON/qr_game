from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

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

@app.route('/main')
def home():
    return render_template('index.html')

@app.route('/manager/team')
def team():
    return render_template('manage_team.html')

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
            #db.teams.find({'team': team_receive}, {'_id': False})
            db.teams.update_one({'team': team_receive}, {"$push": {'members': name_receive}})

            return jsonify({'msg': '기록 완료'})

@app.route("/team_bonus_record", methods=["POST"])
def bonus_post():
    bonus_team_receive = request.form['bonus_team_give']
    bonus_receive = int(request.form['bonus_give'])

    db.teams.update_one({'team': bonus_team_receive}, {'$inc': {'bonus': bonus_receive}})

    return jsonify({'msg': '지급 완료'})

@app.route("/qr_record", methods=["POST"])
def name_post():
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
            'time': now + datetime.strptime(qr_arr[0]['00:05'], '%H:%M')
        }

        db.qr_list.insert_one(qr_doc)

        return jsonify({'msg': '점령 완료'})
    elif team == qr_arr[0]['team']:
        return jsonify({'msg': '이미 점령중 입니다'})
    elif (datetime.strptime(now, '%H:%M') - datetime.strptime(qr_arr[0]['time'], '%H:%M')).total_seconds() < 600:
        return jsonify({'msg': '지금은 점령할 수 없습니다'})
    elif name_receive in qr_arr[0]['names']:
        return jsonify({'msg': '이전에 점령을 한 적이 있습니다'})
    else:
        count = list(db.teams.find({'members': name_receive}, {'_id': False, 'members': False}))
        print(count[0]['bonus'])
        if count[0]['bonus'] > 0:
            db.qr_list.update_one({'qr_num': int(num_receive)}, {"$push": {'names': name_receive}, '$set': {'time': now, 'team': team}})
            db.teams.update_one({'team': team}, {'$inc': {'bonus': -1}})
            new_count = list(db.teams.find({'members': name_receive}, {'_id': False, 'members': False}))
            msg = '점령 완료, 남은 뒤집기 횟수: ' + str(new_count[0]['bonus'])
            return jsonify({'msg': msg})
        else:
            return jsonify({'msg': '점령할 수 없습니다'})

@app.route("/team_list", methods=["GET"])
def team_get():
    team_list = list(db.teams.find({}, {'_id': False}))

    return jsonify({'teams': team_list})


@app.route("/qr_list", methods=["GET"])
def qr_get():
    qr_receive = request.args.get('qr_give')
    qr_info = list(db.qr_list.find({'qr_num': int(qr_receive)}, {'_id': False}))

    if len(qr_info) > 0:
        return jsonify({'qr_info': qr_info})
    else:
        return jsonify({'qr_info': 0})

@app.route("/color_list", methods=["GET"])
def color_get():
    qr_receive = request.args.get('qr_give')
    qr_info = list(db.qr_list.find({'qr_num': int(qr_receive)}, {'_id': False}))

    if len(qr_info) > 0:
        team = qr_info[0]['team']
        color_list = list(db.teams.find({'team': team}, {'_id': False}))
        color = color_list[0]['color']

        return jsonify({'color': color})
    else:
        return jsonify({'color': 'white'})

@app.route('/qr/01')
def qr_01():
    return render_template('01.html')

@app.route('/qr/02')
def qr_02():
    return render_template('02.html')

@app.route('/qr/03')
def qr_03():
    return render_template('03.html')

@app.route('/qr/04')
def qr_04():
    return render_template('04.html')

@app.route('/qr/05')
def qr_05():
    return render_template('05.html')

@app.route('/qr/06')
def qr_06():
    return render_template('06.html')


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
