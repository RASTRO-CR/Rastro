from fastapi import APIRouter
from database import db
from schemas import AlertaBase

router = APIRouter(prefix="/alertas", tags=["Alertas"])

@router.post("/")
async def crear_alerta(a: AlertaBase):
    result = await db["alertas"].insert_one(a.dict())
    return {"id": str(result.inserted_id)}

@router.get("/")
async def listar_alertas():
    alertas = await db["alertas"].find({"activa": True}).to_list(50)
    for a in alertas:
        a["_id"] = str(a["_id"])
    return alertas