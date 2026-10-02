import { cpSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

if (!existsSync(dist)) {
  console.error("Pasta dist/ não encontrada. Rode: npm run build");
  process.exit(1);
}

const copies = [
  ["admin", "admin"],
  ["includes", "includes"],
  ["config.example.php", "config.example.php"],
  ["database.sql", "database.sql"],
  [".htaccess", ".htaccess"],
  ["HOSTINGER.md", "HOSTINGER.md"],
];

for (const [from, to] of copies) {
  const src = join(root, from);
  const dest = join(dist, to);
  if (!existsSync(src)) {
    console.warn("Pulando (não existe):", from);
    continue;
  }
  cpSync(src, dest, { recursive: true });
  console.log("OK:", to);
}

// Lembrete de config dentro do dist
writeFileSync(
  join(dist, "LEIA-ME-HOSTINGER.txt"),
  [
    "1. Copie config.example.php para config.php e preencha o MySQL.",
    "2. Importe database.sql no phpMyAdmin.",
    "3. Envie TODO o conteúdo desta pasta (dist) para public_html.",
    "4. Acesse /admin/setup.php uma vez e depois APAGUE o setup.php.",
    "5. Painel: https://sthevandev.com.br/admin/",
    "",
  ].join("\n"),
);

console.log("\nPronto! Envie o conteúdo de dist/ para public_html na Hostinger.");
