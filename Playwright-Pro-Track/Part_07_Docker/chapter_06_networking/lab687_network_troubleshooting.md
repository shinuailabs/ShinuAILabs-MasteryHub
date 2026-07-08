# Lab 687: Network Troubleshooting

## LEARNING CONCEPT

Debugging Docker networking issues.

## EXERCISE

1. Diagnose connectivity issues
2. Debug DNS problems
3. Analyze network traffic

## SOLUTION

### Basic Connectivity Tests

```bash
# Ping another container
docker exec container1 ping container2

# Test port connectivity
docker exec container1 nc -zv container2 80

# Check if port is listening
docker exec container1 netstat -tlnp

# Test HTTP
docker exec container1 curl -v http://container2
```

### DNS Troubleshooting

```bash
# Check DNS resolution
docker exec container1 nslookup service-name

# Check resolv.conf
docker exec container1 cat /etc/resolv.conf

# Check hosts file
docker exec container1 cat /etc/hosts

# Test with specific DNS server
docker exec container1 nslookup service-name 127.0.0.11
```

### Network Inspection

```bash
# Inspect container network settings
docker inspect --format='{{json .NetworkSettings}}' container1 | jq

# Get container IP
docker inspect --format='{{.NetworkSettings.IPAddress}}' container1

# List networks container is connected to
docker inspect --format='{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' container1

# Inspect network
docker network inspect my-network
```

### Debug Container

```bash
# Run debug container on same network
docker run -it --rm \
    --network my-network \
    nicolaka/netshoot \
    bash

# Inside debug container
ping service-name
nslookup service-name
curl http://service-name
traceroute service-name
tcpdump -i eth0
```

### Packet Capture

```bash
# Capture traffic on container interface
docker run -it --rm \
    --net container:target-container \
    nicolaka/netshoot \
    tcpdump -i eth0

# Capture specific traffic
tcpdump -i eth0 port 80
tcpdump -i eth0 host 172.17.0.2
```

### Port Mapping Issues

```bash
# Check port mappings
docker port container-name

# Check if host port is in use
lsof -i :8080
netstat -tlnp | grep 8080

# Check iptables rules
sudo iptables -L -n -t nat | grep DOCKER
```

### Common Issues and Solutions

```bash
# Issue: Container cannot reach internet
# Check: DNS configuration
docker exec container cat /etc/resolv.conf
# Solution: Use --dns flag or check network config

# Issue: Containers cannot communicate
# Check: Same network?
docker network inspect my-network
# Solution: Connect to same network

# Issue: Port not accessible
# Check: Port mapping
docker port container
# Solution: Verify -p flag, check firewall

# Issue: DNS not resolving
# Check: Using custom network?
# Solution: Use custom network (not default bridge)
```

### Network Performance

```bash
# Test bandwidth between containers
docker run -d --name server --network my-network \
    networkstatic/iperf3 -s

docker run -it --rm --network my-network \
    networkstatic/iperf3 -c server

# Check latency
docker exec container1 ping -c 10 container2
```

### Logging and Monitoring

```bash
# View Docker daemon logs
sudo journalctl -u docker

# Enable debug mode
# Add to /etc/docker/daemon.json
{
    "debug": true
}

# View network events
docker events --filter type=network
```

### Troubleshooting Checklist

```
□ Containers on same network?
□ DNS resolving correctly?
□ Port mappings correct?
□ Firewall rules allowing traffic?
□ Service listening on correct port?
□ Network driver appropriate?
□ IP addresses assigned?
□ No IP conflicts?
```

