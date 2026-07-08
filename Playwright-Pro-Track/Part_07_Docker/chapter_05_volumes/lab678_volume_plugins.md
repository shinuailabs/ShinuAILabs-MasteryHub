# Lab 678: Volume Plugins

## LEARNING CONCEPT

Using volume plugins for advanced storage options.

### Plugin Types:
- Local storage
- Network storage (NFS, CIFS)
- Cloud storage (AWS, Azure, GCP)
- Distributed storage

## EXERCISE

1. Install volume plugins
2. Use different drivers
3. Configure storage options

## SOLUTION

### List Volume Plugins

```bash
# List installed plugins
docker plugin ls

# Search for plugins
docker search volume
```

### Local Driver Options

```bash
# Create volume with local driver options
docker volume create \
    --driver local \
    --opt type=none \
    --opt device=/path/to/dir \
    --opt o=bind \
    my-volume
```

### NFS Volume

```bash
# Create NFS volume
docker volume create \
    --driver local \
    --opt type=nfs \
    --opt o=addr=192.168.1.100,rw \
    --opt device=:/path/to/share \
    nfs-volume

# Use NFS volume
docker run -d \
    -v nfs-volume:/data \
    my-app
```

### CIFS/SMB Volume

```bash
# Create CIFS volume
docker volume create \
    --driver local \
    --opt type=cifs \
    --opt device=//server/share \
    --opt o=addr=server,username=user,password=pass \
    cifs-volume
```

### Install Plugin

```bash
# Install plugin
docker plugin install <plugin-name>

# Install with options
docker plugin install <plugin-name> --grant-all-permissions

# Enable plugin
docker plugin enable <plugin-name>

# Disable plugin
docker plugin disable <plugin-name>

# Remove plugin
docker plugin rm <plugin-name>
```

### AWS EBS Plugin

```bash
# Install REX-Ray plugin for AWS
docker plugin install rexray/ebs

# Create EBS volume
docker volume create \
    --driver rexray/ebs \
    --opt size=10 \
    ebs-volume

# Use volume
docker run -d \
    -v ebs-volume:/data \
    my-app
```

### Azure File Plugin

```bash
# Install Azure File plugin
docker plugin install \
    --grant-all-permissions \
    docker4x/cloudstor:azure

# Create Azure volume
docker volume create \
    --driver cloudstor:azure \
    --opt share=myshare \
    azure-volume
```

### GCP Persistent Disk

```bash
# Install GCE plugin
docker plugin install \
    --grant-all-permissions \
    rexray/gcepd

# Create GCE volume
docker volume create \
    --driver rexray/gcepd \
    --opt size=10 \
    gce-volume
```

### Docker Compose with Plugins

```yaml
version: '3'
services:
  app:
    image: my-app
    volumes:
      - nfs-data:/data

volumes:
  nfs-data:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.1.100,rw
      device: ":/path/to/share"
```

### Plugin Configuration

```bash
# View plugin config
docker plugin inspect <plugin-name>

# Set plugin options
docker plugin set <plugin-name> KEY=VALUE

# Example: Set AWS region
docker plugin set rexray/ebs EBS_REGION=us-east-1
```

### Troubleshooting Plugins

```bash
# Check plugin status
docker plugin ls

# View plugin logs
docker plugin inspect <plugin-name> --format '{{.Settings.Env}}'

# Debug mode
docker plugin set <plugin-name> DEBUG=true
docker plugin disable <plugin-name>
docker plugin enable <plugin-name>
```

### Best Practices

```
✅ Test plugins in non-production first
✅ Monitor plugin health
✅ Keep plugins updated
✅ Document plugin configuration
✅ Have fallback strategy
✅ Consider performance implications
```

