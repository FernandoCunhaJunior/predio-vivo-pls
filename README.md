# Prédio Vivo

Protótipo navegável de uma ferramenta para órgãos públicos **montarem e acompanharem o próprio Plano de Logística Sustentável (PLS)**.

A ideia: cada órgão é um prédio, e cada janela acesa é uma ação do PLS. Água, energia e resíduos são as três redes que correm pelo prédio.

Feito para validação interna do grupo de pesquisa *Ministério Público da União Verde: liderando a transformação da gestão sustentável* (ESMPU, Edital nº 162/2024).

## O que dá para testar

| Tela | O que faz |
| --- | --- |
| Abertura | Apresenta a ideia e a rua com os órgãos de referência |
| Montar | Três perguntas (água, energia, resíduos); cada resposta acende janelas |
| Prédio | Corte do prédio com as ações do plano; clique numa janela para ver e mudar a situação |
| Plano | As mesmas ações em lista, com responsável e situação editáveis; imprime e exporta JSON |
| Lançar | Lançamento mensal com cálculo de consumo por pessoa e desvio de aterro |
| A rua | O que outros órgãos fazem e o seu ainda não; "Acender no meu prédio" inclui no plano |

## O que é real e o que é ilustrativo

**Real (da pesquisa):**
- os 17 tipos de ação padronizados e o número de registros de cada um em 13 órgãos de referência;
- as 10 ações e os responsáveis do PLS 2026–2028 da ESMPU, carregados como exemplo;
- o consumo de 2025 da ESMPU (energia, água e resíduos).

**Ilustrativo:**
- a situação de cada ação (feita, em andamento, atrasada);
- a altura dos prédios e quais acendem em "A rua" (sorteio fixo, não é a base real);
- qualquer lançamento mensal que você digitar.

## Como funciona

HTML, CSS e JavaScript puros, sem servidor, sem cadastro e sem dependências. Tudo o que você altera fica **só no seu navegador** (localStorage); nada é enviado. Para voltar ao início, use "Recarregar o exemplo da ESMPU" na tela Plano.

```
index.html
style.css    
data.js      catálogo, plano de exemplo e consumo de 2025
app.js       telas e interações
```

Para rodar localmente, basta abrir `index.html`.

## Ainda não tem

Login, dados por órgão em banco, base real por órgão na rua, relatório anual, metas com marcos por ano e perfis por setor. São os próximos passos se o conceito for aprovado.
