from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "ciclismo"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

async def test_connection():
    try:
        await db.command("ping")
        print("Conectado a MongoDB Atlas con Motor!")
    except Exception as e:
        print("Error:", e)

#Colecciones:
ciclistas = db["ciclistas"]
telemetria = db["telemetria"]
competencias = db["competencias"]
alertas = db["alertas"]
resumenes = db["resumenes"]
