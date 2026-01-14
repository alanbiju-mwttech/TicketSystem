from typing import List
from fastapi import APIRouter, Depends, HTTPException
from myapp import schemas, database, models
from sqlalchemy.orm import Session

router = APIRouter()

@router.post('/complaints/pending')
def get_current_step(current_user: schemas.Current_User, db: Session = Depends(database.get_db)):
    complaints = db.query(models.Complaint).filter(models.Complaint.status != "RESOLVED").all()

    assigned_complaints = []

    role_id = db.query(models.User.roleid).filter(models.User.userid == current_user.user_id).scalar()

    for complaint in complaints:
        
        workflow_steps = (
            db.query(models.Workflow_Steps)
            .filter(models.Workflow_Steps.workflow_id == complaint.workflow_id)
            .order_by(models.Workflow_Steps.step_order)
            .all()
        )

        completed_steps = (
            db.query(models.Compaint_Steps)
            .filter(models.Compaint_Steps.complaint_id == complaint.complaint_id)
            .all()
        )
        completed_step_ids = {s.workflow_step_id for s in completed_steps}

        current_step = next(
            (step for step in workflow_steps
                if step.workflow_step_id not in completed_step_ids),
            None
        )

        if current_step is None:
            continue

        if current_step.roleid == role_id:
            assigned_complaints.append({
            "complaint_id": complaint.complaint_id,
            "subject": complaint.subject,
            "status": complaint.status,
            "created_at": complaint.created_at,
            "step_order": current_step.step_order,
            "workflow_step_id": current_step.workflow_step_id
        })

    return assigned_complaints

@router.get('/complaints/{complaint_id}/act')
def get_each_complaint(complaint_id: int, db: Session = Depends(database.get_db)):

    complaint_details = []

    complaint = db.query(models.Complaint).filter(models.Complaint.complaint_id == complaint_id).first()

    student = db.query(models.User).filter(models.User.userid == complaint.student_id).first() # type: ignore

    complaint_details.append({
        "complaint_id": complaint.complaint_id, # type: ignore
        "name": student.name, # type: ignore
        "subject": complaint.subject, # type: ignore
        "description": complaint.description, # type: ignore
        "status": complaint.status,  # type: ignore
        "created_at": complaint.created_at, # type: ignore
    })

    return complaint_details

@router.post("/complaint/action", status_code=201)
def complaint_action(review: schemas.Review_Complaint, db: Session = Depends(database.get_db)):
    try:
        # 1. Load complaint
        complaint = db.query(models.Complaint).filter(
            models.Complaint.complaint_id == review.complaint_id
        ).first()

        if not complaint:
            raise HTTPException(404, "Complaint not found")

        # 2. Load workflow steps
        workflow_steps = db.query(models.Workflow_Steps)\
            .filter(models.Workflow_Steps.workflow_id == complaint.workflow_id)\
            .order_by(models.Workflow_Steps.step_order)\
            .all()

        # 3. Load completed steps
        completed_steps = db.query(models.Compaint_Steps)\
            .filter(models.Compaint_Steps.complaint_id == review.complaint_id)\
            .all()

        completed_step_ids = {s.workflow_step_id for s in completed_steps}

        # 4. Find current active step
        current_step = next(
            (s for s in workflow_steps if s.workflow_step_id not in completed_step_ids),
            None
        )

        if not current_step:
            raise HTTPException(400, "This complaint is already resolved")

        # 5. Validate actor is allowed for this step
        if current_step.roleid != review.acted_by: # type: ignore
            print(current_step.roleid, review.acted_by)
            raise HTTPException(
                403,
                "You are not authorized to act on this workflow step"
            )

        # 6. Create step record
        step_entry = models.Compaint_Steps(
            complaint_id=review.complaint_id,
            workflow_step_id=current_step.workflow_step_id,
            note=review.note,
            acted_by=review.acted_by
        )

        db.add(step_entry)
        db.commit()

        # 7. Check if workflow is now complete
        completed_steps_subquery = (
            db.query(models.Compaint_Steps.workflow_step_id)
            .filter(models.Compaint_Steps.complaint_id == complaint.complaint_id)
            .scalar_subquery()
        )

        remaining_step = (
            db.query(models.Workflow_Steps)
            .filter(
                models.Workflow_Steps.workflow_id == complaint.workflow_id,
                ~models.Workflow_Steps.workflow_step_id.in_(completed_steps_subquery)
            )
            .order_by(models.Workflow_Steps.step_order)
            .first()
        )

        print(remaining_step)

        if remaining_step is None:
            complaint.status = "RESOLVED" # type: ignore
        else:
            role_name = db.query(models.Role.role)\
                .filter(models.Role.roleid == remaining_step.roleid)\
                .scalar()

            complaint.status = f"Pending with {role_name}" # type: ignore

        db.commit()

        return {
            "message": "Review submitted successfully",
            "complaint_id": complaint.complaint_id,
            "status": complaint.status
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))