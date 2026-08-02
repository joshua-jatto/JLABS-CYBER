#!/bin/bash

# Script: check-port.sh
# Purpose: Check if a specific port is open on a host
# Version: 2.0
# Usage: 
#   ./check-port.sh                           → checks port 8080 on localhost (default)
#   ./check-port.sh -p 1234                  → checks port 1234 on localhost
#   ./check-port.sh -h 192.168.1.1          → checks port 8080 on 192.168.1.1
#   ./check-port.sh -h example.com -p 80     → checks port 80 on example.com

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# Default values
PORT=8080
HOST="localhost"

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print error messages
error() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
}

# Function to print success messages
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print info messages
info() {
    echo -e "${YELLOW}🔍 $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate port number
validate_port() {
    local port=$1
    # Check if port is a number
    if ! [[ "$port" =~ ^[0-9]+$ ]]; then
        error "Port must be a number: $port"
        return 1
    fi
    # Check if port is in valid range
    if [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
        error "Port must be between 1 and 65535: $port"
        return 1
    fi
    return 0
}

# Function to check if host is localhost
is_localhost() {
    local host=$1
    case "$host" in
        localhost|127.0.0.1|::1|0:0:0:0:0:0:0:1)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Function to check if nc (netcat) supports the -z flag
check_nc_capabilities() {
    # Some versions of nc don't support -z flag (like traditional netcat)
    if echo "" | nc -z -w 1 localhost 1 2>&1 | grep -q "invalid option"; then
        return 1
    fi
    return 0
}

# Check for required commands
if ! command_exists nc; then
    error "netcat (nc) is not installed. Please install it first."
    echo "  Ubuntu/Debian: sudo apt-get install netcat-openbsd"
    echo "  CentOS/RHEL: sudo yum install nmap-ncat"
    echo "  macOS: brew install netcat"
    exit 1
fi

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            if [ -z "${2:-}" ]; then
                error "Please provide a port number after $1"
                echo "Usage: $0 [-h|--host host] [-p|--port port]"
                exit 1
            fi
            if ! validate_port "$2"; then
                exit 1
            fi
            PORT="$2"
            shift 2
            ;;
        -h|--host)
            if [ -z "${2:-}" ]; then
                error "Please provide a hostname or IP after $1"
                echo "Usage: $0 [-h|--host host] [-p|--port port]"
                exit 1
            fi
            HOST="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [-h|--host host] [-p|--port port]"
            echo ""
            echo "Options:"
            echo "  -h, --host HOST    Target host (default: localhost)"
            echo "  -p, --port PORT    Target port (default: 8080)"
            echo "  --help             Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                              # Check port 8080 on localhost"
            echo "  $0 -p 3000                      # Check port 3000 on localhost"
            echo "  $0 -h example.com               # Check port 8080 on example.com"
            echo "  $0 -h 192.168.1.1 -p 22         # Check port 22 on 192.168.1.1"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            echo "Usage: $0 [-h|--host host] [-p|--port port]"
            echo "Try '$0 --help' for more information."
            exit 1
            ;;
    esac
done

# Main logic
info "Target: $HOST:$PORT"
info "Checking connectivity..."

# Handle localhost specially
if is_localhost "$HOST"; then
    info "Detected localhost, performing direct port check..."
    
    # Try different nc syntax variations for maximum compatibility
    if nc -z -w 3 "$HOST" "$PORT" 2>/dev/null; then
        success "Port $PORT on $HOST is open!"
    elif nc -w 3 "$HOST" "$PORT" < /dev/null 2>/dev/null; then
        success "Port $PORT on $HOST is open!"
    elif timeout 3 bash -c "echo >/dev/tcp/$HOST/$PORT" 2>/dev/null; then
        success "Port $PORT on $HOST is open!"
    else
        echo -e "${RED}❌ Port $PORT on $HOST is closed or no service listening.${NC}"
        exit 1
    fi
else
    # For external hosts, check connectivity first
    info "Checking if $HOST is reachable..."
    
    # Try multiple methods to check host reachability
    reachable=false
    
    # Method 1: ping (if allowed)
    if ping -c 1 -W 2 "$HOST" >/dev/null 2>&1; then
        reachable=true
        info "Host $HOST is reachable (ICMP)"
    # Method 2: Try a basic TCP connection to the port directly
    elif timeout 3 bash -c "echo >/dev/tcp/$HOST/$PORT" 2>/dev/null; then
        reachable=true
        info "Host $HOST is reachable (TCP/$PORT)"
    # Method 3: Try nc with timeout
    elif nc -z -w 3 "$HOST" "$PORT" 2>/dev/null; then
        reachable=true
        info "Host $HOST is reachable (netcat)"
    else
        echo -e "${RED}❌ $HOST at IP not reachable${NC}"
        echo "Possible reasons:"
        echo "  - Host is down or doesn't exist"
        echo "  - Firewall blocking ICMP (ping) and TCP connections"
        echo "  - Network connectivity issues"
        exit 1
    fi
    
    # If host is reachable, check the specific port
    if [ "$reachable" = true ]; then
        info "Scanning port $PORT on $HOST..."
        
        # Try multiple methods to check port
        if nc -z -w 3 "$HOST" "$PORT" 2>/dev/null; then
            success "Port $PORT on $HOST is open!"
        elif timeout 3 bash -c "echo >/dev/tcp/$HOST/$PORT" 2>/dev/null; then
            success "Port $PORT on $HOST is open!"
        else
            echo -e "${RED}❌ Port $PORT on $HOST is closed or filtered.${NC}"
            exit 1
        fi
    fi
fi
