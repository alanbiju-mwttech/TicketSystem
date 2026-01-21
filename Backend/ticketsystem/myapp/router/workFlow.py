from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from myapp import schemas, database, models
from sqlalchemy import func, desc
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/get-roles")
def get_roles(db: Session = Depends(database.get_db)):
    roles = db.query(models.Role.role).filter(models.Role.role != "Student", models.Role.role != "Admin").all()

    return [role[0] for role in roles]

@router.post("/add-workflow")
def add_workflow(payload: schemas.WorkflowCreate, db: Session = Depends(database.get_db)):
    try:
        active = (
            db.query(models.Workflow)
            .filter(models.Workflow.isActive == True)
            .first()
        )

        if active:
            active.isActive = False # type: ignore

        newWorkFlow = models.Workflow(
            workflow_name=payload.name,
            isActive=True
        )
        db.add(newWorkFlow)
        db.commit()
        db.refresh(newWorkFlow)

        steps = []

        for step in payload.steps:
            role_id = (
                db.query(models.Role.roleid)
                .filter(models.Role.role == step.role)
                .scalar()
            )

            if role_id is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid role: {step.role}"
                )

            steps.append(
                models.Workflow_Steps(
                    workflow_id=newWorkFlow.workflow_id,
                    step_order=step.step_order,
                    roleid=role_id
                )
            )

        db.add_all(steps)
        db.commit()

        return {
            "workflow_id": newWorkFlow.workflow_id,
            "message": "Workflow created successfully"
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get('/get-workflows')
def get_workflows(db: Session = Depends(database.get_db)):
    workflows = db.query(models.Workflow).order_by(models.Workflow.created_at.desc()).all()
    for workflow in workflows:
        if workflow.isActive is True:
            workflow.isActive = "Active" # type: ignore
        else:
            workflow.isActive = "Inactive" # type: ignore
    return workflows

@router.post('/set-active')
def set_active(workflow_id: schemas.WorkFlow_id, db: Session = Depends(database.get_db)):
    try:
        active = (
            db.query(models.Workflow)
            .filter(models.Workflow.isActive == True)
            .first()
        )

        if active:
            active.isActive = False # type: ignore

        new_active = (
            db.query(models.Workflow)
            .filter(models.Workflow.workflow_id == workflow_id.workflow_id)
            .first()
        )

        if new_active:
            new_active.isActive = True # type: ignore

        db.commit()
        db.refresh(active)
        db.refresh(new_active)

        return {
            "New Active WorkFlow ": new_active.workflow_id, # type: ignore
            "message": "New Active Updated Successfully"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete('/delete-workflow')
def delete_workflow(workflow_id: schemas.WorkFlow_id, db: Session = Depends(database.get_db)):
    try:
        db.query(models.Workflow_Steps)\
            .filter(models.Workflow_Steps.workflow_id == workflow_id.workflow_id)\
            .delete(synchronize_session=False)

        workflow = db.query(models.Workflow).filter(models.Workflow.workflow_id == workflow_id.workflow_id).first()

        db.delete(workflow)
        db.commit()

        return {
            "WorkFlow Deleted": workflow.workflow_id, # type: ignore
            "message": "WorkFlow Deleted Successfully"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))