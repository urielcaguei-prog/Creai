# STUDIO SITES — STUDIO LOCAL AI

Construtor e editor de sites por linguagem natural, executado localmente no navegador.

## Arquitetura
- HTML + CSS + JavaScript local.
- Sem API de IA, sem API key e sem backend obrigatório.
- Interpretação por normalização, dicionário de erros/sinônimos, contexto e ações estruturadas.
- Estado, histórico, projetos, comandos e contexto armazenados localmente.
- Preview real em iframe/srcdoc.
- Seleção de elementos no preview por `data-studio-id`.
- Controles manuais de texto, fundo, fonte e raio.

## Regras implementadas
- Nenhuma imagem é adicionada quando o usuário não pede.
- Quando imagens são pedidas, são usadas somente imagens JPG locais existentes no pacote.
- Fundo com imagem só é usado quando solicitado; "no começo/início/topo" aponta para a HERO.
- WhatsApp é normalizado e convertido para link `wa.me` real.
- Instagram e outras redes aceitam URLs reais fornecidas pelo usuário.
- Preços podem ser removidos ou produtos com preço podem ser adicionados.
- Fonte, cor da fonte, cor do título e estilo são intenções diferentes.
- Desfazer/refazer cria estados.
- Seleção visual alimenta o contexto da conversa.
- Validação verifica HTML, placeholders, preços, links e assets conhecidos; o preview também verifica carregamento das imagens e overflow quando o navegador permite acesso ao documento.
- PDF é gerado localmente como uma representação visual do site, sem código-fonte.

## Assets
Cada categoria possui 3 imagens de conteúdo e 1 imagem de fundo local:
- `images/pizza/`
- `images/hamburgueria/`
- `images/restaurante/`
- `images/clinica/`
- `images/barbearia/`
- `images/mercado/`

## Catálogo
A biblioteca contém 600 registros preservados: 100 por categoria e 60 por layout. Ela é auxiliar; a experiência principal é criar e editar por conversa.

## Uso
Abra `index.html` diretamente ou publique a pasta em GitHub Pages. O projeto não precisa de conexão com servidor de IA.
