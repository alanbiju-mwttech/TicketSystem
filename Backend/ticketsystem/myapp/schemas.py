from pydantic import BaseModel, RootModel
from typing import List, Optional

class Login_Cred(BaseModel):
    username: str
    password: str

class WorkflowStepCreate(BaseModel):
    step_order: int
    role: str

class WorkflowCreate(BaseModel):
    name: str
    steps: List[WorkflowStepCreate]

class WorkFlow_id(BaseModel):
    workflow_id: int

class Complaint(BaseModel):
    studentId: int
    subject: str
    description: str

class StudentId(BaseModel):
    studentId: int

class Current_User(BaseModel):
    user_id: int

class Review_Complaint(BaseModel):
    complaint_id: int
    note: str
    isPrivate: bool
    acted_by: int

class Details(BaseModel):
    user_id: int
    complaint_id: int

class RequestInfo(BaseModel):
    complaint_id: int
    acted_by: int
    note: str


class InfoResponse(BaseModel):
    complaint_id: int
    note: str
    acted_by: int


class ApproveComplaint(BaseModel):
    complaint_id: int
    reviewer_id: int
    note: str


class RejectComplaint(BaseModel):
    complaint_id: int
    note: str
    acted_by: int