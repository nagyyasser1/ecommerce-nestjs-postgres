import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ecommerce</title>
        <style>
        body{
          margin:0;
          padding:0;
        }
        </style>
    </head>
    <body>
        <div style="text-align: center; background-color: #f2f2f2; padding: 20px; min-height:93vh">
          <h1 style="color: #333;">Welcome to Our Awesome Ecommerce API</h1>
          <h3 style="color: #555;">We Hope You Find It Incredibly Useful</h3>
          <h4 style="color: #777;">Made with ❤️ by <a href="https://github.com/nagyyasser1" target="_blank">Nagy Yasser</a></h4>
          <h4 ><a href="/doc">see doc...</a><h4>
        </div>
    </body>
    </html>
     
    `;
  }
}
