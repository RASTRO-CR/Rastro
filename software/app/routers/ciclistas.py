from fastapi import APIRouter, HTTPException
from schemas import Ciclista
import models

router = APIRouter(prefix="/ciclistas", tags=["Ciclistas"])

@router.post("/")
async def crear_ciclista(c: Ciclista):
    ciclista = await models.agregar_ciclista(c.dict())
    return {"status": "ok", "ciclista": ciclista}

@router.get("/")
async def listar_ciclistas():
    ciclistas = await models.obtener_ciclistas()
    return ciclistas

@router.get("/con-posicion")
async def listar_ciclistas_con_posicion():
    ciclistas_con_posicion = await models.obtener_todos_ciclistas_con_ultima_posicion()
    # Filtramos solo los que tengan lat/lng
    ciclistas_validos = [c for c in ciclistas_con_posicion if c.get("lat") and c.get("lng")]
    return {"ciclistas": ciclistas_validos}