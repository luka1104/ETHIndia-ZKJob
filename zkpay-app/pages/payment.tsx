import { NextPage } from "next";
import axios from "axios";
import { Button, Box, Flex, Image, Input, useToast } from "@chakra-ui/react";

const Payment: NextPage = () => {
  const toast = useToast();
  const handleSubmit = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .post("/api/zkbob/payment", {}, config)
        .then((response) => {
          resolve(response);
          if (response.status === 200) {
            toast({
              title: "Private Transfer Success.",
              description: "Private Transfer Success.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          }
          console.log(response);
        })
        .catch((e) => {
          reject(e);
          throw new Error(e);
        });
    });
  };
  return (
    <>
      <Box maxW="500">
        <Flex>
          <Input placeholder="Amount" m="3" />
          <Box>
            <Button
              rightIcon={<Image src={"/images/bob.png"} h="20px" />}
              onClick={handleSubmit}
              m="3"
            >
              Send BOB
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Payment;
