from fastapi import APIRouter, Depends, HTTPException
from myapp import schemas, database, models, utils
from sqlalchemy.orm import Session

router = APIRouter()

@router.post('/complaints/pending')
def get_current_step(current_user: schemas.Current_User, db: Session = Depends(database.get_db)):
    complaints = db.query(models.Complaint).filter(models.Complaint.status.not_in(["RESOLVED", "REJECTED"])).all()

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
            db.query(models.Complaint_Steps)
            .filter(models.Complaint_Steps.complaint_id == complaint.complaint_id, 
                    models.Complaint_Steps.action_type == models.StepAction.APPROVED)
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

    last_step = db.query(models.Complaint_Steps).\
    filter(models.Complaint_Steps.complaint_id == complaint_id).\
    order_by(models.Complaint_Steps.complaint_step_id.desc()).\
    first()

    current_action = last_step.action_type if last_step else "No Action Recorded"

    complaint_details.append({
        "complaint_id": complaint.complaint_id, # type: ignore
        "name": student.name, # type: ignore
        "subject": complaint.subject, # type: ignore
        "description": complaint.description, # type: ignore
        "status": complaint.status,  # type: ignore
        "workflow_id": complaint.workflow_id, # type: ignore
        "created_at": complaint.created_at, # type: ignore
        "is_paused": complaint.is_paused,  # type: ignore
        "current_action": current_action,  # type: ignore
    })

    return complaint_details

@router.post("/complaint/action", status_code=201)
def complaint_action(review: schemas.Review_Complaint, db: Session = Depends(database.get_db)):
    try:
        step = utils.get_current_workflow_step(db, review.complaint_id)

        if not step:
            raise HTTPException(status_code=404, detail="No active workflow step")

        db.add(models.Complaint_Steps(
            complaint_id=review.complaint_id,
            workflow_step_id=step.workflow_step_id,
            action_type=models.StepAction.APPROVED,
            note=review.note,
            isPrivate=review.isPrivate,
            acted_by=review.acted_by
        ))

        db.commit()

        complaint = db.query(models.Complaint).get(review.complaint_id)
        complaint.is_paused = False # type: ignore

        next_step = utils.get_current_workflow_step(db, review.complaint_id)

        if next_step:
            role = db.query(models.Role).filter(models.Role.roleid == next_step.roleid).first()
            complaint.status = f"Pending with {role.role}" # type: ignore
        else:
            complaint.status = "RESOLVED" # type: ignore

        db.commit()

        return {"message": "Complaint approved"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/complaint/reject")
def reject_complaint(payload: schemas.RejectComplaint, db: Session = Depends(database.get_db)):

    step = utils.get_current_workflow_step(db, payload.complaint_id)

    db.add(models.Complaint_Steps(
        complaint_id=payload.complaint_id,
        workflow_step_id=step.workflow_step_id, # type: ignore
        action_type=models.StepAction.REJECTED,
        note=payload.note,
        isPrivate=False,
        acted_by=payload.acted_by
    ))

    complaint = db.query(models.Complaint).get(payload.complaint_id)
    complaint.status = "REJECTED" # type: ignore

    db.commit()

    return {"message": "Information requested from student"}