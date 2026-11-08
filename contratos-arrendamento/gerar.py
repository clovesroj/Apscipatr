"""Gera o painel de Contratos de Arrendamento a partir da planilha do CHB.

Uso:
  python3 gerar.py                     -> index.html sem dados (a pessoa importa a planilha na tela)
  python3 gerar.py planilha.xlsx saida.html   -> pagina com os contratos embutidos

A planilha de entrada e a "Relacao de Contratos" (aba Sheet1) com as colunas:
Contrato, Propriedade, Fundo Agricola, Fornecedor, Parceiro Agricola, Area Contratada Ha,
Area Contratada Alq, Toneladas (Ha/Alq), Data Contrato, Previsao Encerramento, Observacoes.
A versao publicada no repositorio nao leva dados: o repositorio e publico e a lista tem nomes de parceiros.
"""
import json
import pathlib
import re
import sys

AQUI = pathlib.Path(__file__).resolve().parent
COLS = ["Contrato", "Propriedade", "Fundo Agrícola", "Fornecedor", "Parceiro Agrícola",
        "Área Contratada Ha", "Área Contratada Alq", "Toneladas (Ha/Alq)", "Data Contrato",
        "Previsão Encerramento", "Observações"]


def ler(caminho):
    import openpyxl
    ws = openpyxl.load_workbook(caminho, data_only=True).worksheets[0]
    linhas = list(ws.iter_rows(values_only=True))
    cab = [str(c or "").strip() for c in linhas[0]]
    idx = [cab.index(c) for c in COLS]
    saida = []
    for r in linhas[1:]:
        v = [r[i] if i < len(r) else None for i in idx]
        if not v[0]:
            continue  # linha de total (=SUM) ou vazia
        def txt(x):
            return re.sub(r"\s+", " ", str(x)).strip() if x is not None else ""
        def num(x):
            try:
                return round(float(x), 4)
            except (TypeError, ValueError):
                return None
        def dt(x):
            return x.strftime("%Y-%m-%d") if hasattr(x, "strftime") else (txt(x) or None)
        fundo = re.sub(r"^\d+\s*-\s*", "", txt(v[2]))
        saida.append([txt(v[0]), v[1], fundo, v[3], txt(v[4]).title(), num(v[5]), num(v[6]),
                      num(v[7]), dt(v[8]), dt(v[9]), txt(v[10])])
    return saida


def main():
    modelo = (AQUI / "modelo.html").read_text(encoding="utf-8")
    simbolo = (AQUI / "simbolo.svg").read_text(encoding="utf-8").strip()
    if len(sys.argv) >= 3:
        dados = ler(sys.argv[1])
        origem = pathlib.Path(sys.argv[1]).name
        html = (modelo.replace("/*__DADOS__*/[]", json.dumps(dados, ensure_ascii=False, separators=(",", ":")))
                      .replace("__ORIGEM__", origem.replace('"', "")).replace("__SIMBOLO__", simbolo))
        pathlib.Path(sys.argv[2]).write_text(html, encoding="utf-8")
        print(f"{len(dados)} contratos -> {sys.argv[2]}")
    else:
        html = modelo.replace("__ORIGEM__", "").replace("__SIMBOLO__", simbolo)
        pagina = ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
                  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
                  '</head><body>' + html + '</body></html>')
        (AQUI / "index.html").write_text(pagina, encoding="utf-8")
        print("index.html sem dados (importar a planilha na tela)")


if __name__ == "__main__":
    main()
