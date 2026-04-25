# Plano de Adaptação - Civic Guardian

Este documento descreve as etapas para transformar os mockups estáticos na pasta `/GUIA COMPLETO` em uma aplicação Next.js funcional, seguindo as diretrizes de design estabelecidas no `DESIGN.md`.

## Diretrizes de Design (Resumo)
- **Identidade:** Institucional e Confiável.
- **Tipografia:** `Zilla Slab` (Títulos) e `Public Sans` (Corpo).
- **Cores:** Azul Cívico (#1173D4) para estrutura, Vermelho Alerta (#E11D48) para urgência.
- **Estilo:** "Soft-Square" com bordas táteis (bordas inferiores grossas).

---

## Etapas da Adaptação

### Etapa 1: Base e Home Hub (Central de Serviços)
- **Objetivo:** Criar a estrutura base da aplicação e a página inicial.
- **Componentes:** `TopAppBar`, `Footer`, `UrgentAlertBanner`, `ServiceCard`.
- **Mockup de Referência:** `/GUIA COMPLETO/home_hub_web/code.html`.

### Etapa 2: Relato e Voz do Bairro (Participação Cidadã)
- **Objetivo:** Implementar o sistema de relatos de problemas urbanos e petições.
- **Componentes:** `IssueFeed`, `PetitionCard`, `ReportForm`.
- **Mockup de Referência:** `/GUIA COMPLETO/voz_do_bairro_web/code.html` e `/GUIA COMPLETO/nova_solicita_o_2/code.html`.

### Etapa 3: Saúde Fácil (Serviços de Saúde)
- **Objetivo:** Listagem de unidades básicas de saúde e agendamento de consultas.
- **Componentes:** `ClinicCard`, `WaitTimeIndicator`, `BookingModal`.
- **Mockup de Referência:** `/GUIA COMPLETO/sa_de_f_cil_web/code.html`.

### Etapa 4: Comércio Local (Economia do Município)
- **Objetivo:** Diretório de negócios locais e vendedores ambulantes com mapa.
- **Componentes:** `MerchantList`, `InteractiveMap`, `VendorProfile`.
- **Mockup de Referência:** `/GUIA COMPLETO/com_rcio_local_web/code.html`.

### Etapa 5: Empregos e Comunidade (Integração Social)
- **Objetivo:** Balcão de empregos e grupos de bairro verificados.
- **Componentes:** `JobBoard`, `NeighborhoodGroupCard`.
- **Mockup de Referência:** `/GUIA COMPLETO/empregos_servi_os_web/code.html` e `/GUIA COMPLETO/comunidade_web/code.html`.

---

## Organização de Pastas (Análise)
Cada pasta em `/GUIA COMPLETO` agora contém:
1. `code.html`: Estrutura HTML/Tailwind para referência.
2. `screen.png`: Referência visual (âncora).
3. `ANALISE.md` (A ser criado): Detalhando elementos específicos de design de cada tela.
