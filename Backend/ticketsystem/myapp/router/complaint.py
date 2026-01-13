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

        complaint = models.Complaint(
            student_id = complaint_details.studentId,
            subject = complaint_details.subject,
            description = complaint_details.description,
            workflow_id = active_workflow.workflow_id # type: ignore
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