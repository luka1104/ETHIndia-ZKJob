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

const getCompany = async (address: string) => {
  console.log(address);
  const resp = await prisma.company.findUnique({
    where: {
      address: address,
    },
  });
  return resp
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  const resp = await getUser(req.body)
  if(resp) {
    console.log(resp);
    res.status(200).json({"user": resp, "isCompany": false})
  } else {
    const resp = await getCompany(req.body)
    res.status(200).json({"user": resp, "isCompany": true})
  }
};
export default handler;
