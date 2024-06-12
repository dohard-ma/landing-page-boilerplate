"use server";

import fs from "fs";
import path from "path";

const fullHtml = fs.readFileSync(
  path.resolve(process.cwd(), "public/test.html"),
  "utf8"
);

function getBlockSize(screenHeight: number) {
  if (screenHeight > 1200) {
    return 2000;
  } else if (screenHeight > 800) {
    return 1500;
  } else {
    return 1000;
  }
}

export async function getHtml(query: { page: number; height: number }) {
  const { page = 1, height = 1000 } = query;
  const blockSize = getBlockSize(height);
  const startIndex = (page - 1) * blockSize;
  const endIndex = startIndex + blockSize;
  const htmlStr = fullHtml.substring(startIndex, endIndex);

  return htmlStr;
}

