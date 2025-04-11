"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, News, Adoptions, SosCases, Donations, Veterinary, AnimalShelter
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
import os
from werkzeug.utils import secure_filename

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


@api.route("/users", methods=["GET"])
def users():
    response_body = {}
    if request.method == "GET":
        rows = db.session.execute(db.select(Users)).scalars()
        results = [row.serialize() for row in rows]
        response_body["message"] = "Users data retieved successfully"
        response_body["results"] = results
        return response_body, 200


@api.route("/users/<int:user_id>", methods=["GET", "PUT", "DELETE"])
def user(user_id):
    response_body = {}
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        response_body["message"] = "User not found"
        return response_body, 404
    if request.method == "GET":
        response_body["message"] = F"Data of user {user_id} retrieved"
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == "PUT":
        data = request.json
        row.email = data.get("email", row.email)
        row.user_name = data.get("user_name", row.user_name)
        db.session.commit()
        response_body["message"] = F"Data of user {user_id} changed successfully"
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == "DELETE":
        # db.session.delete(row)
        row.is_active = False
        db.session.commit()
        response_body["message"] = F"User {user_id} deleted successfully"
        return response_body, 200


@api.route("/sign-up", methods=["POST"])
def sign_up():
        response_body = {}
        data = request.json
        existing_user = Users.query.filter_by(user_name=data.get("user_name")).first()
        if existing_user:
            response_body["message"]= "User name already taken"
            return response_body, 400
        new_user = Users(user_name = data.get("user_name"),
                         email = data.get("email"),
                         password = data.get("password"),
                         role = data.get("role"),
                         is_active = True)
        db.session.add(new_user)
        db.session.commit()
        response_body["message"] = "User created correctly"
        response_body["email"] = new_user.email
        response_body["role"] = new_user.role
        return response_body, 200


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)
    row = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active == True)).scalar()
    if row is None:
        response_body["message"] = "Bad username or password"
        return response_body, 400
    user = row.serialize()
    claims = {"user_id": user["id"],
              "role": user["role"]}
    access_token = create_access_token(identity=email, additional_claims=claims)
    response_body["message"] = "User logged in"
    response_body["results"] = user
    response_body["access_token"] = access_token
    return response_body, 200


@api.route("/news", methods=["GET"])
def news():
    respose_body = {}
    if request.method == "GET":
        rows = db.session.execute(db.select(News)).scalars()
        results = [row.serialize() for row in rows]
        respose_body["message"] = "News data retrieved successfully"
        respose_body["results"] = results
        return respose_body, 200


@api.route("/news", methods=["POST"])
@jwt_required()
def news_post():
    response_body = {}
    additional_claims = get_jwt()
    if additional_claims["role"] != "Protector":
        response_body["message"] = "You don't have permission to post news"
        return response_body, 400
    if request.method == "POST":
        data = request.json
        new_news = News(title = data.get("title"),
                        body = data.get("body"),
                        img_url = data.get("img_url"),
                        created_at = data.get("created_at"),
                        importance_level = data.get("importance_level"),
                        user_id = additional_claims["user_id"])
        db.session.add(new_news)
        db.session.commit()
        response_body["message"] = "News data posted successfully"
        response_body["results"] = new_news.serialize()
        return response_body, 201


@api.route("/news/<int:news_id>", methods=["GET"])
def new_get(news_id):
    response_body = {}
    if request.method == "GET":
        row = db.session.execute(db.select(News).where(News.id == news_id)).scalar()
        response_body["message"] = "News data successfully retieved"
        response_body["results"] = row.serialize()
        return response_body, 200


@api.route("/news/<int:news_id>", methods=["PUT", "DELETE"])
@jwt_required()
def new(news_id):
    response_body = {}
    row = db.session.execute(db.select(News).where(News.id == news_id)).scalar()
    if row is None:
        response_body["message"] = "News not found"
        return response_body, 400
    additional_claims = get_jwt()
    user_id = additional_claims(["user_id"])
    if user_id != row.user_id:
        response_body["message"] = "Access denied"
        return response_body, 400
    if request.method == "PUT":
        data = request.json
        row.title = data.get("title", row.title)
        row.body = data.get("body", row.body)
        row.is_active = data.get("is_active", row.is_active)
        row.created_at = data.get("created_at", row.created_at)
        row.importance_level = data.get("importance_level", row.importance_level)
        row.img_url = data.get("img_url", row.img_url)
        db.session.commit()
        response_body["message"] = "News updated successfully"
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method =="DELETE":
        db.session.delete(row)
        db.session.commit()
        response_body["message"] = "News deleted successfully"
        response_body["results"] = {}
        return response_body, 200


@api.route("/adoptions", methods=["GET"])
def get_adoptions():
    response_body = {}
    if request.method == "GET":
        rows = db.session.execute(db.select(Adoptions)).scalars()
        results = [row.serialize() for row in rows]
        response_body["message"] = "Adoptions data retrieved successfully"
        response_body["results"] = results
        return response_body, 200


@api.route("/adoptions", methods=["POST"])
@jwt_required()
def adoptions():
    response_body = {}
    additional_claims = get_jwt()
    if additional_claims["role"] != "Protector":
        response_body["message"] = "You don't have permission to post"
        return response_body, 400
    if request.method == "POST":
        data = request.json
        new_adoption = Adoptions(status = data.get("status"),
                                 is_active = True,
                                 how_old = data.get("how_old"),
                                 specie = data.get("specie"),
                                 race = data.get("race"),
                                 sex = data.get("sex"),
                                 unadopted_time = data.get("unadopted_time"),
                                 province = data.get("province"),
                                 description = data.get("description"),
                                 img_url = data.get("img_url"),
                                 adoption_priority = True,
                                 user_id = additional_claims["user_id"])
        db.session.add(new_adoption)
        db.session.commit()
        response_body["message"] = "Adoption posted successfully"
        return response_body, 200


@api.route("/adoptions/<int:adoption_id>", methods=["GET"])
def get_adoption(adoption_id):
    response_body = {}
    if request.method == "GET":
        row = db.session.execute(db.select(Adoptions).where(Adoptions.id == adoption_id)).scalar()
        response_body["message"] = "Adoption posted successfully"
        response_body["results"] = row.serialize()
        return response_body, 200
    

@api.route("/adoptions/<int:adoption_id>", methods=["PUT", "DELETE"])
@jwt_required()
def adoption(adoption_id):
    response_body = {}
    row = db.session.execute(db.select(Adoptions).where(Adoptions.id == adoption_id)).scalar()
    additional_claims = get_jwt()    
    if additional_claims["role"] != "Protector":
        response_body["message"] = "You don't have permission"
        return response_body, 400
    if row is None:
        response_body["message"] = "Adoption data not found"
        return response_body, 400
    if request.method == "PUT":
        data = request.json
        row.status = data.get("status", row.status)
        row.is_active = data.get("is_active", row.is_active)
        row.how_old = data.get("how_old", row.how_old)
        row.specie = data.get("specie", row.specie)
        row.race = data.get("race", row.race)
        row.sex = data.get("sex", row.sex)
        row.unadopted_time = data.get("unadopted_time", row.unadopted_time)
        row.province = data.get("province", row.province)
        row.description = data.get("description", row.description)
        row.img_url = data.get("img_url", row.img_url)
        row.adption_priority = data.get("adoption_priority", row.adoption_priority)
        db.session.commit()
        response_body["message"] = "Adoption updated successfully"
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == "DELETE":
        db.session.delete(row)
        db.session.commit()
        response_body["message"] = "Adoption deleted successfully"
        response_body["results"] = {}
        return response_body, 200


@api.route("/sos-cases", methods=["GET"])
def get_sos_cases():
    response_body = {}
    if request.method == "GET":
        rows = db.session.execute(db.select(SosCases)).scalars()
        results = [row.serialize() for row in rows]
        response_body["message"] = "Sos Cases data retrieved successfully"
        response_body["results"] = results
        return response_body, 200
    

@api.route("/sos-cases", methods=["POST"])
@jwt_required()
def sos_cases():
    response_body = {}
    additional_claims = get_jwt()
    if additional_claims["role"] != "Protector":
        response_body["message"] = "You don't have permission"
        return response_body, 400
    if request.method == "POST":
        data = request.json
        new_sos_case = SosCases(img_url = data.get("img_url"),
                                province = data.get("province"),
                                specie = data.get("specie"),
                                description = data.get("description"),
                                status = data.get("status"),
                                operation_cost = data.get("operation_cost"),
                                pending_amount = data.get("pending_amount"),
                                is_active = data.get("is_active"),
                                user_id = additional_claims["user_id"])
        db.session.add(new_sos_case)
        db.session.commit()
        response_body["message"] = "Sos case posted successfully"
        return response_body, 200


@api.route("/sos-cases/<int:case_id>", methods=["GET"])
def get_sos_case(case_id):
    response_body = {}
    if request.method == "GET":
        row = db.session.execute(db.select(SosCases).where(SosCases.id == case_id)).scalar()
        response_body["message"] = "Sos case data retrieved successfully"
        response_body["results"] = row.serialize()
        return response_body, 200
    

@api.route("/sos-cases/<int:case_id>", methods=["PUT", "DELETE"])
@jwt_required()
def sos_case(case_id):
    response_body = {}
    row = db.session.execute(db.select(SosCases).where(SosCases.id) == case_id).scalar()
    additional_claims = get_jwt()
    if additional_claims["role"] != "Protector":
        response_body["message"] = "You don't have permission"
        return response_body, 400
    if row is None:
        response_body["message"] = "Sos case data not found"
        return response_body, 400
    if request.method == "PUT":
        data = request.json
        row.image_url = data.get("img_url", row.img_url)
        row.province = data.get("province", row.province)
        row.specie = data.get("specie", row.specie)
        row.description = data.get("description", row.description)
        row.status = data.get("status", row.status)
        row.operation_cost = data.get("operation_cost", row.operation_cost)
        row.pending.amount = data.get("pending_amount", row.pending.amount)
        row.is_active = data.get("is_active", row.is_active)
        db.session.commit()
        response_body["message"] = "Sos case updated successfully"
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == "DELETE":
        db.session.delete(row)
        db.session.commit()
        response_body["message"] = "Sos case deleted successfully"
        response_body["results"] = {}
        return response_body, 200


@api.route("/donations", methods=["GET", "POST"])
def donations():
    response_body = {}
    if request.method == "GET":
        rows = db.session.execute(db.select(Donations)).scalars()
        results = [row.serialize() for row in rows]
        response_body["message"] = "Donations data retireved successfully"
        response_body["results"] = results
        return response_body, 200
    if request.method == "POST":
        data = request.json
        new_donation = Donations(donation_date = data.get("donation_date"),
                                 is_public = data.get("is_public"),
                                 donor_name = data.get("donor_name"),
                                 donor_amount = data.get("donor_amount"))
        db.session.add(new_donation)
        db.session.commit()
        response_body["message"] = "Donation posted successfully"
        return response_body, 200


@api.route("/donations/<int:donation_id>", methods=["GET"])
def donation(donation_id):
    response_body = {}
    row = db.session.execute(db.select(Donations).where(Donations.id == donation_id)).scalar()
    if request.method == "GET":
        response_body["message"] = "Donation data retireved successfully"
        response_body["results"] = row.serialize()
        return response_body, 200

    
@api.route("/donations/<int:donation_id>", methods=["DELETE"])
def delete_donation(donation_id):
    response_body = {}
    row = db.session.execute(db.select(Donations).where(Donations.id == donation_id)).scalar()
    if row == None:
        response_body["message"] = "Donation not found"
        return response_body, 404
    if request.method == "DELETE":
        db.session.delete(row)
        db.session.commit()
        response_body["message"] = "Donation deleted successfully"
        response_body["results"] = {}
        return response_body, 200


@api.route("/animal-shelters", methods=["GET", "POST"])
def animal_shelters():
    response_body = {}
    if request.method == "GET":
        rows = db.session.execute(db.select(AnimalShelter)).scalars()
        results = [row.serialize() for row in rows]
        response_body["message"] = "Veterinaries data retrieved successfully"
        response_body["results"] = results
        return response_body, 200
    if request.method == "POST":
        data = request.json
        new_shelter = AnimalShelter(shelter_name = data.get("shelter_name"),
                                    address = data.get("address"),
                                    phone_number = data.get("phone_number"),
                                    city = data.get("city"),
                                    email = data.get("email"),
                                    web_url = data.get("web_url"),
                                    img_url = data.get("img_url"))
        db.session.add(new_shelter)
        db.session.commit()
        response_body["message"] = "Shelter data added successfully"
        return response_body, 200
    

@api.route("/animal-shelters/<int:shelter_id>", methods=["GET", "PUT", "DELETE"])
def animal_shelter(shelter_id):
    response_body= {}
    row = db.session.execute(db.select(AnimalShelter).where(AnimalShelter.id == shelter_id)).scalar()
    if row is None:
        response_body["message"] = "Shelter not found"
        return response_body, 400
    if request.method == "GET":
        response_body["message"] = "Animal shelter data retrieved successfully"
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == "PUT":
        data = request.json
        row.shelter_name = data.get("shelter_name", row.shelter_name),
        row.address = data.get("address", row.address),
        row.phone_number = data.get("phone_number", row.phone_number),
        row.city = data.get("city", row.city),
        row.email = data.get("email", row.email),
        row.web_url = data.get("web_url", row.web_url)
        db.session.commit()
        response_body["message"] = "Shelter data updated successfully"
        return response_body, 200
    if request.method == "DELETE":
        db.session.delete(row)
        db.session.commit()
        response_body["message"] = "Shelter deleted successfully"
        response_body["results"] = {}
        return response_body, 200


@api.route("/veterinaries", methods=["GET", "POST"])
def veterinaries():
    response_body = {}
    if request.method == "GET":
        rows = db.session.execute(db.select(Veterinary)).scalars()
        results = [row.serialize() for row in rows]
        response_body["message"] = "Veterinaries data retrieved successfully"
        response_body["results"] = results
        return response_body, 200
    if request.method == "POST":
        data = request.json
        new_veterinary = Veterinary(veterinary_name = data.get("veterinary_name"),
                                    address = data.get("address"),
                                    phone_number = data.get("phone_number"),
                                    city = data.get("city"),
                                    email = data.get("email"),
                                    web_url = data.get("web_url"),
                                    img_url = data.get("img_url"))
        db.session.add(new_veterinary)
        db.session.commit()
        response_body["message"] = "Veterinary data added successfully"
        return response_body, 200
    

@api.route("/veterinaries/<int:veterinary_id>", methods=["GET", "PUT", "DELETE"])
def veterinary(veterinary_id):
    response_body = {}
    row = db.session.execute(db.select(Veterinary).where(Veterinary.id == veterinary_id)).scalar()
    if row is None:
        response_body["message"] = "Veterinary not found"
        return response_body, 400
    if request.method == "GET":
        response_body["message"] = "Veterinary data retrieved successfully"
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == "PUT":
        data = request.json
        row.veterinary_name = data.get("veterinary_name", row.veterinary_name),
        row.address = data.get("address", row.address),
        row.phone_number = data.get("phone_number", row.phone_number),
        row.city = data.get("city", row.city),
        row.email = data.get("email", row.email),
        row.web_url = data.get("web_url", row.web_url)
        db.session.commit()
        response_body["message"] = "Veterinary data updated successfully"
        return response_body, 200
    if request.method == "DELETE":
        db.session.delete(row)
        db.session.commit()
        response_body["message"] = "Veterinary deleted successfully"
        response_body["results"] = {}
        return response_body, 200


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@api.route("/upload", methods=["POST"])
def upload_image():
    response_body = {}
    if 'image' not in request.files:
        response_body["message"] = "No file part"
        return response_body, 400
    file = request.files['image']
    if file.filename == '':
        response_body["message"] = "No selected file"
        return response_body, 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        img_url = f'{filename}'
        response_body["img_url"] = img_url
        return response_body, 200
    else:
        response_body["message"] = "File not allowed"
        return response_body, 400
