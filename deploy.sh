#!/bin/bash

# Al-Qur'an Digital Web App Deployment Script
# This script helps you deploy the Quran web app easily

set -e

echo "🕌 Al-Qur'an Digital Web App Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        echo "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi

    print_success "Docker and Docker Compose are installed"
}

# Check if ports are available
check_ports() {
    local port=3000
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $port is already in use"
        read -p "Do you want to use a different port? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Enter port number: " new_port
            # Update docker-compose.yml with new port
            sed -i "s/3000:3000/$new_port:3000/g" docker-compose.yml
            print_success "Updated port to $new_port"
        fi
    fi
}

# Build and deploy
deploy_app() {
    print_status "Building Docker image..."

    if docker-compose build; then
        print_success "Docker image built successfully"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi

    print_status "Starting containers..."

    if docker-compose up -d; then
        print_success "Containers started successfully"
    else
        print_error "Failed to start containers"
        exit 1
    fi
}

# Show deployment info
show_info() {
    local port=$(grep -o '^[[:space:]]*[0-9]\+:3000' docker-compose.yml | cut -d: -f1)

    echo
    print_success "🎉 Deployment completed successfully!"
    echo
    echo "📖 Al-Qur'an Digital Web App is now running at:"
    echo "   http://localhost:$port"
    echo
    echo "🔧 Management Commands:"
    echo "   View logs:    docker-compose logs -f"
    echo "   Stop app:     docker-compose down"
    echo "   Restart app:  docker-compose restart"
    echo "   Update app:   docker-compose pull && docker-compose up -d"
    echo
    echo "📱 Features:"
    echo "   ✅ Complete Quran with 114 Surahs"
    echo "   ✅ Audio Murottal by 4+ Qaris"
    echo "   ✅ Indonesian & English translations"
    echo "   ✅ Search and Bookmark features"
    echo "   ✅ Dark/Light mode"
    echo "   ✅ Responsive design"
    echo
    print_status "Opening application in browser..."

    # Try to open in default browser
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:$port
    elif command -v open &> /dev/null; then
        open http://localhost:$port
    elif command -v start &> /dev/null; then
        start http://localhost:$port
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment process..."

    check_docker
    check_ports
    deploy_app
    show_info
}

# Handle script interruption
trap 'print_warning "Deployment interrupted"; exit 1' INT

# Run main function
main