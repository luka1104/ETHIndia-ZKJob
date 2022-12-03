import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "lib/prisma";

const postProfile = async (data: any) => {
  console.log(data);
  const resp = await prisma.profile.create({
    data: {
      userId: data.userId,
      imagePath: data.imagePath,
      videoPath: data.videoPath,
    },
  });
  return resp
}

const postCompanyProfile = async (data: any) => {
  console.log(data);
  const resp = await prisma.companyProfile.create({
    data: {
      companyId: data.userId,
      imagePath: data.imagePath,
      videoPath: data.videoPath,
    },
  });
  return resp
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  if(req.body.isCompany) {
    const resp = await postCompanyProfile(req.body)
    console.log(resp);
    res.status(200).json({"profile": resp})
  } else {
    const resp = await postProfile(req.body)
    console.log(resp);
    res.status(200).json({"profile": resp})
  }
};
export default handler;
