import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  // const check = await db.otp.findFirst({
  //   where: { email, code: otp }
  // });

  // if (!check) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

  // let user = await db.user.findUnique({ where: { email } });

  // if (!user) {
  //   user = await db.user.create({
  //     data: {
  //       email,
  //       license: "basic",
  //       bio: "",
  //       highlights: [],
  //     },
  //   });
  // }

  // return NextResponse.json({ ok: true });
}
