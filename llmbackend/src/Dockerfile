# Use an official Python runtime as a parent image
FROM python:3.11-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
# This should be in the same directory as your Dockerfile
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the local directory (where the Dockerfile is) contents into the container at /app
# This will include your main.py and the TLS certificate key file
# Ensure X509-cert-8565173483800747719.pem is in the llmbackend/src directory
COPY . .

# Copy the TLS certificate key file into the container
COPY X509-cert-8565173483800747719.pem /app/certs/X509-cert.pem

# Set an environment variable for the TLS certificate key file path
ENV TLS_CERTIFICATE_KEY_FILE=/app/certs/X509-cert.pem

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run main.py when the container launches
# Assumes your FastAPI app instance is named "app" in "main.py"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
