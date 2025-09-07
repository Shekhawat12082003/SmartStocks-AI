# Stock Price Prediction App - Makefile
# Cross-platform commands for development

# Default target
.DEFAULT_GOAL := help

# Variables
BACKEND_DIR := backend
FRONTEND_DIR := frontend
VENV_DIR := $(BACKEND_DIR)/.venv

# Help command
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
dev: ## Start both backend and frontend in development mode
	@echo "Starting development environment..."
	@$(MAKE) backend &
	@$(MAKE) frontend

backend: ## Start backend development server
	@echo "Starting backend server..."
	@cd $(BACKEND_DIR) && \
	if not exist .venv (python -m venv .venv) && \
	.venv\Scripts\activate && \
	pip install -r requirements.txt && \
	if not exist .env (copy .env.example .env) && \
	python app.py

frontend: ## Start frontend development server
	@echo "Starting frontend server..."
	@cd $(FRONTEND_DIR) && \
	if not exist node_modules (npm install) && \
	if not exist .env (copy .env.example .env) && \
	npm run dev

# Docker commands
up: ## Start application with Docker Compose
	@echo "Starting application with Docker..."
	@docker-compose up --build

down: ## Stop Docker containers
	@echo "Stopping Docker containers..."
	@docker-compose down

restart: ## Restart Docker containers
	@echo "Restarting Docker containers..."
	@docker-compose restart

logs: ## Show Docker logs
	@docker-compose logs -f

# Setup commands
setup: ## Setup development environment
	@echo "Setting up development environment..."
	@$(MAKE) setup-backend
	@$(MAKE) setup-frontend

setup-backend: ## Setup backend environment
	@echo "Setting up backend..."
	@cd $(BACKEND_DIR) && \
	python -m venv .venv && \
	.venv\Scripts\activate && \
	pip install -r requirements.txt && \
	if not exist .env (copy .env.example .env)

setup-frontend: ## Setup frontend environment
	@echo "Setting up frontend..."
	@cd $(FRONTEND_DIR) && \
	npm install && \
	if not exist .env (copy .env.example .env)

# Clean commands
clean: ## Clean build artifacts and dependencies
	@echo "Cleaning build artifacts..."
	@if exist $(BACKEND_DIR)\.venv rmdir /s /q $(BACKEND_DIR)\.venv
	@if exist $(FRONTEND_DIR)\node_modules rmdir /s /q $(FRONTEND_DIR)\node_modules
	@if exist $(FRONTEND_DIR)\dist rmdir /s /q $(FRONTEND_DIR)\dist
	@if exist models rmdir /s /q models

# Build commands
build: ## Build Docker images
	@echo "Building Docker images..."
	@docker-compose build

build-frontend: ## Build frontend for production
	@echo "Building frontend..."
	@cd $(FRONTEND_DIR) && npm run build

# Test commands
test: ## Run tests
	@echo "Running tests..."
	@$(MAKE) test-backend
	@$(MAKE) test-frontend

test-backend: ## Run backend tests
	@echo "Running backend tests..."
	@cd $(BACKEND_DIR) && \
	.venv\Scripts\activate && \
	python -m pytest

test-frontend: ## Run frontend tests
	@echo "Running frontend tests..."
	@cd $(FRONTEND_DIR) && npm test

# Health check
health: ## Check application health
	@echo "Checking application health..."
	@curl -f http://localhost:5000/health || echo "Backend not responding"
	@curl -f http://localhost:3000 || echo "Frontend not responding"

.PHONY: help dev backend frontend up down restart logs setup setup-backend setup-frontend clean build build-frontend test test-backend test-frontend health
