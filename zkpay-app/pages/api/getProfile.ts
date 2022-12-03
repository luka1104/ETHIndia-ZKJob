import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "lib/prisma";

const getProfile = async (id: number) => {
  console.log(id);
  const resp = await prisma.profile.findUnique({
    where: {
      userId: id,
    },
  });
  return resp
}

const getCompanyProfile = async (id: number) => {
  console.log(id);
  const resp = await prisma.companyProfile.findUnique({
    where: {
      companyId: id,
    },
  });
  return resp
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  if(req.body.isCompany) {
    const resp = await getCompanyProfile(req.body.userId)
    console.log(resp);
    res.status(200).json({"profile": resp})
  } else {
    const resp = await getProfile(req.body.userId)
    console.log(resp);
    res.status(200).json({"profile": resp})
  }
};
export default handler;
