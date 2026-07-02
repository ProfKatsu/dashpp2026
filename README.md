# Dashboard Prova Paulista 2026

Dashboard estático com resultados do 1º e 2º bimestres da Prova Paulista 2026 das escolas da Unidade Regional de Ensino de Mogi das Cruzes.

## Como visualizar localmente

Abra o arquivo `index.html` no navegador.

## Como publicar no GitHub e Vercel

1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para o repositório.
3. Acesse o Vercel e escolha `Add New Project`.
4. Importe o repositório do GitHub.
5. Em framework, escolha `Other`.
6. Deixe o diretório raiz apontando para esta pasta.
7. Publique.

## Arquivos

- `index.html`: estrutura da página.
- `styles.css`: aparência do dashboard.
- `app.js`: filtros, cálculos, cards, gráficos e tabela.
- `data.js`: dados normalizados a partir dos arquivos XLSX.

## Observação sobre os dados

Os percentuais dos arquivos originais vieram em escala decimal, como `0.6446`. O dashboard converte esses valores para percentual, como `64,5%`.
