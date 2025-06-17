import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware to set grade based on marks before saving
prisma.$use(async (params, next) => {
  if (params.model === "Result" && (params.action === "create" || params.action === "update")) {
    const data = params.args.data;

    if (data.marks !== undefined) {
      if (data.marks >= 80) {
        data.grade = "A";
        data.points = 12
      } else if (data.marks >= 75) {
        data.grade = "A-";
        data.points = 11;
      } 
      else if (data.marks >= 70) {
        data.grade = "B+";
        data.points = 10;
      } 
      else if (data.marks >= 65) {
        data.grade = "B";
        data.points = 9;
      } 
      else if (data.marks >= 60) {
        data.grade = "B-";
        data.points = 8;
      } 
      else if (data.marks >= 55) {
        data.grade = "C+";
        data.points = 7;
      } 
      else if (data.marks >= 50) {
        data.grade = "C";
        data.points = 6;
      } 
      else if (data.marks >= 45) {
        data.grade = "C-";
        data.points = 5;
      } 
      else if (data.marks >= 40) {
        data.grade = "D+";
        data.points = 4;
      } 
      else if (data.marks >= 35) {
        data.grade = "D";
        data.points = 3;
      } else if (data.marks >= 30) {
        data.grade = "D-";
        data.points = 2;
      } else {
        data.grade = "E";
        data.points = 1;
      }
    }
  }

  return next(params);
});

export default prisma;
