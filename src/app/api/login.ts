import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Simulação de autenticação
    if (email === "user@example.com" && password === "password123") {
      // Retorna um token simulado
      return res.status(200).json({ token: "fake-jwt-token" });
    }

    return res.status(401).json({ message: "Credenciais inválidas!" });
  }

  res.status(405).json({ message: "Método não permitido!" });
}
