# Contratos de Arrendamento · SIGA-MG

Painel de análise da carteira de arrendamentos (Relação de Contratos exportada do CHB), no padrão visual do SIGA-MG.

Telas: Painel executivo, Vencimentos por ano, Análise crítica, Parceiros, Tabela de contratos e Parâmetros.

## Como usar

- `index.html` abre **sem dados**: importe a planilha `.xlsx` em Parâmetros › Atualizar a planilha. Os dados ficam só no navegador.
- Para gerar uma página com os contratos embutidos (uso interno, não publicar no repositório):

  ```bash
  python3 gerar.py "Relação de Contratos - NOV 2026.xlsx" saida.html
  ```

- `python3 gerar.py` sem argumentos refaz o `index.html` a partir do `modelo.html`.

## Regras de cálculo

| Item | Regra |
|---|---|
| Fonte | Só as colunas da planilha, com os nomes originais; nenhum parâmetro de outros módulos do SIGA |
| t/safra | Toneladas (Ha/Alq) × Área Contratada Alq (padrão) ou × Área Contratada Ha (escolha em Parâmetros) |
| t/ha | t/safra ÷ Área Contratada Ha |
| Ha ÷ Alq | medido na própria planilha, linha a linha (4,84 em todas as linhas de NOV/2026) |
| Média ponderada | Σ(Toneladas × área base) ÷ Σ área base; a coluna "Contrib. pond." soma a média |
| Conferência | somas de Área Contratada Ha e Alq comparadas com a linha de total da planilha (=SUM, F354/G354) |
| Preço da tonelada | ATR (kg/t) × preço do kg de ATR (Consecana), ou R$/t informado |
| R$/ha/ano | t/ha × R$/t |
| Safra corrente | abril a março; encerramento em 30/11 paga a safra do ano |
| Faixas | nesta safra · próxima safra · 2–3 safras · 4–6 safras · 7+ safras |
| Mercado de referência | média ponderada dos contratos assinados nos últimos 24 meses (ajustável) |
| Prioridade | 50% urgência + 30% tamanho da área + 20% defasagem frente ao mercado; A ≥ 60, B ≥ 35 |
| Janela de reforma | contrato com menos de 5 safras restantes não recebe reforma sem aditivo |
