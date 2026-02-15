# Design do Aplicativo de Terapia Metacognitiva

## Visão Geral

Aplicativo mobile para terapeutas metacognitivos realizarem avaliações de pacientes usando questionários validados (MCQ-30, NBRS, PBRS), acompanharem progresso ao longo do tempo com gráficos e estatísticas, e gerarem relatórios profissionais em PDF.

## Orientação e Uso

**Orientação:** Portrait (9:16) - uso com uma mão
**Plataforma:** Android (funciona offline)
**Estilo:** Profissional, clean, inspirado em aplicativos médicos iOS (seguindo HIG)

## Paleta de Cores

- **Primary (Azul Profissional):** `#0a7ea4` - Botões principais, destaques
- **Success (Verde):** `#22C55E` - Indicadores de progresso positivo
- **Warning (Amarelo):** `#F59E0B` - Alertas moderados
- **Error (Vermelho):** `#EF4444` - Indicadores de preocupação
- **Background Light:** `#ffffff` - Fundo principal
- **Surface Light:** `#f5f5f5` - Cards e superfícies elevadas
- **Foreground:** `#11181C` - Texto principal
- **Muted:** `#687076` - Texto secundário

## Lista de Telas

### 1. Home / Dashboard
**Conteúdo:**
- Cabeçalho com nome do terapeuta e logo do app
- Cards com estatísticas rápidas: total de pacientes, avaliações realizadas este mês, pacientes com melhora
- Lista de pacientes recentes com foto/inicial, nome e data da última avaliação
- Botão flutuante (+) para adicionar novo paciente

**Funcionalidade:**
- Navegação rápida para perfil de paciente ao tocar na lista
- Acesso a todas as seções via tab bar inferior

### 2. Pacientes (Lista)
**Conteúdo:**
- Barra de busca no topo
- Lista de todos os pacientes com:
  - Avatar circular com iniciais
  - Nome completo
  - Idade
  - Data da última avaliação
  - Indicador visual de progresso (ícone colorido)
- Botão flutuante (+) para adicionar novo paciente

**Funcionalidade:**
- Busca por nome
- Ordenação por nome ou data de última avaliação
- Swipe para ações rápidas (editar, arquivar)

### 3. Adicionar/Editar Paciente
**Conteúdo:**
- Formulário com campos:
  - Nome completo
  - Data de nascimento (seletor de data)
  - Gênero (opcional)
  - Telefone (opcional)
  - Email (opcional)
  - Notas iniciais (textarea)
- Botões: Cancelar e Salvar

**Funcionalidade:**
- Validação de campos obrigatórios
- Cálculo automático de idade
- Salvamento local no AsyncStorage

### 4. Perfil do Paciente
**Conteúdo:**
- Cabeçalho com:
  - Avatar grande com iniciais
  - Nome e idade
  - Botão de editar (ícone)
- Seção de resumo com cards:
  - Total de avaliações
  - Última avaliação (data)
  - Tendência geral (ícone de seta)
- Gráfico de linha mostrando evolução dos scores ao longo do tempo
- Lista de avaliações anteriores (data, questionário, score)
- Botão principal: "Nova Avaliação"

**Funcionalidade:**
- Visualização de histórico completo
- Acesso a cada avaliação individual
- Iniciar nova avaliação

### 5. Selecionar Questionário
**Conteúdo:**
- Lista de questionários disponíveis em cards:
  - **MCQ-30** (Metacognitions Questionnaire-30)
    - Descrição: Avalia crenças metacognitivas
    - 30 itens, ~10 minutos
  - **NBRS** (Negative Beliefs about Rumination Scale)
    - Descrição: Crenças negativas sobre ruminação
    - 13 itens, ~5 minutos
  - **PBRS** (Positive Beliefs about Rumination Scale)
    - Descrição: Crenças positivas sobre ruminação
    - 9 itens, ~3 minutos
- Cada card mostra ícone, nome, descrição breve e tempo estimado

**Funcionalidade:**
- Seleção do questionário para aplicar
- Navegação para tela de aplicação

### 6. Aplicar Questionário
**Conteúdo:**
- Barra de progresso no topo (X de Y perguntas)
- Pergunta atual em texto grande e legível
- Escala Likert de resposta (1-4 ou 1-5 dependendo do questionário):
  - Botões grandes e tocáveis
  - Labels claros (ex: "Discordo Totalmente" a "Concordo Totalmente")
- Botões de navegação: Anterior e Próximo
- Botão de salvar rascunho (ícone)

**Funcionalidade:**
- Navegação entre perguntas
- Salvamento automático de respostas
- Validação antes de avançar
- Cálculo automático de score ao finalizar

### 7. Resultado da Avaliação
**Conteúdo:**
- Cabeçalho com nome do paciente e data
- Score total em destaque (número grande)
- Gráfico de radar/barra mostrando subscores (se aplicável)
- Interpretação textual do resultado
- Comparação com avaliação anterior (se existir)
- Botões: Ver Histórico, Gerar Relatório, Nova Avaliação

**Funcionalidade:**
- Visualização clara do resultado
- Comparação automática com histórico
- Acesso direto a relatório

### 8. Histórico de Avaliações
**Conteúdo:**
- Lista cronológica de todas as avaliações do paciente
- Cada item mostra:
  - Data
  - Questionário aplicado
  - Score obtido
  - Indicador de mudança (seta para cima/baixo)
- Filtros: por questionário, por período
- Gráfico de evolução no topo

**Funcionalidade:**
- Visualização de tendências
- Comparação entre avaliações
- Acesso a detalhes de cada avaliação

### 9. Comparar Avaliações
**Conteúdo:**
- Seletor de duas avaliações para comparar
- Visualização lado a lado:
  - Scores totais
  - Subscores (se aplicável)
  - Diferença percentual
- Gráficos comparativos
- Análise textual de mudanças

**Funcionalidade:**
- Seleção de avaliações específicas
- Visualização de diferenças
- Exportação de comparação

### 10. Estatísticas e Métricas
**Conteúdo:**
- Cards com métricas gerais:
  - Taxa de melhora geral
  - Média de tempo entre avaliações
  - Questionários mais aplicados
- Gráficos:
  - Distribuição de scores
  - Evolução temporal
  - Comparação entre pacientes (anônima)
- Filtros por período

**Funcionalidade:**
- Visualização de dados agregados
- Análise de efetividade
- Insights sobre prática clínica

### 11. Gerar Relatório (Modal/Tela)
**Conteúdo:**
- Formulário de configuração:
  - Selecionar avaliações a incluir
  - Incluir gráficos (checkbox)
  - Incluir comparações (checkbox)
  - Observações adicionais (textarea)
- Preview do relatório
- Botões: Cancelar, Gerar PDF

**Funcionalidade:**
- Customização do relatório
- Geração de PDF offline
- Compartilhamento via sistema

### 12. Configurações
**Conteúdo:**
- Seção de Terapeuta:
  - Nome
  - Registro profissional
  - Email
  - Telefone
- Seção de Aparência:
  - Modo escuro (toggle)
- Seção de Dados:
  - Exportar todos os dados
  - Importar dados
  - Limpar cache
- Seção Sobre:
  - Versão do app
  - Informações de licença

**Funcionalidade:**
- Configuração de perfil do terapeuta
- Gerenciamento de dados
- Preferências de interface

## Fluxos Principais de Usuário

### Fluxo 1: Adicionar Novo Paciente e Primeira Avaliação
1. Home → Toque no botão (+)
2. Adicionar Paciente → Preencher formulário → Salvar
3. Perfil do Paciente (novo) → Toque "Nova Avaliação"
4. Selecionar Questionário → Escolher MCQ-30
5. Aplicar Questionário → Responder 30 perguntas → Finalizar
6. Resultado da Avaliação → Visualizar score → Salvar

### Fluxo 2: Acompanhar Progresso de Paciente Existente
1. Home → Toque em paciente na lista recente
2. Perfil do Paciente → Visualizar gráfico de evolução
3. Toque em "Ver Histórico"
4. Histórico de Avaliações → Visualizar todas as avaliações
5. Toque em "Comparar"
6. Comparar Avaliações → Selecionar duas avaliações → Ver diferenças

### Fluxo 3: Gerar Relatório de Progresso
1. Perfil do Paciente → Toque em avaliação específica
2. Resultado da Avaliação → Toque "Gerar Relatório"
3. Gerar Relatório → Configurar opções → Preview
4. Toque "Gerar PDF" → PDF criado
5. Compartilhar via sistema (email, WhatsApp, etc.)

## Componentes de UI Reutilizáveis

- **PatientCard**: Card com avatar, nome, idade e última avaliação
- **ScoreDisplay**: Visualização de score com cor baseada em valor
- **ProgressChart**: Gráfico de linha para evolução temporal
- **QuestionnaireCard**: Card de seleção de questionário
- **LikertScale**: Componente de escala Likert customizável
- **StatCard**: Card de estatística com ícone e valor
- **ComparisonView**: Visualização lado a lado de duas avaliações

## Navegação

**Tab Bar (Bottom Navigation):**
- Home (ícone: house.fill)
- Pacientes (ícone: person.2.fill)
- Estatísticas (ícone: chart.bar.fill)
- Configurações (ícone: gear)

**Stack Navigation dentro de cada tab:**
- Home → Perfil do Paciente → Nova Avaliação → Resultado
- Pacientes → Adicionar/Editar Paciente
- Pacientes → Perfil do Paciente → Histórico → Comparar
