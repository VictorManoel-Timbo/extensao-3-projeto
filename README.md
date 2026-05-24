# FoodGuard

O FoodGuard é uma plataforma web desenvolvida para a identificação de
componentes alergênicos em produtos alimentícios, visando prevenir reações
adversas nos usuários. A ferramenta oferece uma solução ágil e intuitiva para a
interpretação de rótulos, fundamentada no cruzamento de dados nutricionais com o
perfil de saúde fornecido durante o cadastro.

A funcionalidade central do sistema consiste na leitura de códigos de barras,
processada via modelo Yolov8n em conjunto com a biblioteca ONNX Runtime-web,
para a extração integral de informações do produto. Complementarmente, o
FoodGuard utiliza processamento de linguagem natural para analisar descrições
textuais, permitindo que a verificação de segurança alimentar ocorra tanto por meio
de registros fotográficos quanto por comandos de texto.