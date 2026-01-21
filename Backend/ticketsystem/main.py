from fastapi import FastAPI
from myapp import models, database
from fastapi.middleware.cors import CORSMiddleware
from myapp.router import login, workFlow, complaint, queryResolve, reviewHistory, requestInfo

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(login.router)
app.include_router(workFlow.router)
app.include_router(complaint.router)
app.include_router(queryResolve.router)
app.include_router(reviewHistory.router)
app.include_router(requestInfo.router)