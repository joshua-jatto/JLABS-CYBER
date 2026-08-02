# check-port.sh

A simple script to check if a specific port is open on a host.  
**Platform:** Linux only  (bash)
**version:** Beta/trial

## 🔍 Purpose  
Detects whether a specified port is open on a given host (local or remote) using `nc` (netcat).  

## 🚀 Usage
🚀 How to Run
chmod +x check-port.sh

```bash
# Check port 8080 on localhost (default)
./check-port.sh

# Check port 1234 on localhost
./check-port.sh -p 1234

# Check port 8080 on 192.168.1.1 (external host)
./check-port-2.sh -h 192.168.1.1

# Check port 80 on example.com (external domain)
./check-port.sh -h example.com -p 80
⚙️ Behavior
Exits immediately on error, undefined variables, or pipe failures
Uses nc to perform the port check
Works only on Linux systems
📝 Requirements
Linux OS
nc (netcat) installed (sudo apt install netcat or similar)
🔐 Security Note
Does not execute commands or access files
No data is stored or transmitted beyond the host being checked

📌 Limitations
Not compatible with macOS or Windows
Does not support DNS resolution or SSL/TLS
