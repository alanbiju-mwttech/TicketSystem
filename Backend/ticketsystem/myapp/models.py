from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime, Enum
from myapp.database import Base
from datetime import datetime
import enum

class StepAction(enum.Enum):
    REQUEST_INFO = "REQUEST_INFO"
    INFO_RESPONSE = "INFO_RESPONSE"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class Role(Base):
    
    __tablename__ = "role"

    roleid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role = Column(String, nullable=False, index=True)

class User(Base):

    __tablename__ = "user"

    userid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    roleid = Column(Integer, ForeignKey("role.roleid"))
    name = Column(String, nullable=False, index=True)
    username = Column(String, nullable=False, index=True)
    password = Column(String, nullable=False, index=True)

class Workflow(Base):

    __tablename__ = "workflow"

    workflow_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    workflow_name = Column(String, nullable=False, index=True)
    isActive = Column(Boolean, nullable=False, index=True, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))

class Workflow_Steps(Base):

    __tablename__ = "workflow_steps"

    workflow_step_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    workflow_id = Column(Integer, ForeignKey("workflow.workflow_id"))
    step_order = Column(Integer, index=True, nullable=False)
    roleid = Column(Integer, ForeignKey("role.roleid"))

class Complaint(Base):

    __tablename__ = "complaint"

    complaint_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("user.userid"))
    subject = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False, index=True)
    workflow_id = Column(Integer, ForeignKey("workflow.workflow_id"), nullable=False, index=True)
    status = Column(String, default="COMPLAINT REGISTERED", nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))
    is_paused = Column(Boolean, default=False)

class Complaint_Steps(Base):

    __tablename__ = "complaint_steps"

    complaint_step_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaint.complaint_id"))
    workflow_step_id = Column(Integer, ForeignKey("workflow_steps.workflow_step_id"))
    action_type = Column(Enum(StepAction), nullable=False)
    note = Column(Text, nullable=False, index=True)
    isPrivate = Column(Boolean, nullable=False, index=True, default=True)
    acted_by = Column(Integer, ForeignKey("user.userid"))
    acted_at = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))