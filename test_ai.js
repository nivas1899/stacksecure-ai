import aiService from './server/aiService.js';

async function run() {
  const html = `<html><head><script src='https://www.clarity.ms/tag/...'></script><link rel="stylesheet" href="_next/static/css/a.css"></head><body id="ng-app">Hello</body></html>`;
  const headers = JSON.stringify({ "server": "cloudflare", "x-powered-by": "ASP.NET" });
  
  const results = await aiService.detectTechnologiesFromSource(html, headers);
  console.log("AI Results:", results);
}
run();
