import { prisma } from "@/lib/prisma";
import { logger } from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    const user = prisma.user.findUnique({ where: { email } });
    if (!user || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 400 },
      );
    }

    //Hash da senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza o usuário
    const updateUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { sucess: true, message: { updateUser } },
      { status: 201 },
    );
  } catch (err) {
    logger(err);

    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 200 },
    );
  }
}
