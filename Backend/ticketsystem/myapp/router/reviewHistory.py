from fastapi import APIRouter, Depends
from myapp import schemas, database, models
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/complaints/review-history")
def get_review_history(details: schemas.Details, db: Session = Depends(database.get_db)):
    user = (
        db.query(models.User)
        .filter(models.User.userid == details.user_id)
        .first()
    )

    if not user:
        return {}

    user_role_name = (
        db.query(models.Role.role)
        .filter(models.Role.roleid == user.roleid)
        .scalar()
    )

    rows = (
        db.query(
            models.Complaint_Steps,
            models.User,
            models.Role
        )
        .join(models.User, models.User.userid == models.Complaint_Steps.acted_by)
        .join(models.Role, models.Role.roleid == models.User.roleid)
        .filter(models.Complaint_Steps.complaint_id == details.complaint_id)
        .order_by(
            models.Complaint_Steps.workflow_step_id,
            models.Complaint_Steps.acted_at
        )
        .all()
    )

    history = {}

    for step, acted_user, role in rows:

        if user_role_name == "Student" and step.isPrivate == True:
            continue

        entry = {
            "action": step.action_type.value,
            "note": step.note,
            "acted_by": acted_user.name,
            "role": role.role,
            "acted_at": step.acted_at,
        }

        # ONLY non-students see isPrivate
        if user_role_name != "Student":
            entry["isPrivate"] = step.isPrivate

        history.setdefault(step.workflow_step_id, []).append(entry)

    return history