from flask import Flask,request,jsonify,make_response
from flask_sqlalchemy import SQLAlchemy
import uuid
from werkzeug.security import generate_password_hash,check_password_hash
import jwt
import datetime
from functools import wraps



app = Flask(__name__)

app.config['SECRET_KEY'] = 'thismustbesecret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///kaingroup.db'

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(50))
    password = db.Column(db.String(80))
    admin =db.Column(db.Boolean)

# decorator
# This function will generate tokens in order to allow only registered users to access

def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        
        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401

        try:
            data = jwt.decode(token,app.config['SECRET_KEY'])
            current_user = User.query.filter_by(user_id=data['user_id']).first()
        except:
            return jsonify({'message' : 'Token is invalid!'}),401

        return f(current_user, *args, **kwargs)

    return decorated

# user routes
@app.route('/user', methods=['GET'])
@token_required
def get_all_users(current_user):

# This code checks for all registered users in the Users table and returns the final result in a JSON format.

    users = User.query.all()

    output = []

# we create a dictionary for user data from that we then append to the output list to be displayed
    for user in users:
        user_data = {}
        user_data['user_id'] = user.user_id
        user_data['name'] = user.name
        user_data['password'] = user.password
        user_data['admin'] = user.admin
        output.append(user_data)

    return jsonify({'users' : output})

@app.route('/user/<user_id>', methods=['GET'])
@token_required
def get_one_user(current_user, user_id):
    
    user = User.query.filter_by(user_id=user_id).first()

    if not user:
        return jsonify({'message' : 'No user Found!'})

    user_data = {}
    user_data['user_id'] = user.user_id
    user_data['name'] = user.name
    user_data['password'] = user.password
    user_data['admin'] = user.admin
    return jsonify({'user': user_data})

@app.route('/signup', methods=['POST'])
def create_user():

    # passes the requested info to json object data
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(user_id=str(uuid.uuid4()), name=data['name'], password=hashed_password, admin=False)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message' : 'New User Created!'})

@app.route('/promote/<user_id>', methods=['PUT'])
@token_required
def promote_user(current_user,user_id):

    if not current_user.admin:
        return jsonify({'message' : 'You Arent Admin,Cannot Perform that Function!' })

    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message' : 'No user Found!'})
    
    user.admin = True
    db.session.commit()

    return jsonify({'message' : 'The user has been promoted'})

@app.route('/login')
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify!',401, {'WWW-Authenticate' : 'Basic realm="Lgin Required"'})

    user = User.query.filter_by(name=auth.username).first()

    if not user:
        return make_response('Could not verify!',401, {'WWW-Authenticate' : 'Basic realm="Lgin Required"'})

    if check_password_hash(user.password,auth.password):
        token = jwt.encode({'user_id': user.user_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])

        return jsonify({'token' : token.decode('UTF-8')})

    return make_response('Could not verify!',401, {'WWW-Authenticate' : 'Basic realm="Lgin Required"'})

if __name__=='__main__':
    db.create_all()
    app.run(debug=True)
