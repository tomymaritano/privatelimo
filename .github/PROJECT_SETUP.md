# 🚀 Configuración del Proyecto en GitHub

## 1. Crear Repositorio

```bash
# En GitHub, crear nuevo repo: privatelimo
# Luego en local:
git init
git add .
git commit -m "Initial commit: Backend structure with auth system"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/privatelimo.git
git push -u origin main
```

## 2. Configurar GitHub Project

1. Ir a la pestaña "Projects" en el repo
2. Crear nuevo proyecto tipo "Board"
3. Nombrar: "PrivateLimo Development"
4. Crear columnas:
   - 📋 Backlog
   - 🏗 Ready
   - 🚧 In Progress
   - 👀 In Review
   - ✅ Done

## 3. Crear Milestones

En Issues > Milestones, crear:

1. **MVP Launch** (Due: 6 semanas)
   - Descripción: "Funcionalidad mínima para operar"
   
2. **Phase 2: Real-time** (Due: 10 semanas)
   - Descripción: "Features en tiempo real y tracking"
   
3. **Phase 3: Advanced** (Due: 14 semanas)
   - Descripción: "Optimizaciones y features avanzados"
   
4. **Infrastructure** (Ongoing)
   - Descripción: "DevOps, testing, documentación"

## 4. Crear Labels

En Issues > Labels, crear:

### Prioridad
- 🔴 `priority: critical` (#FF0000)
- 🟠 `priority: high` (#FFA500)
- 🟡 `priority: medium` (#FFFF00)
- 🟢 `priority: low` (#00FF00)

### Tipo
- ✨ `type: feature` (#1D76DB)
- 🐛 `type: bug` (#D73A4A)
- 💡 `type: enhancement` (#A2EEEF)
- 📝 `type: docs` (#0075CA)
- 🧪 `type: test` (#795548)

### Área
- 🔧 `backend` (#FBCA04)
- 🎨 `frontend` (#E99695)
- 🏗 `infrastructure` (#C5DEF5)
- 🔐 `security` (#D93F0B)

### Otros
- 👶 `good first issue` (#7057FF)
- 🚫 `blocked` (#000000)
- ❓ `question` (#CC317C)

## 5. Configurar Branch Protection

En Settings > Branches:

1. Agregar regla para `main`:
   - ✅ Require pull request reviews (1)
   - ✅ Dismiss stale pull request approvals
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

## 6. GitHub Actions

Crear `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        
    - name: Install dependencies
      run: |
        cd backend
        npm ci
        
    - name: Run tests
      run: |
        cd backend
        npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
        
    - name: Run linter
      run: |
        cd backend
        npm run lint
```

## 7. Template para Pull Requests

Crear `.github/pull_request_template.md`:

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] 🐛 Bug fix
- [ ] ✨ Nueva feature
- [ ] 💥 Breaking change
- [ ] 📝 Documentación

## Checklist
- [ ] Mi código sigue el estilo del proyecto
- [ ] He hecho self-review de mi código
- [ ] He comentado mi código en áreas complejas
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Los tests nuevos y existentes pasan localmente

## Issues relacionados
Closes #(issue number)

## Screenshots (si aplica)
```

## 8. Configurar Webhooks

Para integrar con herramientas externas:

1. Settings > Webhooks > Add webhook
2. Configurar para:
   - Slack/Discord (notificaciones)
   - CI/CD tools
   - Project management tools

## 9. Crear primer conjunto de Issues

Usar el script para crear issues masivamente:

```bash
# Instalar GitHub CLI
brew install gh  # macOS
# o descargar de https://cli.github.com/

# Autenticarse
gh auth login

# Crear issues desde archivo
# Crear archivo issues.txt con formato:
# title,body,labels,milestone

# Luego ejecutar:
while IFS=',' read -r title body labels milestone; do
  gh issue create --title "$title" --body "$body" --label "$labels" --milestone "$milestone"
done < issues.txt
```

## 10. Configurar Dependabot

Crear `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

## 📋 Checklist de Setup

- [ ] Repositorio creado y pusheado
- [ ] Project board configurado
- [ ] Milestones creados
- [ ] Labels configurados
- [ ] Branch protection activada
- [ ] GitHub Actions configurado
- [ ] Templates creados
- [ ] Primer batch de issues creado
- [ ] README actualizado
- [ ] Equipo invitado al repo