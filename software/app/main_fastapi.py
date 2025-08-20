from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import analisis
import models, llm_utils, alert_engine
import uvicorn
from routers import ciclistas, competencias, telemetria, alertas


app = FastAPI(title="Ciclismo LLM Tracking", version="1.0")



# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(ciclistas.router)
app.include_router(competencias.router)
app.include_router(telemetria.router)
app.include_router(alertas.router)
# app.include_router(resumenes.router)
app.include_router(analisis.router)

if __name__ == "__main__":
    uvicorn.run("main_fastapi:app", host="0.0.0.0", port=8000, reload=True)
