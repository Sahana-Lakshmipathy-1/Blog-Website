import uvicorn
from fastapi import FastAPI
from core import db_result

app = FastAPI()


test_query = "SELECT version();"

@app.get("/")
def root():
    result = db_result(test_query)
    return {"result" : result}

if __name__ == "__main__":
    uvicorn.run("app:app", port=8080, host = "localhost", reload=True)