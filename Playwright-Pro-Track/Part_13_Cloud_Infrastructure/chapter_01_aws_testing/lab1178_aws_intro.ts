/**
 * Lab 1178: AWS Testing Infrastructure
 *
 * CONCEPT:
 * AWS provides cloud services for running tests at scale. Understanding AWS
 * services helps QA engineers set up scalable, cost-effective test infrastructure.
 *
 * BULLET POINTS:
 * - EC2: Virtual machines for test execution
 * - S3: Store test artifacts, reports, screenshots
 * - Lambda: Serverless test execution
 * - CodeBuild: CI/CD for test automation
 * - Device Farm: Mobile and browser testing
 *
 * EXAMPLES:
 * - Run Playwright tests on EC2 instances
 * - Store test reports in S3
 * - Trigger tests via Lambda
 */

// Note: Install AWS SDK: npm install @aws-sdk/client-s3 @aws-sdk/client-ec2

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { EC2Client, RunInstancesCommand, DescribeInstancesCommand } from '@aws-sdk/client-ec2';

// ============================================
// 1. S3 for Test Artifacts
// ============================================

class TestArtifactStorage {
  private s3: S3Client;
  private bucket: string;

  constructor(bucket: string, region: string = 'us-east-1') {
    this.s3 = new S3Client({ region });
    this.bucket = bucket;
  }

  // Upload test report
  async uploadReport(testRunId: string, report: Buffer): Promise<string> {
    const key = `reports/${testRunId}/report.html`;

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: report,
      ContentType: 'text/html',
    }));

    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  // Upload screenshot
  async uploadScreenshot(testRunId: string, testName: string, screenshot: Buffer): Promise<string> {
    const key = `screenshots/${testRunId}/${testName}.png`;

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: screenshot,
      ContentType: 'image/png',
    }));

    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  // Upload video recording
  async uploadVideo(testRunId: string, testName: string, video: Buffer): Promise<string> {
    const key = `videos/${testRunId}/${testName}.webm`;

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: video,
      ContentType: 'video/webm',
    }));

    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  // Get artifact URL
  getArtifactUrl(key: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }
}

// ============================================
// 2. EC2 for Test Execution
// ============================================

interface TestRunnerConfig {
  instanceType: string;
  ami: string;
  securityGroup: string;
  keyName: string;
}

class EC2TestRunner {
  private ec2: EC2Client;
  private config: TestRunnerConfig;

  constructor(config: TestRunnerConfig, region: string = 'us-east-1') {
    this.ec2 = new EC2Client({ region });
    this.config = config;
  }

  // Launch test runner instance
  async launchRunner(testCommand: string): Promise<string> {
    const userData = Buffer.from(`#!/bin/bash
      cd /home/ec2-user/tests
      npm install
      ${testCommand}
      aws s3 cp test-results/ s3://test-artifacts/results/ --recursive
      shutdown -h now
    `).toString('base64');

    const response = await this.ec2.send(new RunInstancesCommand({
      ImageId: this.config.ami,
      InstanceType: this.config.instanceType,
      MinCount: 1,
      MaxCount: 1,
      KeyName: this.config.keyName,
      SecurityGroupIds: [this.config.securityGroup],
      UserData: userData,
      TagSpecifications: [{
        ResourceType: 'instance',
        Tags: [{ Key: 'Purpose', Value: 'TestRunner' }],
      }],
    }));

    return response.Instances?.[0]?.InstanceId || '';
  }

  // Check instance status
  async getInstanceStatus(instanceId: string): Promise<string> {
    const response = await this.ec2.send(new DescribeInstancesCommand({
      InstanceIds: [instanceId],
    }));

    return response.Reservations?.[0]?.Instances?.[0]?.State?.Name || 'unknown';
  }
}

// ============================================
// 3. Playwright + AWS Integration
// ============================================

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Custom reporter that uploads to S3
class S3Reporter {
  private storage: TestArtifactStorage;
  private testRunId: string;

  constructor() {
    this.storage = new TestArtifactStorage('my-test-artifacts');
    this.testRunId = `run-${Date.now()}`;
  }

  async onTestEnd(test: { title: string }, result: { status: string }) {
    console.log(`Test: ${test.title} - ${result.status}`);
  }

  async onEnd() {
    // Upload HTML report
    const reportPath = path.join('playwright-report', 'index.html');
    if (fs.existsSync(reportPath)) {
      const report = fs.readFileSync(reportPath);
      const url = await this.storage.uploadReport(this.testRunId, report);
      console.log(`📊 Report uploaded: ${url}`);
    }
  }
}

// Example test with S3 screenshot upload
test('upload screenshot to S3 on failure', async ({ page }, testInfo) => {
  await page.goto('https://example.com');

  // Take screenshot
  const screenshot = await page.screenshot();

  // Upload to S3 if test fails
  if (testInfo.status !== 'passed') {
    const storage = new TestArtifactStorage('my-test-artifacts');
    const url = await storage.uploadScreenshot(
      testInfo.testId,
      testInfo.title,
      screenshot
    );
    console.log(`📸 Screenshot: ${url}`);
  }
});

/**
 * EXERCISE:
 * 1. Set up an S3 bucket for test artifacts
 * 2. Create a custom Playwright reporter for S3
 * 3. Launch EC2 instances for parallel test execution
 * 4. Set up CodeBuild for CI/CD
 * 5. Configure AWS Device Farm for cross-browser testing
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: How do you store test artifacts in AWS?
 * A1: Use S3 for storing reports, screenshots, and videos.
 *     Use appropriate content types and organize by test run ID.
 *
 * Q2: How do you run tests at scale on AWS?
 * A2: Use EC2 for VM-based execution, Lambda for serverless,
 *     or AWS Device Farm for managed browser/device testing.
 */

/**
 * LEARNING:
 * - S3 is ideal for storing test artifacts
 * - EC2 provides scalable test execution
 * - AWS SDK integrates easily with Node.js/TypeScript
 * - Consider costs when designing test infrastructure
 *
 * ONE LINER:
 * "AWS: Scale your test infrastructure to match your ambitions."
 */

export { TestArtifactStorage, EC2TestRunner, S3Reporter };
