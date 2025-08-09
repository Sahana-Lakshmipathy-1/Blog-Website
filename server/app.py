import uvicorn
from fastapi import FastAPI
from core import db_result

# Initialize the FastAPI application
app = FastAPI()

# A simple query to get the PostgreSQL version
test_query = "SELECT version();"

@app.get("/")
def root():
    """
    This endpoint calls the db_result function to execute a query
    and returns the result, with a basic error handling for
    database connection issues.
    """
    try:
        # Call the db_result function with the test query
        # We pass None for the values since the query has no parameters
        result = db_result(test_query, values=None)
        
        # Check if a result was successfully returned
        if result:
            return {"result": result}
        else:
            # Return an error message if the query failed
            return {"error": "Could not connect to the database or execute the query."}
    except Exception as e:
        # Catch any other unexpected exceptions and return them
        return {"error": f"An unexpected error occurred: {e}"}

if __name__ == "__main__":
    # This block allows the application to be run directly with uvicorn.
    uvicorn.run("app:app", port=8000, reload=True)