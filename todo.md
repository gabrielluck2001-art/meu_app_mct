# TODO - Aplicativo de Terapia Metacognitiva

## Estrutura e Navegação
- [x] Configurar navegação com tabs (Home, Pacientes, Estatísticas, Configurações)
- [x] Adicionar ícones personalizados ao icon-symbol.tsx
- [x] Criar estrutura de pastas para telas e componentes

## Banco de Dados Local
- [x] Configurar AsyncStorage para persistência
- [x] Criar modelos de dados (Terapeuta, Paciente, Avaliação, Resposta)
- [x] Implementar funções de CRUD para pacientes
- [x] Implementar funções de CRUD para avaliações
- [x] Sistema de backup e exportação de dados

## Gerenciamento de Pacientes
- [x] Tela de lista de pacientes com busca
- [ ] Tela de adicionar/editar paciente
- [ ] Perfil do paciente com resumo
- [x] Avatar com iniciais do paciente
- [ ] Validação de formulários

## Questionários
- [x] Implementar MCQ-30 (30 itens)
- [x] Implementar NBRS (13 itens)
- [x] Implementar PBRS (9 itens)
- [ ] Tela de seleção de questionário
- [ ] Tela de aplicação com barra de progresso
- [ ] Componente de escala Likert
- [ ] Sistema de salvamento de rascunho
- [ ] Cálculo automático de scores

## Histórico e Avaliações
- [ ] Tela de resultado da avaliação
- [ ] Tela de histórico de avaliações
- [ ] Sistema de comparação entre avaliações
- [ ] Indicadores visuais de progresso (setas, cores)

## Gráficos e Visualizações
- [x] Gráfico de linha para evolução temporal
- [ ] Gráfico de radar para subscores
- [ ] Gráfico de barras para comparação
- [x] Cards de estatísticas no dashboard
- [ ] Visualização de tendências

## Métricas e Estatísticas
- [ ] Cálculo de taxa de melhora
- [ ] Média de tempo entre avaliações
- [ ] Distribuição de scores
- [ ] Estatísticas agregadas por questionário
- [ ] Filtros por período

## Geração de Relatórios PDF
- [ ] Configuração de relatório (seleção de avaliações)
- [ ] Template de relatório com cabeçalho
- [ ] Inclusão de dados do paciente (nome, idade)
- [ ] Inclusão de dados do terapeuta
- [ ] Inclusão de gráficos no PDF
- [ ] Inclusão de tabelas de comparação
- [ ] Sistema de compartilhamento

## Configurações
- [ ] Perfil do terapeuta (nome, registro, contato)
- [ ] Modo escuro/claro
- [ ] Exportar/importar dados
- [ ] Tela sobre o app

## Design e UI
- [x] Componente PatientCard reutilizável
- [ ] Componente ScoreDisplay com cores
- [ ] Componente QuestionnaireCard
- [ ] Componente StatCard
- [x] Feedback visual em botões (haptics)
- [ ] Animações suaves de transição
- [x] Design responsivo para diferentes tamanhos

## Branding
- [x] Gerar logo personalizado do app
- [x] Atualizar app.config.ts com nome e logo
- [x] Configurar splash screen
- [x] Configurar ícone do app

## Testes e Validação
- [ ] Testar fluxo completo de adicionar paciente
- [ ] Testar aplicação de cada questionário
- [ ] Testar cálculo de scores
- [ ] Testar geração de gráficos
- [ ] Testar geração de PDF
- [ ] Testar persistência de dados
- [ ] Testar em diferentes tamanhos de tela

## Documentação
- [ ] README com instruções de uso
- [ ] Documentação dos questionários
- [ ] Guia de interpretação de scores

## Mapeamento Metacognitivo
- [x] Criar modelos de dados para mapeamento metacognitivo
- [x] Implementar tela de mapeamento com formulário interativo
- [x] Lista de metacrenças positivas comuns + opção personalizada
- [x] Lista de metacrenças negativas comuns + opção personalizada
- [x] Modelos específicos para Depressão
- [x] Modelos específicos para TOC
- [x] Modelos específicos para TAG
- [x] Modelos específicos para TEPT
- [x] Salvar mapeamento no histórico do paciente
- [ ] Visualizar mapeamentos anteriores
- [ ] Opção de apagar mapeamentos

## Biblioteca de Técnicas
- [x] Criar estrutura de dados para técnicas metacognitivas
- [x] Implementar tela de biblioteca com lista de técnicas
- [ ] Descrições detalhadas de cada técnica
- [x] Organização por categoria
- [x] Sistema de busca de técnicas
- [ ] Favoritar técnicas mais usadas

## Adicionar/Editar Paciente
- [x] Tela completa de adicionar paciente
- [x] Formulário com nome, idade, data de nascimento
- [x] Seleção de transtorno em acompanhamento
- [x] Campos de contato (telefone, email)
- [x] Campo de notas clínicas
- [x] Validação de campos obrigatórios
- [x] Tela de editar paciente existente
- [ ] Opção de deletar paciente

## Configurações Expandidas
- [x] Perfil completo do terapeuta (nome, CRP, especialização)
- [x] Contato do terapeuta (telefone, email, endereço)
- [x] Toggle de tema claro/escuro
- [x] Configurações de backup automático
- [x] Configurações de privacidade
- [x] Tela "Sobre o Aplicativo"
- [x] Versão e informações do desenvolvedor

## Integrações
- [ ] Vincular transtorno do paciente ao modelo metacognitivo
- [ ] Sugerir questionários baseados no transtorno
- [ ] Pré-preencher mapeamento com modelo do transtorno
- [ ] Histórico unificado (avaliações + mapeamentos + sessões)
- [ ] Navegação fluida entre módulos

## Formulação de Caso MCT
- [ ] Estrutura de dados para formulação de caso
- [ ] Tela de criar formulação de caso
- [ ] Identificação de gatilhos
- [ ] Identificação de metacrenças
- [ ] Identificação do CAS
- [ ] Plano de intervenção

## Plano de Tratamento
- [ ] Estrutura de fases do tratamento MCT
- [ ] Fase 1: Socialização e formulação
- [ ] Fase 2: Modificação de metacrenças
- [ ] Fase 3: Treinamento atencional
- [ ] Fase 4: Prevenção de recaída
- [ ] Acompanhamento de progresso por fase

## Registro de Sessões
- [ ] Estrutura de dados para sessões
- [ ] Tela de registrar nova sessão
- [ ] Data, duração e número da sessão
- [ ] Objetivos da sessão
- [ ] Técnicas utilizadas
- [ ] Tarefas de casa
- [ ] Observações e progresso
- [ ] Histórico de sessões do paciente

## Aplicação de Questionários (URGENTE)
- [x] Tela de seleção de questionário (MCQ-30, NBRS, PBRS)
- [x] Interface de aplicação do MCQ-30 (30 itens)
- [x] Interface de aplicação do NBRS (13 itens)
- [x] Interface de aplicação do PBRS (9 itens)
- [x] Escala Likert visual para cada item
- [x] Navegação entre itens (próximo/anterior)
- [x] Barra de progresso
- [x] Cálculo automático de scores totais
- [x] Cálculo de subescalas
- [ ] Interpretação de resultados
- [x] Salvamento da avaliação no histórico
- [x] Vincular avaliação ao paciente

## Mapeamento Metacognitivo Funcional (URGENTE)
- [x] Tela de criar novo mapeamento
- [x] Seletor de modelo (TAG, Depressão, TOC, TEPT)
- [x] Lista de metacrenças positivas comuns
- [x] Campo para metacrença positiva personalizada
- [x] Lista de metacrenças negativas comuns
- [x] Campo para metacrença negativa personalizada
- [x] Campos para componentes do CAS
- [x] Salvamento do mapeamento
- [ ] Visualizar mapeamentos salvos
- [ ] Editar mapeamento existente
- [ ] Deletar mapeamento

## Estatísticas e Gráficos (URGENTE)
- [x] Gráfico de evolução temporal de scores
- [ ] Comparação entre avaliações
- [x] Métricas de progresso por paciente
- [x] Dashboard com dados reais (não mock)
- [x] Estatísticas globais funcionando
- [ ] Filtros por período

## Integrações e Navegação (URGENTE)
- [x] Histórico unificado (avaliações + mapeamentos)
- [x] Navegação do perfil do paciente para nova avaliação
- [x] Navegação do perfil do paciente para novo mapeamento
- [x] Dados persistindo corretamente no AsyncStorage
- [x] Atualização automática de estatísticas

## Nova Logo e Branding
- [ ] Gerar logo em forma de triângulo
- [ ] Aplicar nova logo em todos os assets
- [ ] Atualizar app.config.ts com nova logo

## Dashboard Detalhado do Paciente
- [ ] Gráfico de evolução temporal de scores
- [ ] Gráfico de pizza dos tipos de metacrenças
- [ ] Barras de progresso para força das metacrenças
- [ ] Porcentagens de metacrenças positivas vs negativas
- [ ] Comparação entre avaliações anteriores
- [ ] Histórico completo unificado visual

## Insights e Interpretação
- [ ] Interpretação automática após questionários
- [ ] Botão de informação (ℹ️) para cada métrica
- [ ] Registro de insights clínicos
- [ ] Recomendações baseadas em scores
- [ ] Alertas para scores críticos

## Biblioteca de Técnicas Expandida
- [ ] Botão "Ver Mais" funcional
- [ ] Tela de detalhes da técnica
- [ ] Passos detalhados de execução
- [ ] Exemplos práticos
- [ ] Contraindicações
- [ ] Duração estimada

## Exportação de PDF
- [ ] Gerar relatório profissional em PDF
- [ ] Incluir logo e dados do terapeuta
- [ ] Gráficos de evolução no PDF
- [ ] Histórico de avaliações
- [ ] Histórico de mapeamentos
- [ ] Interpretações e recomendações

## Animações e UX
- [ ] Animações de fade in/out
- [ ] Transições de slide
- [ ] Animações de scale em botões
- [ ] Barras de progresso animadas
- [ ] Loading states suaves
- [ ] Skeleton screens
