# Lab 886: Release Assets

## LEARNING CONCEPT

Uploading assets to GitHub Releases.

## EXERCISE

1. Create releases with assets
2. Upload multiple files
3. Automate release process

## SOLUTION

### Basic Release

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      
      - uses: softprops/action-gh-release@v1
        with:
          files: dist/*
```

### Multiple Assets

```yaml
- uses: softprops/action-gh-release@v1
  with:
    files: |
      dist/*.zip
      dist/*.tar.gz
      dist/checksums.txt
```

### Cross-Platform Binaries

```yaml
jobs:
  build:
    strategy:
      matrix:
        include:
          - os: ubuntu-latest
            artifact: linux-x64
          - os: windows-latest
            artifact: windows-x64
          - os: macos-latest
            artifact: macos-x64
            
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.artifact }}
          path: dist/
          
  release:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/download-artifact@v4
        with:
          path: artifacts/
          
      - name: Create archives
        run: |
          cd artifacts
          for dir in */; do
            name="${dir%/}"
            zip -r "../${name}.zip" "$dir"
          done
          
      - uses: softprops/action-gh-release@v1
        with:
          files: "*.zip"
```

### Release with Changelog

```yaml
- uses: softprops/action-gh-release@v1
  with:
    files: dist/*
    body_path: CHANGELOG.md
    generate_release_notes: true
```

### Draft Release

```yaml
- uses: softprops/action-gh-release@v1
  with:
    files: dist/*
    draft: true
    prerelease: ${{ contains(github.ref, '-beta') }}
```

### Custom Release Name

```yaml
- uses: softprops/action-gh-release@v1
  with:
    files: dist/*
    name: Release ${{ github.ref_name }}
    tag_name: ${{ github.ref_name }}
```

### Checksums

```yaml
- name: Create checksums
  run: |
    cd dist
    sha256sum * > checksums.txt
    
- uses: softprops/action-gh-release@v1
  with:
    files: |
      dist/*
      dist/checksums.txt
```

### Using GitHub CLI

```yaml
- name: Create release
  run: |
    gh release create ${{ github.ref_name }} \
      --title "Release ${{ github.ref_name }}" \
      --generate-notes \
      dist/*
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Upload to Existing Release

```yaml
- name: Upload to release
  run: |
    gh release upload ${{ github.ref_name }} dist/* --clobber
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### NPM Package Release

```yaml
- name: Publish to npm
  run: npm publish
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
    
- uses: softprops/action-gh-release@v1
  with:
    files: |
      *.tgz
    body: |
      ## Installation
      ```
      npm install package@${{ github.ref_name }}
      ```
```

### Docker Image Release

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: |
      ghcr.io/${{ github.repository }}:${{ github.ref_name }}
      ghcr.io/${{ github.repository }}:latest
      
- uses: softprops/action-gh-release@v1
  with:
    body: |
      ## Docker
      ```
      docker pull ghcr.io/${{ github.repository }}:${{ github.ref_name }}
      ```
```

### Complete Example

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: build-${{ matrix.os }}
          path: dist/
          
  release:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/download-artifact@v4
        with:
          path: builds/
          
      - name: Package
        run: |
          cd builds
          for dir in */; do
            name="${dir%/}"
            tar -czvf "../${name}.tar.gz" -C "$dir" .
          done
          cd ..
          sha256sum *.tar.gz > checksums.txt
          
      - uses: softprops/action-gh-release@v1
        with:
          files: |
            *.tar.gz
            checksums.txt
          generate_release_notes: true
```

### Best Practices

```
✅ Include checksums
✅ Support multiple platforms
✅ Generate release notes
✅ Use semantic versioning
✅ Include installation instructions
```

