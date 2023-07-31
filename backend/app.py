
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
# configure the Postgres database
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:Brodydog_2020@localhost/item-stock"
db = SQLAlchemy(app)
app.app_context().push()
CORS(app)


# MODEL
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"Event: {self.description}"
    
    def __init__(self, description):
        self.description = description


# FORMATTER
def format_event(event):
    return {
        "description": event.description,
        "id": event.id,
        "created_at": event.created_at

    }


# ROUTES
@app.route('/')
def hi():
    return "Hi there!"

# CREATE
@app.route('/event', methods = ['POST'])
def create_event():
    description = request.json['description']
    event = Event(description)
    db.session.add(event)
    db.session.commit()
    return format_event(event)

# Get ALL
@app.route('/events', methods = ['GET'])
def get_events():
    events = Event.query.order_by(Event.id.asc()).all()
    event_list = []
    for event in events:
        event_list.append(format_event(event))
    return {"events": event_list}

# Get ONE
@app.route('/event/<id>', methods=['GET'])
def get_event(id):
    event = Event.query.filter_by(id=id).one()
    formatted_event = format_event(event)
    return {"event": formatted_event}

# DELETE
@app.route('/event/<id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.filter_by(id=id).one()
    db.session.delete(event)
    db.session.commit()
    return 'Event deleted!'

# UPDATE
@app.route('/event/<id>', methods=['PUT'])
def update_event(id):
    event = Event.query.filter_by(id=id)
    description = request.json['description']
    event.update(dict(description = description, created_at = datetime.utcnow()))
    db.session.commit()
    return {"event": format_event(event.one())}


if __name__=="__main__":
    app.run(debug=True)
