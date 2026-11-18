/* Prédio Vivo · dados da pesquisa "MPU Verde" (ESMPU, Edital 162/2024)
   Fontes: relatórios 11 a 13 da pesquisa e PLS 2026–2028 da ESMPU. */

const EIXOS = {
  energia: { nome: 'Energia elétrica', curto: 'Energia', cor: '#FFC53D', icone: 'raio', un: 'kWh' },
  agua: { nome: 'Água', curto: 'Água', cor: '#5BB6FF', icone: 'gota', un: 'm³' },
  residuos: { nome: 'Resíduos sólidos', curto: 'Resíduos', cor: '#4ADE80', icone: 'recicla', un: 'kg' },
};

/* 17 tipos de ação padronizados pela pesquisa.
   "registros" = ocorrências nos planos de 13 órgãos de referência (11ª entrega). */
const CATALOGO = [
  { id: 'en-efic', eixo: 'energia', nome: 'Trocar equipamentos por modelos eficientes', oficial: 'Adequação/substituição de sistemas e equipamentos visando maior eficiência energética', registros: 3, icone: 'raio', indicador: 'Consumo de energia per capita (kWh/pessoa)' },
  { id: 'en-camp', eixo: 'energia', nome: 'Campanhas de uso racional de energia', oficial: 'Campanhas de uso racional de energia elétrica', registros: 16, icone: 'megafone', indicador: 'Campanhas realizadas por ano' },
  { id: 'en-monit', eixo: 'energia', nome: 'Medir o consumo de energia todo mês', oficial: 'Monitoramento sistemático do consumo de energia elétrica e identificação de desperdícios', registros: 14, icone: 'medidor', indicador: 'Consumo mensal (kWh) e por m²' },
  { id: 'en-compras', eixo: 'energia', nome: 'Exigir eficiência energética nas compras', oficial: 'Gestão de contratos e compras sustentáveis com critérios de eficiência energética', registros: 10, icone: 'carrinho', indicador: '% de termos de referência com requisito de eficiência' },
  { id: 'en-renov', eixo: 'energia', nome: 'Gerar energia renovável', oficial: 'Implantação/adequação de sistemas de energia renovável', registros: 9, icone: 'sol', indicador: 'Energia gerada (kWh) e % do consumo' },

  { id: 'ag-efic', eixo: 'agua', nome: 'Torneiras e descargas econômicas', oficial: 'Adequação/substituição de sistemas e equipamentos visando maior eficiência hidráulica', registros: 31, icone: 'torneira', indicador: 'Consumo de água per capita (m³/pessoa)' },
  { id: 'ag-camp', eixo: 'agua', nome: 'Campanhas de uso racional da água', oficial: 'Campanhas de conscientização para redução do consumo e uso racional da água', registros: 21, icone: 'megafone', indicador: 'Campanhas realizadas por ano' },
  { id: 'ag-monit', eixo: 'agua', nome: 'Medir o consumo de água todo mês', oficial: 'Monitoramento sistemático do consumo de água e identificação de desperdícios', registros: 14, icone: 'medidor', indicador: 'Consumo mensal (m³) e por m²' },
  { id: 'ag-chuva', eixo: 'agua', nome: 'Aproveitar água de chuva', oficial: 'Captação e aproveitamento de águas pluviais ou outras fontes sustentáveis para fins não potáveis', registros: 5, icone: 'chuva', indicador: 'Volume aproveitado (m³)' },
  { id: 'ag-reuso', eixo: 'agua', nome: 'Reúso de água', oficial: 'Reúso de água para fins não potáveis', registros: 3, icone: 'reuso', indicador: 'Volume reutilizado (m³)' },
  { id: 'ag-compras', eixo: 'agua', nome: 'Exigir eficiência hidráulica nas compras', oficial: 'Gestão de contratos e compras sustentáveis com critérios de eficiência hidráulica', registros: 2, icone: 'carrinho', indicador: '% de termos de referência com requisito de eficiência' },

  { id: 're-reduz', eixo: 'residuos', nome: 'Gerar menos resíduos', oficial: 'Ações para redução da geração de resíduos', registros: 118, icone: 'recicla', indicador: 'Consumo de papel e de copos descartáveis' },
  { id: 're-camp', eixo: 'residuos', nome: 'Campanhas de descarte consciente', oficial: 'Campanhas educativas e de conscientização sobre redução, separação e destinação adequada de resíduos', registros: 52, icone: 'megafone', indicador: 'Campanhas realizadas por ano' },
  { id: 're-reversa', eixo: 'residuos', nome: 'Logística reversa', oficial: 'Logística reversa (pilhas, baterias, toner, lâmpadas, pneus)', registros: 29, icone: 'reuso', indicador: 'Itens devolvidos ao fabricante (kg ou unidades)' },
  { id: 're-compras', eixo: 'residuos', nome: 'Compras que reduzem resíduos', oficial: 'Gestão de contratos e compras sustentáveis com critérios para redução de resíduos', registros: 28, icone: 'carrinho', indicador: '% de contratações com critério ambiental' },
  { id: 're-coleta', eixo: 'residuos', nome: 'Coleta seletiva interna', oficial: 'Implantação ou fortalecimento da coleta seletiva interna', registros: 17, icone: 'lixeira', indicador: 'Recicláveis destinados a cooperativas (kg)' },
  { id: 're-monit', eixo: 'residuos', nome: 'Pesar e monitorar os resíduos', oficial: 'Monitoramento do consumo, do descarte e da geração de resíduos', registros: 14, icone: 'medidor', indicador: 'Resíduos gerados (kg) e taxa de desvio de aterro' },
];

/* Exemplo carregado por padrão: as 10 ações do Plano de Ações e Metas do PLS 2026–2028 da ESMPU.
   Ações e responsáveis são do plano publicado; a SITUAÇÃO é ilustrativa. */
const PLANO_ESMPU = [
  { cat: 'en-efic', titulo: 'Instalar sensor de presença e sistema fotovoltaico na garagem', resp: 'Coenge', status: 'andamento' },
  { cat: 'en-efic', titulo: 'Individualizar o circuito de iluminação comum', resp: 'Coenge', status: 'andamento' },
  { cat: 'en-camp', titulo: 'Orientar o desligamento de luzes, ar-condicionado e computadores', resp: 'Comissão de Sustentabilidade · CComp', status: 'feito' },
  { cat: 'en-compras', titulo: 'Exigir eficiência energética mínima nos termos de referência', resp: 'CComp', status: 'andamento' },
  { cat: 'ag-efic', titulo: 'Instalar redutor de pressão nas torneiras dos andares mais baixos', resp: 'Coenge', status: 'atrasada' },
  { cat: 'ag-efic', titulo: 'Usar irrigador automático nos jardins do térreo', resp: 'Coenge', status: 'andamento' },
  { cat: 're-reduz', titulo: 'Configurar todas as impressoras para frente e verso', resp: 'STI', status: 'atrasada' },
  { cat: 're-reduz', titulo: 'Instruir o processo de contratação do PGRS', resp: 'Cosam', status: 'andamento' },
  { cat: 're-camp', titulo: 'Incentivar o uso de copos, canecas e xícaras duráveis', resp: 'Nual · Secom', status: 'feito' },
  { cat: 're-camp', titulo: 'Campanhas internas e orientações sobre resíduos especiais', resp: 'Secom · Comissão de Sustentabilidade', status: 'andamento' },
];

/* Consumo da ESMPU em 2025 (diagnóstico do PLS 2026–2028). */
const BASE_ESMPU = {
  energia: { valor: 211358, nota: '40% a menos que em 2024' },
  agua: { valor: 2720, nota: '10% a menos que em 2024' },
  residuos: { valor: 5690, nota: '72% são orgânicos' },
};

/* Órgãos de referência da pesquisa. A altura dos prédios é ilustrativa. */
const ORGAOS = [
  ['STF', 9], ['STJ', 11], ['TST', 7], ['STM', 5], ['TCU', 10], ['Senado', 12], ['Câmara', 9],
  ['TJBA', 6], ['TJRJ', 8], ['MPBA', 7], ['MPPE', 5], ['MPRS', 6], ['MPRJ', 8],
];

const STATUS = {
  planejada: { nome: 'Planejada', cor: '#A9B8CA' },
  andamento: { nome: 'Em andamento', cor: '#FFC53D' },
  feito: { nome: 'Feita', cor: '#4ADE80' },
  atrasada: { nome: 'Atrasada', cor: '#FF8A7A' },
};
