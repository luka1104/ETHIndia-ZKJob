import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "lib/prisma";

const getUser = async (address: string) => {
  console.log(address);
  const resp = await prisma.user.findUnique({
    where: {
      address: address,
    },
  });
  return resp
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  const resp = await getUser(req.body)
  console.log(resp);
  res.status(200).json({"user": resp})
};
export default handler;
