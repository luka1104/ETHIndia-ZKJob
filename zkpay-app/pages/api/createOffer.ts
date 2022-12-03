import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "lib/prisma";

const createOffer = async (data: any) => {
  console.log(data);
  const resp = await prisma.userCompany.create({
    data: {
      userId: data.userId,
      companyId: data.companyId,
    },
  });
  return resp
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  const resp = await createOffer(req.body)
  console.log(resp);
  res.status(200).json({"resp": resp})
};
export default handler;
