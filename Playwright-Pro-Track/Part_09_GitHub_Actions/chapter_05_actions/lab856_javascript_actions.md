# Lab 856: JavaScript Actions

## LEARNING CONCEPT

Creating JavaScript-based GitHub Actions.

## EXERCISE

1. Set up JavaScript action
2. Use GitHub Actions toolkit
3. Handle inputs and outputs

## SOLUTION

### Action Structure

```
my-action/
├── action.yml
├── package.json
├── src/
│   └── index.js
├── dist/
│   └── index.js
└── README.md
```

### Action Metadata

```yaml
# action.yml
name: 'My JavaScript Action'
description: 'A JavaScript-based action'
author: 'Your Name'

inputs:
  name:
    description: 'Name to greet'
    required: true
    default: 'World'
  token:
    description: 'GitHub token'
    required: false

outputs:
  time:
    description: 'Greeting time'
  greeting:
    description: 'The greeting message'

runs:
  using: 'node20'
  main: 'dist/index.js'
```

### Package.json

```json
{
  "name": "my-action",
  "version": "1.0.0",
  "description": "My GitHub Action",
  "main": "dist/index.js",
  "scripts": {
    "build": "ncc build src/index.js -o dist",
    "test": "jest"
  },
  "dependencies": {
    "@actions/core": "^1.10.0",
    "@actions/github": "^6.0.0",
    "@actions/exec": "^1.1.1",
    "@actions/io": "^1.1.3"
  },
  "devDependencies": {
    "@vercel/ncc": "^0.38.0",
    "jest": "^29.0.0"
  }
}
```

### Basic Action Code

```javascript
// src/index.js
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get inputs
    const name = core.getInput('name', { required: true });
    const token = core.getInput('token');
    
    // Log with different levels
    core.debug(`Name input: ${name}`);
    core.info(`Greeting ${name}`);
    
    // Create greeting
    const greeting = `Hello, ${name}!`;
    const time = new Date().toISOString();
    
    console.log(greeting);
    
    // Set outputs
    core.setOutput('greeting', greeting);
    core.setOutput('time', time);
    
    // Access context
    const { context } = github;
    core.info(`Repository: ${context.repo.owner}/${context.repo.repo}`);
    core.info(`Event: ${context.eventName}`);
    
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();
```

### Using GitHub API

```javascript
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('token', { required: true });
    const octokit = github.getOctokit(token);
    
    const { context } = github;
    
    // Create a comment on an issue
    if (context.eventName === 'issues') {
      await octokit.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: 'Thanks for opening this issue!'
      });
    }
    
    // Get repository info
    const { data: repo } = await octokit.rest.repos.get({
      owner: context.repo.owner,
      repo: context.repo.repo
    });
    
    core.info(`Stars: ${repo.stargazers_count}`);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
```

### Running Commands

```javascript
const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    // Run command
    await exec.exec('npm', ['install']);
    
    // Capture output
    let output = '';
    await exec.exec('npm', ['--version'], {
      listeners: {
        stdout: (data) => {
          output += data.toString();
        }
      }
    });
    
    core.info(`npm version: ${output.trim()}`);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
```

### File Operations

```javascript
const core = require('@actions/core');
const io = require('@actions/io');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    // Create directory
    await io.mkdirP('output');
    
    // Copy file
    await io.cp('src/file.txt', 'output/file.txt');
    
    // Move file
    await io.mv('temp.txt', 'output/temp.txt');
    
    // Read file
    const content = fs.readFileSync('package.json', 'utf8');
    const pkg = JSON.parse(content);
    
    core.setOutput('version', pkg.version);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
```

### Error Handling

```javascript
const core = require('@actions/core');

async function run() {
  try {
    const input = core.getInput('required-input', { required: true });
    
    if (!input) {
      throw new Error('Input cannot be empty');
    }
    
    // Warning
    core.warning('This is a warning');
    
    // Error annotation
    core.error('Error in file', {
      file: 'src/index.js',
      startLine: 10
    });
    
  } catch (error) {
    // Mark action as failed
    core.setFailed(error.message);
  }
}

run();
```

### Building Action

```bash
# Install dependencies
npm install

# Build with ncc
npm run build

# The dist/index.js is committed to the repo
```

### Best Practices

```
✅ Use @actions/core for I/O
✅ Handle errors properly
✅ Build with ncc
✅ Test your action
✅ Document inputs/outputs
```

