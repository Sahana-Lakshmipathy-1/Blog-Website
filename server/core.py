# core.py
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def db_result(query, values=None):
    """
    Connects to a PostgreSQL database, executes a query, and returns the result.
    It first prints the environment variables used for the connection.
    """
    connection = None
    cursor = None
    try:
        # Print environment variables for debugging
        print("--- .env Variables ---")
        print(f"db_username: {os.getenv('db_username')}")
        print(f"db_password: {os.getenv('db_password')}")
        print(f"db_host: {os.getenv('db_host')}")
        print(f"db_port: {os.getenv('db_port')}")
        print(f"db_database: {os.getenv('db_database')}")
        print("----------------------")

        print("Connecting...")
        
        # Establish connection using keyword arguments
        connection = psycopg2.connect(
            user=os.getenv("db_username"),
            password=os.getenv("db_password"),
            host=os.getenv("db_host"),
            port=os.getenv("db_port"),  
            database=os.getenv("db_database")
        )
        print("Connected")

        # Get a cursor variable
        cursor = connection.cursor()

        print("Executing...")
        
        # Run the actual SQL command
        cursor.execute(query, values)
        
        print("Executed")
        
        # Save changes to the database
        connection.commit()

        # Fetch the result
        result = cursor.fetchone()
        
        return result
    except psycopg2.Error as e:
        print(f"Error connecting to the database or executing query: {e}")
        return None
    finally:
        # Ensure the cursor and connection are closed in all cases
        if cursor:
            cursor.close()
        if connection:
            connection.close()
