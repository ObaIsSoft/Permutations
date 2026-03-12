import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
/**
 * Python Scrapy-based CSS extractor
 * Falls back to native fetch if Python/Scrapy not available
 */
export class ScrapyExtractor {
    scrapyAvailable = null;
    async isAvailable() {
        if (this.scrapyAvailable !== null)
            return this.scrapyAvailable;
        try {
            await this.execCommand("python3", ["-c", "import scrapy"])
                .then(() => true)
                .catch(() => this.execCommand("python", ["-c", "import scrapy"]));
            this.scrapyAvailable = true;
        }
        catch {
            this.scrapyAvailable = false;
        }
        return this.scrapyAvailable;
    }
    async extract(url) {
        const available = await this.isAvailable();
        if (!available) {
            throw new Error("Scrapy not available. Install: pip install scrapy");
        }
        const spiderCode = `
import sys
import json
import scrapy
from scrapy.crawler import CrawlerProcess

class CSSSpider(scrapy.Spider):
    name = 'css_spider'
    start_urls = ['${url}']
    
    custom_settings = {
        'LOG_ENABLED': False,
        'DOWNLOAD_DELAY': 0.5,
        'ROBOTSTXT_OBEY': True,
    }
    
    def parse(self, response):
        css_parts = []
        
        # Extract inline styles
        for style in response.css('style::text').getall():
            css_parts.append(style)
        
        # Extract linked stylesheets
        for link in response.css('link[rel="stylesheet"]::attr(href)').getall():
            absolute_url = response.urljoin(link)
            # Note: Would need additional request to fetch external CSS
            css_parts.append(f"/* External: {absolute_url} */")
        
        # Extract inline element styles
        for elem in response.css('[style]'):
            style_attr = elem.attrib.get('style', '')
            tag = elem.root.tag
            css_parts.append(f"{tag}[style] {{ {style_attr} }}")
        
        result = {
            'url': response.url,
            'css': '\\n'.join(css_parts),
            'html': response.text[:50000],  # Limit HTML size
            'status': response.status,
        }
        
        with open('${this.getTempFile()}', 'w') as f:
            json.dump(result, f)

process = CrawlerProcess()
process.crawl(CSSSpider)
process.start()
`;
        const tempFile = this.getTempFile();
        const tempScript = join(tmpdir(), `scrapy_spider_${Date.now()}.py`);
        try {
            await writeFile(tempScript, spiderCode);
            // Run Scrapy spider
            await this.execCommand("python3", [tempScript], { timeout: 30000 })
                .catch(() => this.execCommand("python", [tempScript], { timeout: 30000 }));
            // Read result
            const resultText = await import("fs/promises").then(fs => fs.readFile(tempFile, "utf-8"));
            const result = JSON.parse(resultText);
            // Cleanup
            await unlink(tempFile).catch(() => { });
            await unlink(tempScript).catch(() => { });
            return result;
        }
        catch (error) {
            // Cleanup on error
            await unlink(tempFile).catch(() => { });
            await unlink(tempScript).catch(() => { });
            throw error;
        }
    }
    getTempFile() {
        return join(tmpdir(), `scrapy_result_${Date.now()}_${Math.random().toString(36).slice(2)}.json`);
    }
    execCommand(cmd, args, options) {
        return new Promise((resolve, reject) => {
            const proc = spawn(cmd, args, {
                cwd: tmpdir(),
                timeout: options?.timeout
            });
            let stderr = "";
            proc.stderr?.on("data", (data) => { stderr += data; });
            proc.on("close", (code) => {
                if (code === 0)
                    resolve();
                else
                    reject(new Error(`Exit ${code}: ${stderr}`));
            });
            proc.on("error", reject);
        });
    }
}
export const scrapyExtractor = new ScrapyExtractor();
