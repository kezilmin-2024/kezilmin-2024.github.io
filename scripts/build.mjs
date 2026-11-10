import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const source = path.resolve(root, "..", "anuin-portfolio");
const dist = path.join(root, "dist");

if (!dist.startsWith(root + path.sep) || path.basename(dist) !== "dist") {
  throw new Error("Refusing to rebuild an unexpected output directory");
}

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(source, "public"), dist, { recursive: true });

const database = JSON.parse(fs.readFileSync(path.join(source, "data", "site.json"), "utf8"));
if (!database.published) throw new Error("No published portfolio snapshot was found");

const payload = { site: database.published, updatedAt: database.updatedAt };
fs.writeFileSync(path.join(dist, "site.json"), JSON.stringify(payload, null, 2) + "\n");

const referencedUploads = [...new Set(
  (JSON.stringify(database.published).match(/\/uploads\/[^"\s]+/g) || [])
)];

for (const publicUrl of referencedUploads) {
  const relative = publicUrl.replace(/^\//, "").split("/").join(path.sep);
  const from = path.join(source, relative);
  const to = path.join(dist, relative);
  if (!fs.existsSync(from)) throw new Error(`Missing published asset: ${publicUrl}`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

const appPath = path.join(dist, "app.js");
let app = fs.readFileSync(appPath, "utf8");
const localLoader = 'async function load(mode="published") { const r=await fetch(`/api/site?mode=${mode}`,{cache:"no-store"});const j=await r.json();site=j.site;savedAt=j.updatedAt; }';
const publicLoader = 'async function load() { const r=await fetch("/site.json",{cache:"no-store"});if(!r.ok)throw new Error("作品集数据加载失败");const j=await r.json();site=j.site;savedAt=j.updatedAt; }';
if (!app.includes(localLoader)) throw new Error("Could not locate the local data loader");
app = app.replace(localLoader, publicLoader);
app = app.replace('<a class="admin-link" href="#/admin">编辑后台 <b>↗</b></a>', '');
app = app.replace('if(route==="admin"){app.innerHTML=admin();mountPersonalExtras();return;}', 'if(route==="admin"){location.hash="#/";return;}');
app = app.replaceAll('LOCAL 01', 'PUBLIC PORTFOLIO');
fs.writeFileSync(appPath, app);

const indexPath = path.join(dist, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
index = index.replace('<meta name="description" content="anuin 工程作品集">', '<meta name="description" content="蓝宇新的机械设计与机器人结构作品集，涵盖机器人竞赛、整车设计、机构建模与实时 3D 模型展示。"><meta name="robots" content="index,follow"><meta property="og:type" content="website"><meta property="og:title" content="蓝宇新 · 机械设计与机器人结构作品集"><meta property="og:description" content="机器人竞赛、机械结构设计、三维建模与装配作品集。">');
index = index.replace('<title>anuin · 工程作品集</title>', '<title>蓝宇新 · 机械设计与机器人结构作品集</title>');
fs.writeFileSync(indexPath, index);

const total = referencedUploads.reduce((sum, publicUrl) => {
  const relative = publicUrl.replace(/^\//, "").split("/").join(path.sep);
  return sum + fs.statSync(path.join(dist, relative)).size;
}, 0);
console.log(`Built public portfolio with ${referencedUploads.length} published assets (${(total / 1024 / 1024).toFixed(1)} MB).`);
