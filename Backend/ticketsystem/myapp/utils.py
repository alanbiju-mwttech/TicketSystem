from sqlalchemy.orm import Session
from typing import Optional, Set

from myapp.models import Complaint, Workflow_Steps, Complaint_Steps, StepAction

def get_current_workflow_step(db: Session, complaint_id: int) -> Optional[Workflow_Steps]:

    complaint = (
        db.query(Complaint)
        .filter(Complaint.complaint_id == complaint_id)
        .first()
    )

    if not complaint:
        return None

    approved_steps: Set[int] = {
        row[0]
        for row in (
            db.query(Complaint_Steps.workflow_step_id)
            .filter(
                Complaint_Steps.complaint_id == complaint_id,
                Complaint_Steps.action_type == StepAction.APPROVED
            )
            .all()
        )
    }

    query = (
        db.query(Workflow_Steps)
        .filter(Workflow_Steps.workflow_id == complaint.workflow_id)
    )

    if approved_steps:
        query = query.filter(
            ~Workflow_Steps.workflow_step_id.in_(approved_steps)
        )

    return (
        query
        .order_by(Workflow_Steps.step_order)
        .first()
    )