# Lab 686: Macvlan Networks

## LEARNING CONCEPT

Using macvlan for direct network access.

### Macvlan Features:
- Containers get real IP on network
- Direct layer 2 access
- No NAT or port mapping
- Appears as physical device

## EXERCISE

1. Create macvlan network
2. Assign real IPs to containers
3. Understand limitations

## SOLUTION

### Create Macvlan Network

```bash
# Create macvlan network
docker network create \
    --driver macvlan \
    --subnet=192.168.1.0/24 \
    --gateway=192.168.1.1 \
    -o parent=eth0 \
    my-macvlan

# Container gets IP from subnet
docker run -d \
    --name web \
    --network my-macvlan \
    --ip 192.168.1.100 \
    nginx
```

### Macvlan Modes

```bash
# Bridge mode (default)
docker network create \
    --driver macvlan \
    --subnet=192.168.1.0/24 \
    --gateway=192.168.1.1 \
    -o parent=eth0 \
    -o macvlan_mode=bridge \
    macvlan-bridge

# 802.1q trunk mode (VLAN)
docker network create \
    --driver macvlan \
    --subnet=192.168.1.0/24 \
    --gateway=192.168.1.1 \
    -o parent=eth0.10 \
    macvlan-vlan10
```

### VLAN Configuration

```bash
# Create VLAN interface first
sudo ip link add link eth0 name eth0.10 type vlan id 10
sudo ip link set eth0.10 up

# Create macvlan on VLAN
docker network create \
    --driver macvlan \
    --subnet=10.10.10.0/24 \
    --gateway=10.10.10.1 \
    -o parent=eth0.10 \
    vlan10-network
```

### Multiple Subnets

```bash
# Create with multiple subnets
docker network create \
    --driver macvlan \
    --subnet=192.168.1.0/24 \
    --gateway=192.168.1.1 \
    --subnet=192.168.2.0/24 \
    --gateway=192.168.2.1 \
    -o parent=eth0 \
    multi-subnet-macvlan
```

### Run Container with Macvlan

```bash
# Specific IP
docker run -d \
    --name web \
    --network my-macvlan \
    --ip 192.168.1.100 \
    nginx

# DHCP (if available)
docker run -d \
    --name web \
    --network my-macvlan \
    nginx
```

### Host Communication

```bash
# By default, host cannot communicate with macvlan containers
# Create macvlan interface on host

sudo ip link add macvlan0 link eth0 type macvlan mode bridge
sudo ip addr add 192.168.1.200/24 dev macvlan0
sudo ip link set macvlan0 up

# Now host can communicate with containers
```

### Docker Compose Macvlan

```yaml
version: '3.8'
services:
  web:
    image: nginx
    networks:
      macvlan-net:
        ipv4_address: 192.168.1.100

networks:
  macvlan-net:
    driver: macvlan
    driver_opts:
      parent: eth0
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1
```

### Use Cases

```
✅ Legacy applications requiring specific IPs
✅ Applications that need to appear on network
✅ Network monitoring tools
✅ DHCP servers
✅ Applications with multicast requirements
```

### Limitations

```
❌ Host cannot communicate with containers directly
❌ Requires promiscuous mode on some platforms
❌ Not supported on Docker Desktop (macOS/Windows)
❌ IP management is manual
❌ No built-in DNS like bridge networks
```

### Best Practices

```
✅ Plan IP allocation carefully
✅ Document network configuration
✅ Test host communication
✅ Use for specific use cases only
✅ Consider ipvlan as alternative
```

