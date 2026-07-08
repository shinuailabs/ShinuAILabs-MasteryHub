/**
 * Lab 617: CI/CD Report Integration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Integrating reports with CI/CD:
 * 
 * - JUnit XML format
 * - GitHub Actions
 * - Jenkins integration
 * - Artifact publishing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Generate CI-compatible reports
 * 2. Publish artifacts
 * 3. Configure pipelines
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Cucumber Configuration for CI
const cucumberConfig = {
    default: {
        format: [
            'progress',
            'json:reports/cucumber-report.json',
            'html:reports/cucumber-report.html',
        ],
    },
    ci: {
        format: [
            'progress',
            'json:reports/cucumber-report.json',
            'html:reports/cucumber-report.html',
            // JUnit format for CI systems
            'junit:reports/junit-report.xml',
        ],
        publish: false,
        parallel: 4,
    },
};

// Solution 2: JUnit XML Generator
import * as fs from 'fs';

interface TestCase {
    name: string;
    classname: string;
    time: number;
    status: 'passed' | 'failed' | 'skipped';
    failure?: {
        message: string;
        type: string;
        content: string;
    };
}

function generateJUnitXML(testCases: TestCase[]): string {
    const passed = testCases.filter(t => t.status === 'passed').length;
    const failed = testCases.filter(t => t.status === 'failed').length;
    const skipped = testCases.filter(t => t.status === 'skipped').length;
    const totalTime = testCases.reduce((sum, t) => sum + t.time, 0);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="Cucumber Tests" tests="${testCases.length}" failures="${failed}" skipped="${skipped}" time="${totalTime.toFixed(3)}">
`;
    
    for (const tc of testCases) {
        xml += `  <testcase name="${escapeXml(tc.name)}" classname="${escapeXml(tc.classname)}" time="${tc.time.toFixed(3)}">
`;
        
        if (tc.status === 'failed' && tc.failure) {
            xml += `    <failure message="${escapeXml(tc.failure.message)}" type="${tc.failure.type}">
${escapeXml(tc.failure.content)}
    </failure>
`;
        } else if (tc.status === 'skipped') {
            xml += `    <skipped/>
`;
        }
        
        xml += `  </testcase>
`;
    }
    
    xml += `</testsuite>`;
    return xml;
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Solution 3: GitHub Actions Workflow
const githubActionsWorkflow = `
name: Cucumber Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run Cucumber tests
        run: npm run test:ci
        continue-on-error: true
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: |
            reports/
            allure-results/
      
      - name: Publish Test Report
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Cucumber Tests
          path: reports/junit-report.xml
          reporter: java-junit
`;

// Solution 4: Jenkins Pipeline
const jenkinsPipeline = `
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm run test:ci'
            }
            post {
                always {
                    junit 'reports/junit-report.xml'
                    
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'reports',
                        reportFiles: 'cucumber-report.html',
                        reportName: 'Cucumber Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'reports/**/*', fingerprint: true
        }
    }
}
`;

// Solution 5: Azure DevOps Pipeline
const azurePipeline = `
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npx playwright install --with-deps
    displayName: 'Install Playwright'

  - script: npm run test:ci
    displayName: 'Run tests'
    continueOnError: true

  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'reports/junit-report.xml'
      failTaskOnFailedTests: true
    displayName: 'Publish test results'

  - task: PublishBuildArtifacts@1
    inputs:
      pathToPublish: 'reports'
      artifactName: 'test-reports'
    displayName: 'Publish reports'
`;

// Solution 6: Export
export {
    cucumberConfig,
    generateJUnitXML,
    githubActionsWorkflow,
    jenkinsPipeline,
    azurePipeline,
    TestCase,
};

