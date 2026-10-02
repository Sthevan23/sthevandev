# Deploy na Hostinger — sthevandev.com.br

O painel de clientes roda em **PHP + MySQL**. O portfólio continua sendo o site estático (build do Vite). Na Hostinger **não precisa de Node**.

## 1. Criar o banco (hPanel)

1. Entre no **hPanel** da Hostinger
2. **Bancos de Dados MySQL** → Criar banco + usuário + senha
3. Anote: nome do banco, usuário, senha e host (`localhost`)
4. Abra o **phpMyAdmin** → selecione o banco → **Importar** → envie o arquivo `database.sql`

## 2. Configurar o PHP

1. Copie `config.example.php` para `config.php`
2. Preencha com os dados do MySQL:

```php
return [
    'db_host' => 'localhost',
    'db_name' => 'uXXXXX_sthevan',
    'db_user' => 'uXXXXX_admin',
    'db_pass' => 'sua_senha',
    'db_charset' => 'utf8mb4',
    'site_url' => 'https://sthevandev.com.br',
];
```

## 3. Gerar o site e subir

No PC:

```bash
npm run build
npm run deploy:hostinger
```

Isso gera a pasta `dist/` pronta. No **Gerenciador de Arquivos** da Hostinger, envie o **conteúdo** de `dist/` para `public_html/`.

Arquivos importantes que sobem juntos:

- `index.html` + `assets/` + `projects/` → portfólio
- `admin/` → painel PHP
- `includes/` → conexão e login
- `config.php` → suas credenciais (não deixe o example no ar se puder)
- `.htaccess` → protege config e rotas

## 4. Criar o usuário admin

1. Acesse: `https://sthevandev.com.br/admin/setup.php`
2. Defina usuário e senha (padrão sugerido: `admin` / `sthevan2026`)
3. **Apague** o arquivo `admin/setup.php` depois

## 5. Usar o painel

- URL: `https://sthevandev.com.br/admin/`
- Cadastre clientes, site, URL e **valor mensal**
- O painel mostra receita mensal e projeção anual

## Segurança

- Nunca deixe `setup.php` no ar depois do primeiro uso
- `config.php` e `database.sql` ficam bloqueados pelo `.htaccess`
- Troque a senha do admin após o primeiro login
