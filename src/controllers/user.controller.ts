import { Request, Response } from "express";
import tokenUtils from "../config/token.utils";
import jwt from "jsonwebtoken";
import { userService } from "../services";
import passwordUtils from "../config/password.utils";
import axios from "axios";

const userLogin = async function (req: Request, res: Response) {
  try {
    const checkUser = await userService.getUserByFilter({
      deleted: false,
      email: req.body.email,
    });
    if (!checkUser)
      return res.status(404).send({
        code: 404,
        message: "User not found",
      });

    if (
      !(await passwordUtils.verifyPasswordHash(
        req.body.password,
        checkUser.password
      ))
    )
      return res.status(400).send({
        code: 400,
        message: "Enter a valid password",
      });
    const tokens = tokenUtils.generateAuthToken(checkUser.id);

    return res.status(200).send({
      code: 200,
      data: {
        user: checkUser,
        tokens,
      },
    });
  } catch (error: any) {
    return res.status(500).send({
      code: 500,
      data: null,
      message: error.message,
    });
  }
};

const generateAuthToken = async function (req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).send({ message: "unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const tokens = tokenUtils.generateAuthToken((decoded as any).userId);

    return res.status(200).send({
      message: "success",
      data: {
        tokens,
      },
    });
  } catch (error: any) {
    return res.status(401).send({ message: error.message });
  }
};

const userRegister = async function (req: Request, res: Response) {
  const checkUser = await userService.getUserByFilter({
    deleted: false,
    email: req.body.email,
  });
  if (checkUser)
    return res.status(400).send({
      code: 400,
      message: "User already found",
    });

  const password = await passwordUtils.generatePasswordHash(req.body.password);
  if (!password)
    return res.status(400).send({
      code: 400,
      message: "Error While encrypting password",
    });

  const createdUser = await userService.createUser({
    name: req.body.name,
    email: req.body.email,
    password,
  });
  return res.status(200).send({
    code: 200,
    data: {
      user: createdUser,
    },
  });
};

const fetchMotivationQuote = async function (req: Request, res: Response) {
  try {
    const response = await axios.get("http://api.quotable.io/random");
    return res.status(200).send({
      code: 200,
      data: response.data,
    });
  } catch (error: any) {
    console.log(error)
    return res.status(500).send({
      code: 500,
      data: null,
      message: error.message,
    });
  }
};

export default {
  userLogin,
  generateAuthToken,
  userRegister,
  fetchMotivationQuote,
};  
