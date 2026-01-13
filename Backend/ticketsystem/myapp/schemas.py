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
    acted_by: int