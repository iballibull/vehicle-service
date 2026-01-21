import { prisma } from "../../config/prisma.config.js";

const findUserByUsername = async (username) => {
  const user = await prisma.dealer.findUnique({
    where: {
      username,
    },
  });

  return user;
};

export default {
  findUserByUsername,
};
