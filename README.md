# Dashboard Prova Paulista 2026

Painel da URE Mogi das Cruzes com 1º, 2º e 3º bimestres.

## Atualização do terceiro bimestre

- Provas físicas. Extração em 14/10/2026 às 14:36 (horário de Brasília), informada pelo responsável.
- Fonte: UNIDADE REGIONAL DE ENSINO prova paulista 3 bim prova física.xlsx, aba Export.
- 66 escolas e 34.669 alunos. As escolas foram conciliadas pelo código. Foi removido apenas um espaço excedente em nome de escola para manter a correspondência histórica.
- Linhas de total e filtros não foram tratadas como escolas. Valores ausentes continuam ausentes; percentuais mantêm sua precisão original.
- A visão geral do 3º bimestre usa os indicadores da linha Total da fonte. As médias ponderadas por total de alunos do 1º e 2º bimestres foram preservadas; são métodos diferentes e não permitem inferir evolução individual dos estudantes.
- O modo Comparativo mostra os três bimestres, com variações 1º → 2º e 2º → 3º. Os cartões mostram o 3º, com variação em relação ao 2º.
- A planilha com “3 bimestre” no nome foi excluída conforme orientação do responsável: seu rodapé informa TP_PROVA é DIGITAL, apesar do nome do arquivo. Nenhum dado dessa planilha foi incorporado.

## Publicação no projeto existente

Substitua index.html, data.js e README.md na raiz do repositório ProfKatsu/dashpp2026 pelos arquivos deste pacote. Mantenha a integração atual da Vercel. Não é necessário criar outro projeto ou alterar a configuração de compilação.

Para visualizar localmente, abra index.html. As bibliotecas visuais e de PDF já usadas pelo sistema dependem de conexão à internet.

## Organização

A página utiliza o JavaScript incorporado em index.html e os dados de data.js. app.js e styles.css são arquivos legados, preservados sem alteração, que não são carregados pela página atual.
