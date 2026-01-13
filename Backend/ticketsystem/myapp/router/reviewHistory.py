from typing import List
from fastapi import APIRouter, Depends, HTTPException
from myapp import schemas, database, models
from sqlalchemy.orm import Session

router = APIRouter()

@router.get('/complaints/{complaint_id}/review-history')
def get_current_step(complaint_id: int, db: Session = Depends(database.get_db)):

    complaint_steps = []
    complaint_step = db.query(models.Compaint_Steps).filter(models.Compaint_Steps.complaint_id == complaint_id).all()

    for step in complaint_step:

        reviewer = db.query(models.User).filter(models.User.userid == step.acted_by).first()
        role = db.query(models.Role).filter(models.Role.roleid == reviewer.roleid).first() # type: ignore

        complaint_steps.append({
            "reviewer_name": reviewer.name, # type: ignore
            "role": role.role, # type: ignore
            "note": step.note,
            "acted_at": step.acted_at
        })

    return complaint_steps