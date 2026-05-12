//Logar
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "@/utils/logger";


//Rota de Login
export async function POST(request: NextRequest) {
  try {
    //Capturar dados da requisição
    const body = await request.json();
    const { email, password } = body;

    //Buscar usuário e verificar se existe
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário ou senha inválidos" },
        { status: 400 },
      );
    }

    //Se existir comparar senha digitada com a senha registrada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //Se a senha for inválida retorna o erro
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Usuário ou senha inválidos" },
        { status: 400 },
      );
    }
    //Se a senha for válida cria o token para o usuário e armazena em cookies.
    //Verifica e o token existe antes de tentar criar
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não definida");
    }

    //Cria o token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    // Cria o response
    const response = NextResponse.json(
      { success: true, message: "Logado com sucesso" },
      { status: 200 },
    );

    //Envia o token por cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, //7 dias de duração
      path: "/",
    });

    // Retorna o response
    return response;
  } catch (err) {
    logger(err)

    return NextResponse.json(
      { sucess: false, message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
