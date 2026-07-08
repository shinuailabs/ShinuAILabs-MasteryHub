/**
 * Lab 481: Drag and Drop Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing drag and drop in POM:
 * 
 * - dragTo method
 * - Manual drag and drop
 * - Sortable lists
 * - File drop
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement drag and drop
 * 2. Handle sortable elements
 * 3. Work with drop zones
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Drag and Drop
class BasicDragDropPage {
    readonly page: Page;
    readonly draggable: Locator;
    readonly dropzone: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.draggable = page.locator('#draggable');
        this.dropzone = page.locator('#dropzone');
    }
    
    async dragToDropzone() {
        await this.draggable.dragTo(this.dropzone);
    }
}

// Solution 2: Multiple Draggables
class MultipleDraggablesPage {
    readonly page: Page;
    readonly draggables: Locator;
    readonly dropzone: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.draggables = page.locator('.draggable');
        this.dropzone = page.locator('.dropzone');
    }
    
    async dragItemToDropzone(index: number) {
        await this.draggables.nth(index).dragTo(this.dropzone);
    }
    
    async dragAllToDropzone() {
        const count = await this.draggables.count();
        for (let i = 0; i < count; i++) {
            await this.draggables.nth(i).dragTo(this.dropzone);
        }
    }
}

// Solution 3: Sortable List
class SortableListPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.sortable-item');
    }
    
    async moveItem(fromIndex: number, toIndex: number) {
        const source = this.items.nth(fromIndex);
        const target = this.items.nth(toIndex);
        await source.dragTo(target);
    }
    
    async getItemOrder() {
        return await this.items.allTextContents();
    }
}

// Solution 4: Manual Drag and Drop
class ManualDragDropPage {
    readonly page: Page;
    readonly source: Locator;
    readonly target: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.source = page.locator('#source');
        this.target = page.locator('#target');
    }
    
    async manualDragAndDrop() {
        const sourceBox = await this.source.boundingBox();
        const targetBox = await this.target.boundingBox();
        
        if (sourceBox && targetBox) {
            await this.page.mouse.move(
                sourceBox.x + sourceBox.width / 2,
                sourceBox.y + sourceBox.height / 2
            );
            await this.page.mouse.down();
            await this.page.mouse.move(
                targetBox.x + targetBox.width / 2,
                targetBox.y + targetBox.height / 2
            );
            await this.page.mouse.up();
        }
    }
}

// Solution 5: Drag with Offset
class DragOffsetPage {
    readonly page: Page;
    readonly draggable: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.draggable = page.locator('.draggable');
    }
    
    async dragByOffset(x: number, y: number) {
        const box = await this.draggable.boundingBox();
        if (box) {
            await this.page.mouse.move(
                box.x + box.width / 2,
                box.y + box.height / 2
            );
            await this.page.mouse.down();
            await this.page.mouse.move(
                box.x + box.width / 2 + x,
                box.y + box.height / 2 + y
            );
            await this.page.mouse.up();
        }
    }
}

// Solution 6: Kanban Board
class KanbanBoardPage {
    readonly page: Page;
    readonly todoColumn: Locator;
    readonly inProgressColumn: Locator;
    readonly doneColumn: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.todoColumn = page.locator('#todo');
        this.inProgressColumn = page.locator('#in-progress');
        this.doneColumn = page.locator('#done');
    }
    
    async moveToInProgress(taskName: string) {
        const task = this.todoColumn.locator(`.task:has-text("${taskName}")`);
        await task.dragTo(this.inProgressColumn);
    }
    
    async moveToDone(taskName: string) {
        const task = this.inProgressColumn.locator(`.task:has-text("${taskName}")`);
        await task.dragTo(this.doneColumn);
    }
}

// Solution 7: Slider Drag
class SliderDragPage {
    readonly page: Page;
    readonly slider: Locator;
    readonly sliderHandle: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.slider = page.locator('.slider');
        this.sliderHandle = page.locator('.slider-handle');
    }
    
    async setSliderValue(percentage: number) {
        const sliderBox = await this.slider.boundingBox();
        if (sliderBox) {
            const targetX = sliderBox.x + (sliderBox.width * percentage / 100);
            await this.sliderHandle.dragTo(this.slider, {
                targetPosition: { x: targetX - sliderBox.x, y: sliderBox.height / 2 }
            });
        }
    }
}

// Solution 8: Export
export {
    BasicDragDropPage,
    MultipleDraggablesPage,
    SortableListPage,
    ManualDragDropPage,
    DragOffsetPage,
    KanbanBoardPage,
    SliderDragPage,
};

