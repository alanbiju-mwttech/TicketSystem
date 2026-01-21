from typing import List
from fastapi import APIRouter, Depends, HTTPException
from myapp import schemas, database, models
from sqlalchemy.orm import Session

router = APIRouter()

@router.post('/register-complaint')
def register_complaint(complaint_details: schemas.Complaint, db: Session = Depends(database.get_db)):
    try:
        active_workflow = db.query(models.Workflow.workflow_id)\
            .filter(models.Workflow.isActive == True)\
            .first()
        
        workflow_first_step = db.query(models.Workflow_Steps)\
            .filter(models.Workflow_Steps.workflow_id == active_workflow.workflow_id, # type: ignore
                    models.Workflow_Steps.step_order == 1)\
            .first()
        
        first_role = db.query(models.Role).filter(models.Role.roleid == workflow_first_step.roleid).first() # type: ignore

        complaint = models.Complaint(
            student_id = complaint_details.studentId,
            subject = complaint_details.subject,
            description = complaint_details.description,
            workflow_id = active_workflow.workflow_id, # type: ignore
            status = f"Pending with {first_role.role}" # type: ignore
        )

        db.add(complaint)
        db.commit()
        db.refresh(complaint)
        
        raise HTTPException(
            status_code=201,
            detail="Complaint registered successfully.")

    except HTTPException:
        db.rollback()
        raise

@router.post('/get-complaints')
def get_complaints(studentId: schemas.StudentId, db: Session = Depends(database.get_db)):
    complaints = db.query(models.Complaint).filter(models.Complaint.student_id == studentId.studentId).all()
    return complaints

@router.post("/get-all-complaints")
def get_all_complaints(payload: schemas.StudentId, db: Session = Depends(database.get_db)):

    user = (
        db.query(models.User)
        .filter(models.User.userid == payload.studentId)
        .first()
    )

    if not user:
        raise HTTPException(404, "User not found")

    role = (
        db.query(models.Role.role)
        .filter(models.Role.roleid == user.roleid)
        .scalar()
    )

    is_admin = role == "Admin"

    if is_admin:
        complaints = db.query(models.Complaint).order_by(models.Complaint.created_at.desc()).all()

    else:
        raise HTTPException(
            403,
            "You are not authorized to act on this workflow step"
        )

    return complaints
