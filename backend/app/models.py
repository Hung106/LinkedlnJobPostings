from flask_sqlalchemy import SQLAlchemy
import base64

db = SQLAlchemy()

class Salary(db.Model):
    __tablename__ = 'salary'
    salary_id = db.Column(db.BigInteger, primary_key=True)
    job_id = db.Column(db.BigInteger, nullable=True)
    currency = db.Column(db.String(10), nullable=True)
    compensation_type = db.Column(db.String(50), nullable=True)
    pay_period = db.Column(db.String(50), nullable=True)
    
    def to_dict(self):
        return {
            'salary_id': self.salary_id,
            'job_id': self.job_id,
            'currency': self.currency,
            'compensation_type': self.compensation_type,
            'pay_period': self.pay_period
        }
class Salary_Type(db.Model):
    __tablename__ = 'salary_type'
    salary_id = db.Column(db.BigInteger, primary_key=True)
    salary_type = db.Column(db.String(10), nullable=False)
    value = db.Column(db.Float, nullable=True)
    
    def to_dict(self):
        return {
            'salary_id': self.salary_id,
            'salary_type': self.salary_type,
            'value': self.value,
        }
    
class Company(db.Model):
    __tablename__ = 'company'
    company_id = db.Column(db.BigInteger, primary_key=True)
    company_name = db.Column(db.String(255), nullable=True)
    company_size = db.Column(db.Integer, nullable=True)
    company_url = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    
    postings = db.relationship('Posting', backref='company', lazy=True)
    
    def to_dict(self):
        return {
            'company_id': self.company_id,
            'company_name': self.company_name,
            'company_size': self.company_size,
            'company_url': self.company_url,
            'description': self.description
        }

class Job(db.Model):
    __tablename__ = 'job'
    job_id = db.Column(db.BigInteger, primary_key=True)
    job_description = db.Column(db.Text, nullable=True)
    skills = db.Column(db.String(max), nullable=True)

    postings = db.relationship('Posting', backref='job', lazy=True)
    
    def to_dict(self):
        return {
            'job_id': self.job_id,
            'job_description': self.job_description,
            'skills': self.skills
        }

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
    apply_rate =db.Column(db.Float,nullable=True)
    remaining_time = db.Column(db.Time(7), nullable=True)
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
            "job_id": self.job_id,
            "apply_rate": self.apply_rate,
             "remaining_time": self.remaining_time.strftime('%H:%M:%S') if self.remaining_time else None,
        }

class PostingState(db.Model):
    __tablename__ = 'posting_state'
    posting_state_id = db.Column(db.Integer, primary_key=True)
    posting_id = db.Column(db.Integer, db.ForeignKey('posting.posting_id'), nullable=False)
    expiry = db.Column(db.DateTime, nullable=False)
    original_listed_time = db.Column(db.DateTime, nullable=False)
    listed_time = db.Column(db.DateTime, nullable=False)
    applies = db.Column(db.Integer, nullable=True)
    views = db.Column(db.Integer, nullable=True)

    def to_dict(self):
        data = {
            'posting_state_id': self.posting_state_id,
            'posting_id': self.posting_id,
            'expiry': self.expiry,
            'original_listed_time': self.original_listed_time,
            'listed_time': self.listed_time,
            'applies': self.applies,
            'views': self.views,
        }

        for field in self.__dict__:
            value = getattr(self, field)
            if isinstance(value, bytes):
                data[field] = base64.b64encode(value).decode('utf-8')

        return data

class AdditionalInfo(db.Model):
    __tablename__ = 'additional_info'
    additional_info_id = db.Column(db.Integer, primary_key=True)
    posting_id = db.Column(db.Integer, db.ForeignKey('posting.posting_id'), nullable=False)
    formatted_experience_level = db.Column(db.Text, nullable=True)
    posting_domain = db.Column(db.Text, nullable=True)
    application_url = db.Column(db.Text, nullable=True)
    close_time = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        data = {
            "additional_info_id": self.additional_info_id,
            "posting_id": self.posting_id,
            "formatted_experience_level": self.formatted_experience_level,
            "posting_domain": self.posting_domain,
            "application_url": self.application_url,
            "close_time": self.close_time
        }

        for field in self.__dict__:
            value = getattr(self, field)
            if isinstance(value, bytes):
                data[field] = base64.b64encode(value).decode('utf-8')

        return data