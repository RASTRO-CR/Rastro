from fastapi import APIRouter
from database import db
from schemas import Resumen

router = APIRouter(prefix="/resumenes", tags=["Resumenes"])

@router.post("/")
async def crear_resumen(r: Resumen):
    result = await db["resumenes"].insert_one(r.dict())
    return {"id": str(result.inserted_id)}

@router.get("/{competencia_id}")
async def obtener_resumenes(competencia_id: str):
    res = await db["resumenes"].find({"competencia_id": competencia_id}).to_list(20)
    for r in res:
        r["_id"] = str(r["_id"])
    return res