/**
 * Lab 614: Video Recording
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Recording test videos:
 * 
 * - Playwright video recording
 * - Video on failure
 * - Video management
 * - Report attachment
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Enable video recording
 * 2. Attach to reports
 * 3. Manage video files
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

let browser: Browser;

// Solution 1: Browser Setup
Before(async function () {
    if (!browser) {
        browser = await chromium.launch({ headless: true });
    }
});

// Solution 2: Context with Video Recording
Before(async function (scenario) {
    const videoDir = 'reports/videos';
    
    if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
    }
    
    // Create context with video recording
    this.context = await browser.newContext({
        recordVideo: {
            dir: videoDir,
            size: { width: 1280, height: 720 },
        },
    });
    
    this.page = await this.context.newPage();
    this.scenarioName = scenario.pickle.name;
});

// Solution 3: After Hook - Handle Video
After(async function (scenario) {
    if (this.page) {
        // Close page to finalize video
        await this.page.close();
        
        // Get video path
        const video = this.page.video();
        if (video) {
            const videoPath = await video.path();
            
            if (scenario.result?.status === Status.FAILED) {
                // Rename video with scenario name
                const newPath = videoPath.replace(
                    /[^/]+\.webm$/,
                    `${this.scenarioName.replace(/[^a-zA-Z0-9]/g, '_')}_FAILED.webm`
                );
                
                fs.renameSync(videoPath, newPath);
                console.log(`Video saved: ${newPath}`);
                
                // Attach video to report
                const videoBuffer = fs.readFileSync(newPath);
                await this.attach(videoBuffer, 'video/webm');
            } else {
                // Delete video for passed tests (optional)
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                }
            }
        }
    }
    
    if (this.context) {
        await this.context.close();
    }
});

// Solution 4: Conditional Video Recording
Before(async function (scenario) {
    const tags = scenario.pickle.tags.map(t => t.name);
    const shouldRecord = tags.includes('@record-video') || 
                         process.env.RECORD_VIDEO === 'true';
    
    const contextOptions: any = {};
    
    if (shouldRecord) {
        const videoDir = 'reports/videos';
        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }
        
        contextOptions.recordVideo = {
            dir: videoDir,
            size: { width: 1280, height: 720 },
        };
    }
    
    this.context = await browser.newContext(contextOptions);
    this.page = await this.context.newPage();
    this.recordingEnabled = shouldRecord;
});

// Solution 5: Video Manager Class
class VideoManager {
    private videoDir: string;
    private retainOnPass: boolean;
    
    constructor(options: { videoDir?: string; retainOnPass?: boolean } = {}) {
        this.videoDir = options.videoDir || 'reports/videos';
        this.retainOnPass = options.retainOnPass || false;
        
        if (!fs.existsSync(this.videoDir)) {
            fs.mkdirSync(this.videoDir, { recursive: true });
        }
    }
    
    async createContext(browser: Browser): Promise<BrowserContext> {
        return browser.newContext({
            recordVideo: {
                dir: this.videoDir,
                size: { width: 1280, height: 720 },
            },
        });
    }
    
    async handleVideo(
        page: any,
        scenarioName: string,
        status: string
    ): Promise<string | null> {
        await page.close();
        
        const video = page.video();
        if (!video) return null;
        
        const originalPath = await video.path();
        const sanitizedName = scenarioName.replace(/[^a-zA-Z0-9]/g, '_');
        const statusSuffix = status === 'FAILED' ? '_FAILED' : '';
        const newPath = path.join(
            this.videoDir,
            `${sanitizedName}${statusSuffix}.webm`
        );
        
        if (status === 'FAILED' || this.retainOnPass) {
            fs.renameSync(originalPath, newPath);
            return newPath;
        } else {
            if (fs.existsSync(originalPath)) {
                fs.unlinkSync(originalPath);
            }
            return null;
        }
    }
    
    cleanup(maxAgeDays: number = 7): void {
        const files = fs.readdirSync(this.videoDir);
        const now = Date.now();
        const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
        
        for (const file of files) {
            const filepath = path.join(this.videoDir, file);
            const stats = fs.statSync(filepath);
            
            if (now - stats.mtimeMs > maxAge) {
                fs.unlinkSync(filepath);
                console.log(`Deleted old video: ${file}`);
            }
        }
    }
}

// Solution 6: Video Recording Configuration
interface VideoConfig {
    enabled: boolean;
    dir: string;
    size: { width: number; height: number };
    retainOnPass: boolean;
    maxAgeDays: number;
}

function getVideoConfig(): VideoConfig {
    return {
        enabled: process.env.RECORD_VIDEO === 'true',
        dir: process.env.VIDEO_DIR || 'reports/videos',
        size: {
            width: parseInt(process.env.VIDEO_WIDTH || '1280'),
            height: parseInt(process.env.VIDEO_HEIGHT || '720'),
        },
        retainOnPass: process.env.RETAIN_VIDEO_ON_PASS === 'true',
        maxAgeDays: parseInt(process.env.VIDEO_MAX_AGE_DAYS || '7'),
    };
}

// Solution 7: Export
export { VideoManager, getVideoConfig, VideoConfig };

