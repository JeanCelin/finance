import { NextResponse } from "next/server";
import { logger } from "@/utils/logger";
//Rota logout
export async function POST() {
  //cria o response
  try {
    const response = NextResponse.json({
      sucess: true,
      message: "Logout realizado com sucesso",
    });
    response.cookies.set("token", "", {
      maxAge: 0, //expira o token
      path: "/",
    });

    return response;
  } catch (err) {
    logger(err);
    return NextResponse.json(
      { sucess: false, message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
