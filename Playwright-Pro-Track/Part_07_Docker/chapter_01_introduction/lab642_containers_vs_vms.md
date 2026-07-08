# Lab 642: Containers vs Virtual Machines

## LEARNING CONCEPT

Understanding the differences between containers and VMs.

### Virtual Machines:
- Full OS per VM
- Hardware virtualization
- Hypervisor-based
- Heavier resource usage

### Containers:
- Share host OS kernel
- Process-level isolation
- Lightweight
- Fast startup

## EXERCISE

1. Compare architectures
2. Understand use cases
3. Evaluate trade-offs

## SOLUTION

### Architecture Comparison

```
Virtual Machines:
┌─────────────────────────────────────────────┐
│                 Hardware                     │
├─────────────────────────────────────────────┤
│              Host OS / Hypervisor            │
├──────────────┬──────────────┬───────────────┤
│   Guest OS   │   Guest OS   │   Guest OS    │
├──────────────┼──────────────┼───────────────┤
│   Bins/Libs  │   Bins/Libs  │   Bins/Libs   │
├──────────────┼──────────────┼───────────────┤
│     App A    │     App B    │     App C     │
└──────────────┴──────────────┴───────────────┘

Containers:
┌─────────────────────────────────────────────┐
│                 Hardware                     │
├─────────────────────────────────────────────┤
│                  Host OS                     │
├─────────────────────────────────────────────┤
│              Container Runtime               │
├──────────────┬──────────────┬───────────────┤
│   Bins/Libs  │   Bins/Libs  │   Bins/Libs   │
├──────────────┼──────────────┼───────────────┤
│     App A    │     App B    │     App C     │
└──────────────┴──────────────┴───────────────┘
```

### Comparison Table

| Aspect | Virtual Machines | Containers |
|--------|-----------------|------------|
| Size | GBs | MBs |
| Startup | Minutes | Seconds |
| Performance | Near-native | Native |
| Isolation | Strong (hardware) | Process-level |
| OS | Full OS per VM | Shared kernel |
| Portability | Limited | High |
| Resource Usage | High | Low |
| Density | Low | High |

### When to Use VMs

```
✅ Strong isolation required
✅ Different OS needed
✅ Legacy applications
✅ Security-critical workloads
✅ Full OS features needed
```

### When to Use Containers

```
✅ Microservices architecture
✅ CI/CD pipelines
✅ Development environments
✅ Scalable applications
✅ Cloud-native applications
```

### Practical Demonstration

```bash
# Container startup time
time docker run --rm alpine echo "Hello"
# Typically < 1 second

# Container size
docker images alpine
# REPOSITORY   TAG       SIZE
# alpine       latest    7.34MB

# Running containers resource usage
docker stats --no-stream
```

### Hybrid Approach

```
Many organizations use both:
- VMs for infrastructure isolation
- Containers for application deployment

Example:
┌─────────────────────────────────────────────┐
│              Physical Server                 │
├─────────────────────────────────────────────┤
│                 Hypervisor                   │
├──────────────────────┬──────────────────────┤
│        VM 1          │        VM 2          │
│  ┌────────────────┐  │  ┌────────────────┐  │
│  │   Container 1  │  │  │   Container 3  │  │
│  │   Container 2  │  │  │   Container 4  │  │
│  └────────────────┘  │  └────────────────┘  │
└──────────────────────┴──────────────────────┘
```

