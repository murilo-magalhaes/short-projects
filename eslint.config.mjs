import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Adicione o objeto abaixo para sobrescrever as regras:
  {
    rules: {
      // Desativa o erro de variáveis não utilizadas
      "@typescript-eslint/no-unused-vars": "off",

      // Desativa o aviso de dependências faltando no useEffect
      "react-hooks/exhaustive-deps": "off",

      // Desativa o erro de caracteres especiais (aspas, etc) no HTML
      "react/no-unescaped-entities": "off",

      // Permite o uso do tipo 'any'
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;