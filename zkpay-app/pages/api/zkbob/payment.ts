import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const getAccountInfo = async (accountId: string) => {
  const response = await fetch(
    `https://cloud-mvp.zkbob.com/account?id=${accountId}`
  );
  const data: any = await response.json();
  return data;
};

const generateAddress = async (accountId: string) => {
  const response = await fetch(
    `https://cloud-mvp.zkbob.com/generateAddress?id=${accountId}`
  );
  const data: any = await response.json();
  return data.address;
};

const transfer = async (fromAccountId: string, toShieldAddress: string) => {
  const body = { accountId: fromAccountId, amount: 100, to: toShieldAddress };
  console.log(body);
  const response = await fetch("https://cloud-mvp.zkbob.com/transfer", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log(data);

  return data;
};

const payment = async () => {
  const BOB_KEY = process.env.NEXT_PUBLIC_ZKBOB_KEY_BOB ?? "";
  const ALICE_KEY = process.env.NEXT_PUBLIC_ZKBOB_KEY_ALICE ?? "";
  console.log("BOB_KEY", BOB_KEY);
  console.log("ALICE_KEY", ALICE_KEY);
  const beforeBobInfo = await getAccountInfo(BOB_KEY);
  const beforeAliceInfo = await getAccountInfo(ALICE_KEY);
  console.log(beforeBobInfo, beforeAliceInfo);
  const BobShieldAddress = await generateAddress(BOB_KEY);
  const AliceShieldAddress = await generateAddress(ALICE_KEY);

  const res = await transfer(BOB_KEY, AliceShieldAddress);

  const afterBobInfo = await getAccountInfo(BOB_KEY);
  const afterAliceInfo = await getAccountInfo(ALICE_KEY);
  console.log(afterBobInfo, afterAliceInfo);

  return res;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  const resp = await payment();
  console.log(resp);
  res.status(200).json({ data: resp });
};
export default handler;
