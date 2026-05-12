import { prisma } from "@/lib/prisma";
import { logger } from "@/utils/logger";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Rota para registrar usuário
export async function POST(request: NextRequest) {
  // Lendo o body da requisição
  try {
    const body = await request.json();

    const { password, name, email } = body;
    
    //Verifica e o usuário enviou todos os campos.
    if (!password || !name || !email)
      return NextResponse.json(
    { success: false, message: "Dados faltando" },
    { status: 400 },
  );
  
    //Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ sucess: true, message: { user } }, { status: 201 });
  } catch (err) {
     logger(err)
    return NextResponse.json({sucess: false, message: "Erro interno do servidor"}, {status: 500})
  }
}
