from typing import List
from fastapi import APIRouter, Depends, HTTPException
from myapp import schemas, database, models, utils
from sqlalchemy.orm import Session


router = APIRouter()

@router.post("/complaint/request-info")
def request_info(payload: schemas.RequestInfo, db: Session = Depends(database.get_db)):

    step = utils.get_current_workflow_step(db, payload.complaint_id)

    db.add(models.Compaint_Steps(
        complaint_id=payload.complaint_id,
        workflow_step_id=step.workflow_step_id, # type: ignore
        action_type=models.StepAction.REQUEST_INFO,
        note=payload.note,
        isPrivate=False,
        acted_by=payload.acted_by
    ))

    complaint = db.query(models.Complaint).get(payload.complaint_id)
    complaint.is_paused = True # type: ignore

    db.commit()

    return {"message": "Information requested from student"}


@router.post("/complaint/info-response")
def info_response(payload: schemas.InfoResponse, db: Session = Depends(database.get_db)):

    step = utils.get_current_workflow_step(db, payload.complaint_id)

    db.add(models.Compaint_Steps(
        complaint_id=payload.complaint_id,
        workflow_step_id=step.workflow_step_id, # type: ignore
        action_type=models.StepAction.INFO_RESPONSE,
        note=payload.note,
        isPrivate=False,
        acted_by=payload.acted_by
    ))

    db.commit()

    return {"message": "Information submitted by student"}