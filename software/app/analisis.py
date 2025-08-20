# app/routers/analisis.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from services.llm.analisis_llm import analizar_comparacion, analizar_prediccion, analizar_resumen, analizar_riesgo

# from services.llm.analisis_llm import (
#     analizar_prediccion,
#     analizar_comparacion,
#     analizar_resumen,
#     analizar_riesgo
# )

router = APIRouter(prefix="/analisis", tags=["Analisis LLM"])

# Modelo de entrada
class AnalisisRequest(BaseModel):
    tipo: str
    params: Dict[str, Any]

# @router.get("/{tipo}")
# async def obtener_analisis(tipo: str):
#     try:
#         if tipo == "prediccion":
#             ciclista_id = "ciclista1"
#             if not ciclista_id:
#                 raise HTTPException(400, "Falta ciclista_id en params")
#             return analizar_prediccion(ciclista_id)

#         elif tipo == "comparacion":
#             c1 = "ciclista1"
#             c2 = "ciclista2"
#             if not c1 or not c2:
#                 raise HTTPException(400, "Faltan c1 y c2 en params")
#             return analizar_comparacion(c1, c2)

#         elif tipo == "resumen":
#             ciclista_id = "ciclista1"
#             if not ciclista_id:
#                 raise HTTPException(400, "Falta ciclista_id en params")
#             return analizar_resumen(ciclista_id)

#         elif tipo == "riesgo":
#             ciclista_id = "ciclista1"
#             if not ciclista_id:
#                 raise HTTPException(400, "Falta ciclista_id en params")
#             return analizar_riesgo(ciclista_id)

#         else:
#             raise HTTPException(400, f"Tipo de análisis '{tipo}' no soportado")

#     except ValueError as e:
#         raise HTTPException(500, f"Error en análisis: {str(e)}")
    
@router.get("/prediccion")
async def obtener_analisis_prediccion():
    try:
        ciclista_id = "ciclista1"
        if not ciclista_id:
            raise HTTPException(400, "Falta ciclista_id en params")
        return analizar_prediccion(ciclista_id)

    except ValueError as e:
        raise HTTPException(500, f"Error en análisis: {str(e)}")
    
@router.get("/comparacion")
async def obtener_analisis():
    try:
        c1 = "ciclista1"
        c2 = "ciclista2"
        if not c1 or not c2:
            raise HTTPException(400, "Faltan c1 y c2 en params")
        return analizar_comparacion(c1, c2)

    except ValueError as e:
        raise HTTPException(500, f"Error en análisis: {str(e)}")
    
@router.get("/resumen")
async def obtener_analisis():
    try:
        ciclista_id = "ciclista1"
        if not ciclista_id:
            raise HTTPException(400, "Falta ciclista_id en params")
        return analizar_resumen(ciclista_id)

    except ValueError as e:
        raise HTTPException(500, f"Error en análisis: {str(e)}")

@router.get("/riesgos")
async def obtener_analisis():
    try:
        ciclista_id = "ciclista1"
        if not ciclista_id:
            raise HTTPException(400, "Falta ciclista_id en params")
        return analizar_riesgo(ciclista_id)


    except ValueError as e:
        raise HTTPException(500, f"Error en análisis: {str(e)}")

@router.post("/")
async def ejecutar_analisis(req: AnalisisRequest):
    try:
        if req.tipo == "prediccion":
            ciclista_id = req.params.get("ciclista_id")
            if not ciclista_id:
                raise HTTPException(400, "Falta ciclista_id en params")
            return analizar_prediccion(ciclista_id)

        elif req.tipo == "comparacion":
            c1 = req.params.get("c1")
            c2 = req.params.get("c2")
            if not c1 or not c2:
                raise HTTPException(400, "Faltan c1 y c2 en params")
            return analizar_comparacion(c1, c2)

        elif req.tipo == "resumen":
            ciclista_id = req.params.get("ciclista_id")
            if not ciclista_id:
                raise HTTPException(400, "Falta ciclista_id en params")
            return analizar_resumen(ciclista_id)

        elif req.tipo == "riesgo":
            ciclista_id = req.params.get("ciclista_id")
            if not ciclista_id:
                raise HTTPException(400, "Falta ciclista_id en params")
            return analizar_riesgo(ciclista_id)

        else:
            raise HTTPException(400, f"Tipo de análisis '{req.tipo}' no soportado")

    except ValueError as e:
        raise HTTPException(500, f"Error en análisis: {str(e)}")
