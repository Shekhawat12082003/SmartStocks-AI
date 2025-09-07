import pytest
import sys
import os

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    """Test the health endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'ok'

def test_predict_endpoint_missing_ticker(client):
    """Test predict endpoint with missing ticker"""
    response = client.post('/predict', json={})
    assert response.status_code == 400

def test_predict_endpoint_invalid_json(client):
    """Test predict endpoint with invalid JSON"""
    response = client.post('/predict', data="invalid json")
    assert response.status_code == 400
