from fastapi import APIRouter, HTTPException
from database import db
from schemas import Competencia

router = APIRouter(prefix="/competencias", tags=["Competencias"])

@router.post("/")
async def crear_competencia(c: Competencia):
    result = await db["competencias"].insert_one(c.dict())
    return {"id": str(result.inserted_id)}

@router.get("/")
async def listar_competencias():
    comps = await db["competencias"].find().to_list(100)
    for c in comps:
        c["_id"] = str(c["_id"])
    return comps