# aggregator.py
from fastapi import FastAPI
import requests

app = FastAPI(title="MBTQ Ecosystem Docs Layer")

MICROSERVICES = [
    {"name": "DeafAuth", "url": "https://deafauth.mbtq.dev/openapi.json"},
    {"name": "PinkSync", "url": "https://pinksync.mbtq.dev/openapi.json"},
]

@app.get("/docs/aggregate")
async def aggregate_docs():
    aggregated = {}
    for service in MICROSERVICES:
        try:
            resp = requests.get(service["url"])
            aggregated[service["name"]] = resp.json()
        except Exception as e:
            aggregated[service["name"]] = {"error": str(e)}
    return aggregated
