import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "lib/prisma";

const postUser = async (data: any) => {
  console.log(data);
  const resp = await prisma.user.create({
    data: {
      address: data.address,
      nickname: data.nickname,
      description: data.description,
    },
  });
  return resp
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  const resp = await postUser(req.body)
  console.log(resp);
  res.status(200).json({"user": resp})
};
export default handler;
