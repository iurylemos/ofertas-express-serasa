# Ofertas Express — ofertas e checkout

Aplicação web responsiva para comparar ofertas, escolher uma forma de pagamento, revisar o
acordo e confirmar o checkout. A experiência não exige conta ou autenticação.

## Requisitos

- Node.js 20.9 ou superior
- npm

## Instalar e executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. O MSW fornece ofertas, métodos de pagamento e resultados de
checkout durante o desenvolvimento; não é necessário um backend.

## Verificações

```bash
npm test
npm run typecheck
npm run build
```

Os testes usam Vitest, Testing Library e MSW sem chamadas a serviços externos.

## Arquitetura

- **Next.js App Router e React** organizam a aplicação em uma única rota.
- **TanStack React Query** mantém ofertas e métodos como estado de servidor; as escolhas e a
  etapa atual ficam em estado React transitório.
- **Serviços e interfaces tipadas** isolam requisições, validação de respostas e erros seguros.
- **MSW** reutiliza handlers e fixtures no navegador e nos testes, cobrindo sucesso, vazio e
  falha HTTP.
- **Vitest, jsdom e Testing Library** exercitam os fluxos visíveis de seleção, revisão,
  confirmação, falha e retry.

Não há integração de pagamento, backend, autenticação ou persistência. Os valores de exemplo
são fictícios e expressos internamente em centavos de BRL.
