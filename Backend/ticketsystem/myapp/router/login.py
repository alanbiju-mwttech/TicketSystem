from fastapi import APIRouter, Depends, HTTPException, status
from myapp import schemas, database, models
from sqlalchemy.orm import Session

router = APIRouter()

@router.post('/login')
def login(login_details: schemas.Login_Cred, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == login_details.username, models.User.password == login_details.password).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Wrong username or password')

    role = db.query(models.Role).filter(models.Role.roleid == user.roleid).first()
    return {"user_id": user.userid, "role": role.role, "isLoggedIn": True} # type: ignore