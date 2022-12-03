import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "lib/prisma";

const updateUser = async (id: number) => {
  console.log(id);
  const resp = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isVerified: true
    },
  });
  return resp
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  const resp = await updateUser(req.body)
  console.log(resp);
  res.status(200).json({"user": resp})
};
export default handler;
