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
  ["config.php", "config.php"],
  ["config.example.php", "config.example.php"],
  ["database.sql", "database.sql"],
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

// .htaccess do dist = deploy "plano" (conteúdo do dist = public_html)
writeFileSync(
  join(dist, ".htaccess"),
  `# Deploy plano (public_html = conteúdo de dist/)
<FilesMatch "^(config\\.php|config\\.example\\.php|database\\.sql)$">
  Require all denied
</FilesMatch>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^admin/ - [L]
  RewriteRule \\.(js|css|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|json)$ - [L]
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>
`,
);
console.log("OK: .htaccess (plano)");


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
