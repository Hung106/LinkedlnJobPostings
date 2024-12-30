from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Posting(db.Model):
    __tablename__ = 'posting'
    posting_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    posting_description = db.Column(db.Text, nullable=True)
    job_posting_url = db.Column(db.String(255), nullable=True)
    application_type = db.Column(db.String(100), nullable=True)
    skills_description = db.Column(db.Text, nullable=True)
    formatted_worktype = db.Column(db.String(100), nullable=True)
    zip_code = db.Column(db.String(10), nullable=True)
    remote_allowed = db.Column(db.Boolean, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    company_id = db.Column(db.BigInteger, db.ForeignKey('company.company_id'), nullable=False)
    job_id = db.Column(db.BigInteger, db.ForeignKey('job.job_id'), nullable=False)

    states = db.relationship('PostingState', backref='posting', cascade="all, delete-orphan", lazy=True)
    additional_infos = db.relationship('AdditionalInfo', backref='posting', cascade="all, delete-orphan", lazy=True)
    
    def to_dict(self):
        return {
            "posting_id": self.posting_id,
            "title": self.title,
            "posting_description": self.posting_description,
            "job_posting_url": self.job_posting_url,
            "application_type": self.application_type,
            "skills_description": self.skills_description,
            "formatted_worktype": self.formatted_worktype,
            "zip_code": self.zip_code,
            "remote_allowed": self.remote_allowed,
            "location": self.location,
            "company_id": self.company_id,
            "job_id": self.job_id
        }

class PostingState(db.Model):
    __tablename__ = 'posting_state'
    id = db.Column(db.Integer, primary_key=True)
    posting_id = db.Column(db.Integer, db.ForeignKey('posting.posting_id'), nullable=False)
    expiry = db.Column(db.DateTime, nullable=False)
    remaining_time = db.Column(db.Integer, nullable=True)
    apply_rate = db.Column(db.Float, nullable=True)
    views = db.Column(db.Integer, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "posting_id": self.posting_id,
            "expiry": self.expiry,
            "remaining_time": self.remaining_time,
            "apply_rate": self.apply_rate,
            "views": self.views
        }

class AdditionalInfo(db.Model):
    __tablename__ = 'additional_info'
    id = db.Column(db.Integer, primary_key=True)
    posting_id = db.Column(db.Integer, db.ForeignKey('posting.posting_id'), nullable=False)
    info = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "posting_id": self.posting_id,
            "info": self.info
        }