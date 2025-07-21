import { Response } from "express";
const fs = require("fs");

export class HtmlFileReader {
  static readFile(file: string, res: Response) {
    return fs.readFile(file, function (error: any, fileContent: any) {
      if (error) {
        res.writeHead(404);
        res.write("Contents you are looking are Not Found in " + error);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(fileContent);
      }

      res.end();
    });
  }
}
